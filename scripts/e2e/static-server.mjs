import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const portArg = process.argv[2];
const PORT = Number.parseInt(portArg ?? '4173', 10);
const ROOT_DIRECTORY = process.cwd();

const server = createServer((request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);
  const requestPath = decodeURIComponent(requestUrl.pathname);
  const normalizedPath = normalize(requestPath).replace(/^\/+/, '');
  if (normalizedPath.split('/').includes('..')) {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Bad Request');
    return;
  }

  const candidatePath = normalizedPath === '' ? 'index.html' : normalizedPath;
  const filePath = join(ROOT_DIRECTORY, candidatePath);

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not Found');
    return;
  }

  const extension = extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[extension] ?? 'application/octet-stream';
  response.writeHead(200, { 'content-type': contentType });
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, '127.0.0.1');
