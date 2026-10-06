import React from 'react';
import { Helmet } from 'react-helmet-async';

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

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}) => {
  const fullTitle = `${title} | Drepto`;
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEOHead;
