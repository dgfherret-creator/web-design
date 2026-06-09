const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const root = path.resolve(__dirname, '..');
const input = path.join(root, 'public', 'assets', 'hero-poster.png');
const output = path.join(root, 'public', 'assets', 'hero-loop.webm');

const args = [
  '-y',
  '-loop',
  '1',
  '-i',
  input,
  '-t',
  '4',
  '-vf',
  'scale=1280:720,format=yuv420p',
  '-c:v',
  'libvpx',
  '-deadline',
  'realtime',
  '-cpu-used',
  '8',
  '-b:v',
  '900k',
  '-r',
  '24',
  output,
];

const result = spawnSync(ffmpeg.path, args, { stdio: 'inherit' });
if (result.error) {
  throw result.error;
}
process.exitCode = result.status ?? 0;
