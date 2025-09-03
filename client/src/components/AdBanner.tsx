import React, { useEffect } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {},
  className = ''
}) => {
  const publisherId = process.env.REACT_APP_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log('AdSense error:', error);
    }
  }, [publisherId, adSlot]);

  if (!publisherId) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
