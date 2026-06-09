@echo off
cd /d "%~dp0.."
set HOST=127.0.0.1
set PORT=5174
node scripts\dev-server-runner.mjs >> vite.window.out.log 2>> vite.window.err.log
