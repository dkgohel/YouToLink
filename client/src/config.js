const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? '/api'  // Vercel will handle this
    : 'http://localhost:5001/api',
  SHORT_URL_BASE: process.env.NODE_ENV === 'production'
    ? window.location.origin  // Use current domain
    : 'http://localhost:5001'
};

export default config;
