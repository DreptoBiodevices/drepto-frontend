import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { CITIES, LAB_TESTS_DATA, LAB_PACKAGES_DATA, LAB_REVIEWS } from '../constants';
import { LabTestDetail, LabPackageDetail } from '../types';
import { loadLabTests } from '../components/admin/LabTestData';
import { X, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

type View = 'home' | 'individual' | 'packages' | 'detail';

/* ── shared primitives ────────────────────────────────────── */

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ c }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">{c}</p>
);

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block text-[10px] font-semibold tracking-widest uppercase text-gray-500 bg-gray-100 px-2 py-1">
    {children}
  </span>
);

const BookBtn: React.FC<{ full?: boolean }> = ({ full }) => (
  <button
    style={{ borderRadius: '0.25rem' }}
    className={`${full ? 'w-full' : ''} px-5 py-2.5 bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors flex items-center justify-between gap-3`}
  >
    Book now <ArrowRight className="w-3 h-3" />
  </button>
);

/* ── City selector ────────────────────────────────────────── */
const CitySelector: React.FC<{
  current: string; onSelect: (id: string) => void; onClose: () => void;
}> = ({ current, onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40" onClick={onClose}>
    <div
      className="bg-white w-full max-w-sm p-6 shadow-2xl"
      style={{ borderRadius: '0.25rem' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Choose city</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CITIES.map(city => (
          <button
            key={city.id}
            onClick={() => { onSelect(city.id); onClose(); }}
            style={{ borderRadius: '0.25rem' }}
            className={`py-2.5 px-3 text-sm font-medium border transition-colors text-left ${
              current === city.id
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ── Sidebar ──────────────────────────────────────────────── */
const Sidebar: React.FC<{ active: string; onSelect: (v: string) => void }> = ({ active, onSelect }) => (
  <div className="hidden lg:block w-52 flex-shrink-0 sticky top-40 self-start">
    <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4 px-1">Browse</p>
    <div className="divide-y divide-gray-100">
      {[
        { id: 'tests',    label: 'Individual Tests' },
        { id: 'packages', label: 'Health Packages'  },
        { id: 'cities',   label: 'Top Cities'       },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full text-left py-3 px-1 text-sm transition-colors ${
            active === item.id
              ? 'font-bold text-primary'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  </div>
);

/* ── Detail view ──────────────────────────────────────────── */
const DetailView: React.FC<{
  item: LabTestDetail | LabPackageDetail;
  type: 'test' | 'package';
  onBack: () => void;
}> = ({ item, type, onBack }) => {
  const isTest = type === 'test';
  const params = isTest
    ? (item as LabTestDetail).parameters
    : (item as LabPackageDetail).testsIncluded;

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-8"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to {isTest ? 'Tests' : 'Packages'}
      </button>

      {/* hero */}
      <div className="border-b border-gray-100 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-3">
              {isTest ? 'Lab Test' : 'Health Package'}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
              {item.name}
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl mb-4">{item.description}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
              <span className="text-sm text-gray-400 line-through">₹{item.mrp}</span>
              <span className="text-xs font-bold text-green-600">{item.discount} off</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>
          <div className="flex-shrink-0 w-full md:w-48">
            <BookBtn full />
            {!isTest && (
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Ideal for {(item as LabPackageDetail).idealFor}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
        <div className="space-y-10">

          {/* quick facts */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">Quick Facts</p>
            <div className="divide-y divide-gray-100">
              {[
                { label: 'Report In',   value: item.reportTime },
                { label: 'Fasting',     value: item.fasting    },
                ...(isTest ? [
                  { label: 'Sample',    value: (item as LabTestDetail).sampleType },
                  { label: 'Tube Type', value: (item as LabTestDetail).tubeType   },
                ] : []),
                { label: 'Rating',      value: `${item.rating} / 5` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* parameters / tests included */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
              {isTest ? `Parameters (${params.length})` : `Tests Included (${params.length})`}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {params.map((p, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <span className="w-1 h-1 flex-shrink-0 bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* why it matters */}
          {isTest && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
                Why this test matters
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {(item as LabTestDetail).whyItMatters}
              </p>
            </div>
          )}

          {/* reviews */}
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Patient Reviews
            </p>
            <div className="divide-y divide-gray-100">
              {LAB_REVIEWS.slice(0, 2).map(rev => (
                <div key={rev.id} className="py-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-900">{rev.userName}</span>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                  <p className="text-xs text-yellow-500 mb-1">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</p>
                  <p className="text-sm text-gray-500 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* how it works */}
        <div className="sticky top-40 self-start border-l border-gray-100 pl-8">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-5">How it works</p>
          <div className="space-y-6">
            {[
              { n: '01', title: 'Book test',          body: 'Select your test and schedule a convenient slot.' },
              { n: '02', title: 'Sample collection',  body: 'A phlebotomist visits your home for collection.'  },
              { n: '03', title: 'Get report',          body: 'Receive your digital report within 24 hours.'     },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-4">
                <span className="text-xs tabular-nums text-gray-300 font-semibold flex-shrink-0 mt-0.5">{n}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main page ────────────────────────────────────────────── */
const LabTestsPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [view, setView] = useState<View>('home');
  const [selectedItem, setSelectedItem] = useState<LabTestDetail | LabPackageDetail | null>(null);
  const [detailType, setDetailType] = useState<'test' | 'package'>('test');
  const [tests, setTests] = useState<LabTestDetail[]>(LAB_TESTS_DATA as LabTestDetail[]);

  const dummyRefs = {
    home: { current: null }, product: { current: null },
    about: { current: null }, contact: { current: null },
  };

  const cityName = CITIES.find(c => c.id === selectedCity)?.name || 'Select City';

  const handleViewDetail = (item: LabTestDetail | LabPackageDetail, type: 'test' | 'package') => {
    setSelectedItem(item); setDetailType(type); setView('detail');
    window.scrollTo(0, 0);
  };

  const sidebarActive = view === 'packages' ? 'packages' : view === 'home' ? 'cities' : 'tests';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SEOHead
        title="Lab Tests at Home — Drepto"
        description="Book lab tests online with free home sample collection. Trusted labs, fast reports, affordable prices."
        keywords="lab tests at home, blood test, health checkup, pathology, home collection"
        url="/lab-tests"
      />

      {showCitySelector && (
        <CitySelector
          current={selectedCity}
          onSelect={setSelectedCity}
          onClose={() => setShowCitySelector(false)}
        />
      )}

      <div className="hidden md:block">
        <Navbar sectionRefs={dummyRefs as any} />
      </div>

      {/* sticky sub-header */}
      <div className="bg-white border-b border-gray-100 sticky top-[120px] z-30">
        <div className="container mx-auto px-6 max-w-6xl py-3 flex items-center justify-between">
          <button
            onClick={() => setShowCitySelector(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-primary transition-colors"
          >
            Delivering to: <span className="text-primary">{cityName}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* mobile tab switcher */}
          <div className="flex items-center gap-0 lg:hidden">
            {[
              { v: 'individual' as View, label: 'Tests'    },
              { v: 'packages'  as View, label: 'Packages' },
            ].map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs font-semibold border-b-2 transition-colors ${
                  view === v ? 'border-primary text-primary' : 'border-transparent text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-grow pt-8 pb-24">
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Lab Tests' }]} />
          </div>

          <div className="flex gap-16">

            {/* sidebar */}
            {view !== 'detail' && (
              <Sidebar
                active={sidebarActive}
                onSelect={v => {
                  if (v === 'tests')    setView('individual');
                  else if (v === 'packages') setView('packages');
                  else setView('home');
                }}
              />
            )}

            {/* content */}
            <div className="flex-1 min-w-0">

              {/* ── Tests listing ─────────────────── */}
              {(view === 'home' || view === 'individual') && (
                <div>
                  {/* page header */}
                  <div className="border-t border-gray-100 pt-8 mb-12">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">Lab Tests</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none">
                      Book tests in {cityName}.
                    </h1>
                  </div>

                  {/* category chips */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {tests.map(test => (
                      <button
                        key={test.id + '_cat'}
                        onClick={() => handleViewDetail(test, 'test')}
                        style={{ borderRadius: '0.25rem' }}
                        className="text-xs font-semibold px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                      >
                        {test.category}
                      </button>
                    ))}
                  </div>

                  {/* test list rows */}
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">Top Tests</p>
                  <div className="divide-y divide-gray-100">
                    {tests.map(test => (
                      <div key={test.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5">
                        <div className="flex-1 cursor-pointer" onClick={() => handleViewDetail(test, 'test')}>
                          <h3 className="text-base font-bold text-gray-900 hover:text-primary transition-colors mb-0.5">
                            {test.name}
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">{test.alias}</p>
                          <div className="flex gap-2">
                            <Chip>{test.reportTime} report</Chip>
                            <Chip>{test.fasting}</Chip>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-base font-bold text-gray-900">₹{test.price}</p>
                            <p className="text-xs text-gray-400 line-through">₹{test.mrp}</p>
                            <p className="text-[10px] font-bold text-green-600">{test.discount} off</p>
                          </div>
                          <BookBtn />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Packages listing ──────────────── */}
              {view === 'packages' && (
                <div>
                  <div className="border-t border-gray-100 pt-8 mb-12">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-2">Health Packages</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none">
                      Full body checkups<br />in {cityName}.
                    </h1>
                    <p className="text-sm text-gray-400 mt-3">Save up to 70% with free home collection.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {LAB_PACKAGES_DATA.map(pkg => (
                      <div key={pkg.id} className="flex flex-col p-6 first:pl-0 last:pr-0">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleViewDetail(pkg, 'package')}
                        >
                          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">
                            {pkg.testCount} tests
                          </p>
                          <h3 className="text-base font-bold text-gray-900 hover:text-primary transition-colors leading-snug mb-3 line-clamp-2">
                            {pkg.name}
                          </h3>
                          <p className="text-xs text-gray-400 mb-1">Ideal for {pkg.idealFor}</p>
                          <p className="text-xs text-gray-400 mb-4">Fasting: {pkg.fasting}</p>
                          <div className="flex gap-2 flex-wrap">
                            {pkg.testsIncluded.slice(0, 2).map((t, i) => <Chip key={i}>{t}</Chip>)}
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-base font-bold text-gray-900">₹{pkg.price}</p>
                            <p className="text-[10px] font-bold text-green-600">{pkg.discount} off</p>
                          </div>
                          <BookBtn />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Detail ────────────────────────── */}
              {view === 'detail' && selectedItem && (
                <DetailView
                  item={selectedItem}
                  type={detailType}
                  onBack={() => setView(detailType === 'test' ? 'individual' : 'packages')}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LabTestsPage;