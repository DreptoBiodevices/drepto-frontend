import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.dreptobiodevices.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://www.dreptobiodevices.com${item.href}` : undefined
      }))
    ]
  };

  useEffect(() => {
    const scriptId = 'breadcrumb-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(structuredData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [items]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`}
    >
      {/* Home Link */}
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
        aria-label="Go to homepage"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          {item.href && index < items.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={`${index === items.length - 1 ? 'text-gray-900 font-medium' : ''}`}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
