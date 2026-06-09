import { createServer } from 'vite';

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 5174);

const server = await createServer({
  clearScreen: false,
  server: {
    host,
    port,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();

const close = async () => {
  await server.close();
  process.exit(0);
};

process.on('SIGINT', close);
process.on('SIGTERM', close);

setInterval(() => {}, 2147483647);
