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

    // dummy refs for Navbar since we aren't on the landing page
    const dummyRefs = {
        homeRef: React.useRef(null),
        aboutRef: React.useRef(null),
        teamRef: React.useRef(null),
        galleryRef: React.useRef(null),
        contactRef: React.useRef(null),
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEOHead
                title="About Us - Healthcare Innovation"
                description="Learn about Drepto Biodevices - India's leading telemedicine platform. Meet our expert team of doctors and healthcare professionals."
                keywords="about drepto, healthcare team, telemedicine company, medical professionals, healthcare innovation"
                url="/about-us"
            />
            {/* Navbar */}
            <Navbar
                sectionRefs={dummyRefs as any}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main className="flex-grow pt-[120px] lg:pt-[120px]">
                {/* Add padding top for desktop only since Navbar is fixed. MobileHeader is sticky. */}
                <div className="">
                    <div className="container mx-auto px-6 py-6">
                        <Breadcrumbs items={[{ label: 'About Us' }]} />
                    </div>
                    <GallerySection />
                    <AboutSection />
                    <TeamSection />
                </div>
            </main>

            <Footer />
        </div >
    );
};

export default AboutUsPage;
