import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';


interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
}

const dummyRefs = {
  home: { current: null }, product: { current: null },
  about: { current: null }, contact: { current: null },
};

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, breadcrumbLabel, children }) => (
  <div className="flex flex-col min-h-screen bg-white">
    <Navbar sectionRefs={dummyRefs as any} />

    <main className="flex-grow pb-24">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* breadcrumb */}
        <div className="py-4">
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
        </div>

        {/* page header */}
        <div className="border-t border-gray-100 pt-8 mb-14">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none mb-3">{title}</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* content */}
        <div className="space-y-12">
          {children}
        </div>

      </div>
    </main>

    <Footer />
  </div>
);

export default LegalPageLayout;