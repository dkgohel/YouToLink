const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? '/api'
    : 'http://localhost:5001/api',
  SHORT_URL_BASE: process.env.NODE_ENV === 'production'
    ? 'https://u2l.in'
    : 'http://localhost:5001'
};

export default config;
