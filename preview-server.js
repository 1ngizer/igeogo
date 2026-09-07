'use strict';
// Servidor estático mínimo SOLO para previsualizar la landing localmente.
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'landing');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };

http
  .createServer((req, res) => {
    let p = req.url.split('?')[0];
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(dir, p);
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('{}');
        return;
      }
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain' });
      res.end(data);
    });
  })
  .listen(process.env.PORT || 4599, function () {
    console.log('Landing preview en http://localhost:' + this.address().port);
  });
