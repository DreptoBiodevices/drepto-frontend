import React from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';
import GallerySection from '../components/GallerySection';

const AboutUsPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const dummyRefs = {
    homeRef: React.useRef(null),
    aboutRef: React.useRef(null),
    teamRef: React.useRef(null),
    galleryRef: React.useRef(null),
    contactRef: React.useRef(null),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SEOHead
        title="About Us — Drepto Biodevices"
        description="Learn about Drepto Biodevices — pioneering non-invasive drug delivery for rheumatoid arthritis. Meet our team of researchers and advisors."
        keywords="about drepto, biodevices, IIT Bombay, transdermal drug delivery, rheumatoid arthritis, medical innovation"
        url="/about-us"
      />

      <Navbar
        sectionRefs={dummyRefs as any}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-grow">

        {/* breadcrumb — slim, flush with content width */}
        {/* <div className="container mx-auto px-6 max-w-6xl py-4">
          <Breadcrumbs items={[{ label: 'About Us' }]} />
        </div> */}

        {/* page sections — content-first order */}
        <AboutSection />
        <TeamSection />
        <GallerySection />

      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;