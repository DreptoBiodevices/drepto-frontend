import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
}

const BASE_URL = 'https://www.dreptobiodevices.com';
const DEFAULT_IMAGE = `${BASE_URL}/images/logo.png`;

const setMetaTag = (attr: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}) => {
  const fullTitle =
    title.trim() === 'Drepto Biodevices'
      ? 'Drepto Biodevices'
      : title.includes('Drepto Biodevices')
      ? title
      : `Drepto Biodevices | ${title}`;
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  useEffect(() => {
    document.title = fullTitle;

    setMetaTag('name', 'description', description);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // OpenGraph
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:type', type);

    // Twitter
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [fullTitle, description, keywords, fullUrl, image, type]);

  return null;
};

export default SEOHead;
