import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const app = express();
app.use(bodyParser.json());

const store: Record<string, { iosLink: string; androidLink: string }> = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Angular built files
app.use(express.static(path.join(__dirname, '../dist/universal-qr-angular/browser')));

// Generate QR
app.post('/api/generate', async (req, res) => {
  const { iosLink, androidLink } = req.body;
  if (!iosLink || !androidLink) return res.status(400).json({ error: 'Missing links' });

  const id = Math.random().toString(36).substring(2, 8);
  store[id] = { iosLink, androidLink };

  const redirectUrl = `${req.protocol}://${req.get('host')}/api/r/${id}`;
  const qrImage = await QRCode.toDataURL(redirectUrl);

  res.json({ redirectUrl, qrImage });
});

// Redirect based on OS
app.get('/api/r/:id', (req, res) => {
  const { id } = req.params;
  const entry = store[id];
  if (!entry) return res.status(404).send('Invalid QR code');

  const ua = req.headers['user-agent']?.toLowerCase() || '';
  if (/iphone|ipad|ipod/.test(ua)) return res.redirect(entry.iosLink);
  else if (/android/.test(ua)) return res.redirect(entry.androidLink);
  else {
    res.send(`
      <h3>Open this on a mobile device</h3>
      <p><a href="${entry.androidLink}">Android</a> | <a href="${entry.iosLink}">iOS</a></p>
    `);
  }
});

// Fallback to Angular routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/universal-qr-angular/browser/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
