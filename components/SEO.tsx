
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    document.title = `${title} | CalcMaster`;

    // 2. Helper to set/update meta tags
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Helper to set/update Open Graph tags
    const setOg = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 4. Update Standard SEO Tags
    setMeta('description', description);
    setMeta('keywords', keywords);

    // 5. Update Open Graph Tags (Social Media)
    setOg('og:title', title);
    setOg('og:description', description);
    setOg('og:type', 'website');
    setOg('og:url', window.location.href);
    setOg('og:site_name', 'CalcMaster');

    // 6. Update Canonical URL (Prevents duplicate content issues)
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);

  }, [title, description, keywords, location]);

  return null;
};
