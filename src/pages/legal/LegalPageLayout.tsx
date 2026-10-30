import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface LegalPageLayoutProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-slate-900">
            <Navbar />

            <main className="flex-grow">
                {/* Luminous Healthcare Hero */}
                <div className="bg-gradient-to-b from-[#f8f9fa] via-white to-[#f1f3f6] py-14 sm:py-20 px-4 sm:px-8 border-b border-slate-200/80 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
                            Legal &amp; Compliance
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4 font-display">
                            {title}
                        </h1>
                        {lastUpdated && (
                            <p className="text-slate-500 text-sm font-medium">
                                Effective Date: {lastUpdated}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content Document Card */}
                <div className="py-12 sm:py-16 px-4 sm:px-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-200/80 p-6 sm:p-12">
                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
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
