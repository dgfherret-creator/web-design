const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const out = fs.openSync(path.join(root, 'vite.detached.out.log'), 'a');
const err = fs.openSync(path.join(root, 'vite.detached.err.log'), 'a');

const child = spawn(
  process.execPath,
  [
    path.join(root, 'scripts', 'dev-server-runner.mjs'),
  ],
  {
    cwd: root,
    detached: true,
    stdio: ['ignore', out, err],
    windowsHide: true,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: '5174',
    },
  },
);

child.unref();
console.log(child.pid);
