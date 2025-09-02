module.exports = async (req, res) => {
  const shortCode = req.query.shortCode || req.url.split('/').pop();

  if (!shortCode) {
    return res.status(400).json({ error: 'Short code required' });
  }

  try {
    const shortUrl = `https://u2l.in/${shortCode}`;
    
    // Generate QR code using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortUrl)}`;
    
    res.json({
      qrCode: qrUrl,
      shortUrl: shortUrl
    });
    
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};
