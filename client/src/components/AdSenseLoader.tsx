import { useEffect } from 'react';

const AdSenseLoader: React.FC = () => {
  useEffect(() => {
    const publisherId = process.env.REACT_APP_ADSENSE_PUBLISHER_ID;
    
    if (publisherId && !document.querySelector(`script[src*="${publisherId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default AdSenseLoader;
