import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';

interface LegalPageLayoutProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
    breadcrumbLabel: string;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children, breadcrumbLabel }) => {
    // Dummy refs for Navbar
    const dummyRefs = {
        home: { current: null },
        product: { current: null },
        about: { current: null },
        contact: { current: null },
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar
                sectionRefs={dummyRefs as any}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main className="flex-grow pt-24 md:pt-28 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <Breadcrumbs items={[{ label: breadcrumbLabel }]} className="mb-6" />
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <header className="mb-10 text-center border-b border-gray-100 pb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 font-display">{title}</h1>
                        {lastUpdated && (
                            <p className="text-gray-500 text-sm font-medium">Effective Date: {lastUpdated}</p>
                        )}
                    </header>
                    <div className="prose prose-teal prose-lg max-w-none text-gray-700">
                        {children}
                    </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LegalPageLayout;
