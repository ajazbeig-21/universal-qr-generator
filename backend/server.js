import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qrDir = path.join(__dirname, 'qrcodes');
if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

app.use(cors());
app.use(bodyParser.json());
app.use('/qrcodes', express.static(qrDir));

app.post('/api/generate', async (req, res) => {
  const { iosLink, androidLink } = req.body;
  if (!iosLink || !androidLink) {
    return res.status(400).json({ error: 'Both iOS and Android links are required' });
  }

  try {
    const id = Date.now().toString();
    const redirectUrl = `http://localhost:${PORT}/redirect/${id}`;
    const dataFile = path.join(qrDir, `${id}.json`);
    const qrPath = path.join(qrDir, `${id}.png`);

    fs.writeFileSync(dataFile, JSON.stringify({ iosLink, androidLink }));

    console.log('Generating QR for:', redirectUrl);
    await QRCode.toFile(qrPath, redirectUrl, {
      color: { dark: '#000000', light: '#ffffff' },
      width: 300
    });

    res.json({
      id,
      qrUrl: `http://localhost:${PORT}/qrcodes/${id}.png`,
      redirectUrl
    });
  } catch (err) {
    console.error('❌ Error generating QR:', err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/redirect/:id', (req, res) => {
  const dataFile = path.join(qrDir, `${req.params.id}.json`);
  if (!fs.existsSync(dataFile)) return res.status(404).send('Invalid QR');

  const data = JSON.parse(fs.readFileSync(dataFile));
  const ua = req.headers['user-agent'] || '';
  const target = /iphone|ipad|ipod/i.test(ua) ? data.iosLink : data.androidLink;
  res.redirect(target);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
