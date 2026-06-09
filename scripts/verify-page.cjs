const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9334;
const baseUrl = 'http://127.0.0.1:5174/';
const profileDir = path.join(root, '.chrome-verify');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForJson(url, attempts = 40) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      await sleep(250);
    }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function createPageTarget() {
  const response = await fetch(`${baseDebugUrl()}/json/new?${encodeURIComponent(baseUrl)}`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error(`Could not create Chrome target: ${response.status}`);
  }
  return response.json();
}

function baseDebugUrl() {
  return `http://127.0.0.1:${port}`;
}

function connect(url) {
  const socket = new WebSocket(url);
  let id = 0;
  const pending = new Map();

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          id += 1;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((resolveCommand, rejectCommand) => {
            pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
          });
        },
        close() {
          socket.close();
        },
      });
    });
    socket.addEventListener('error', reject);
  });
}

async function main() {
  fs.mkdirSync(profileDir, { recursive: true });
  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profileDir}`,
      `--remote-debugging-port=${port}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  try {
    await waitForJson(`${baseDebugUrl()}/json/version`);
    const target = await createPageTarget();
    const cdp = await connect(target.webSocketDebuggerUrl);

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: baseUrl });
    await sleep(1800);

    const anchors = [
      ['home', 'document.documentElement.scrollTo(0, 0)'],
      ['profile', "document.querySelector('#profile').scrollIntoView({ block: 'start' })"],
      ['projects', "document.querySelector('#projects').scrollIntoView({ block: 'start' })"],
      ['strengths', "document.querySelector('#strengths').scrollIntoView({ block: 'start' })"],
      ['contact', "document.querySelector('#contact').scrollIntoView({ block: 'start' })"],
    ];

    for (const [name, expression] of anchors) {
      await cdp.send('Runtime.evaluate', { expression });
      await sleep(700);
      const screenshot = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
      });
      fs.writeFileSync(path.join(root, `preview-${name}.png`), Buffer.from(screenshot.data, 'base64'));
    }

    const audit = await cdp.send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const imageInfo = Array.from(document.images).map((image) => ({
          src: image.getAttribute('src'),
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        }));
        const video = document.querySelector('.hero-video');
        const sections = Array.from(document.querySelectorAll('section')).map((section) => ({
          id: section.id,
          minHeight: getComputedStyle(section).minHeight,
          textLength: section.innerText.trim().length,
        }));
        return {
          title: document.title,
          h1: document.querySelector('h1')?.innerText,
          navCount: document.querySelectorAll('.site-nav a').length,
          projectCards: document.querySelectorAll('.project-card').length,
          strengthCards: document.querySelectorAll('.strength-card').length,
          maxShell: getComputedStyle(document.documentElement).getPropertyValue('--max').trim(),
          bodyMinWidth: getComputedStyle(document.body).minWidth,
          video: video ? {
            currentSrc: video.currentSrc,
            readyState: video.readyState,
            paused: video.paused,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
          } : null,
          imageInfo,
          sections,
        };
      })()`,
    });

    fs.writeFileSync(
      path.join(root, 'preview-audit.json'),
      JSON.stringify(audit.result.value, null, 2),
    );
    cdp.close();
  } finally {
    chrome.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
