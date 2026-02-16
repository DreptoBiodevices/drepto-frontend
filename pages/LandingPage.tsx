
import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProductSection from '../components/ProductSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

import FeaturedMedicines from '../components/FeaturedMedicines';
import PopularLabTests from '../components/PopularLabTests';
import GallerySection from '../components/GallerySection';
import TestimonialsPreview from '../components/TestimonialsPreview';

const LandingPage: React.FC = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    home: homeRef,
    product: productRef,
    about: aboutRef,
    contact: contactRef,
  };

  // ...

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative">
      <Navbar
        sectionRefs={sectionRefs}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content - Visible on all screens */}
      <main>
        <div ref={homeRef}><HeroSection /></div>
        <div ref={productRef}><ProductSection /></div>
        <FeaturedMedicines />
        <PopularLabTests />
        <div ref={aboutRef}><AboutSection /></div>

        {/* Gallery Section with Mobile Nav Support */}
        <div className="relative">
          <GallerySection onOpenMenu={() => setIsMobileMenuOpen(true)} />
        </div>

        {/* Testimonials Preview */}
        <TestimonialsPreview />

        <div ref={contactRef}><ContactSection /></div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
