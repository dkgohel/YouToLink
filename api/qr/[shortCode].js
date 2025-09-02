const QRCode = require('qrcode');

module.exports = async (req, res) => {
  const { shortCode } = req.query;

  if (!shortCode) {
    return res.status(400).json({ error: 'Short code required' });
  }

  try {
    const url = `https://u2l.in/${shortCode}`;
    const qrCode = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({ qrCode });
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};
