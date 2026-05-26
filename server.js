const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();

// Reutiliza os mesmos certificados que já existem no projeto
const sslOptions = {
  key:  fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
};

// Proxy: /rt/v1 → backend interno (servidor fala com servidor, sem CORS)
app.use(
  '/rt/v1',
  createProxyMiddleware({
    target: 'https://10.5.59.107:3020',
    changeOrigin: true,
    secure: false, // aceita cert autoassinado internamente
    logLevel: 'warn',
  })
);

// Serve o mesmo build do React (compartilhado com o processo da intranet)
app.use(express.static(path.join(__dirname, 'build')));

// Fallback para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

https.createServer(sslOptions, app).listen(10991, '0.0.0.0', () => {
  console.log('✅ Frontend externo + proxy rodando em https://0.0.0.0:10991');
});