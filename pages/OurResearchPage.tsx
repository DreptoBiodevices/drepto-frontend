import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FileText,
  Download,
  ExternalLink,
  X,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────────────────────────

interface KeyOutcome {
  label: string;
  value: string;
  description: string;
}

interface IpDetails {
  patentApp: string;
  trademarkApp: string;
  details: string;
}

interface SafetyDetails {
  standard: string;
  studyNumber: string;
  piiScore: string;
  classification: string;
  details: string;
}

interface ClinicalDetails {
  journal: string;
  citation: string;
  onsetSpeed: string;
  cumulativeRelease: string;
  advantage: string;
}

interface ResearchEntry {
  filename: string;
  url: string;
  sizeBytes: number;
  title: string;
  id?: string;
  subtitle?: string;
  type?: string;
  category?: 'safety' | 'clinical';
  institution?: string;
  publication?: string;
  date?: string;
  badges?: string[];
  overview?: string;
  keyOutcomes?: KeyOutcome[];
  actives?: string[];
  ipDetails?: IpDetails;
  safetyDetails?: SafetyDetails;
  clinicalDetails?: ClinicalDetails;
}

// ── Fallback papers in case manifest fetch is delayed or offline ──────────────

const defaultPapers: ResearchEntry[] = [
  {
    filename: 'Drepto_MenstroHerb_Summary_and_NLS-TX-270.pdf',
    url: '/Research/Drepto_MenstroHerb_Summary_and_NLS-TX-270.pdf',
    sizeBytes: 6381702,
    title: 'Drepto MenstroHerb sheet summary and preclinical safety report',
    type: 'PRECLINICAL SAFETY AND REGULATORY REPORT',
    category: 'safety',
    date: '2026',
    publication: 'Study No. NLS-TX-270/26 · Certified laboratory study',
    overview:
      'Summarizes the preclinical safety evaluation of the MenstroHerb transdermal patch, including skin irritation testing performed in line with ISO 10993-23:2021. In-vivo evaluation confirmed a Primary Irritation Index (PII) score of 0.00 with zero erythema and zero edema, classifying the patch formulation as completely non-irritant.',
  },
  {
    filename: 'jaims-6678.pdf',
    url: '/Research/jaims-6678.pdf',
    sizeBytes: 677485,
    title: 'JAIMS research article: clinical and formulation study',
    type: 'PEER-REVIEWED JOURNAL ARTICLE',
    category: 'clinical',
    date: '2026',
    publication:
      'Journal of Ayurveda and Integrated Medical Sciences (JAIMS) 2026; 11(7): 107–117 · Peer-reviewed original research',
    overview:
      'Describes the formulation, in-vitro drug release, and clinical evaluation of the transdermal patch. In clinical evaluation of female participants with primary dysmenorrhea, 96% reported rapid onset of pain relief within 30 minutes, accompanied by a sustained 91.23% cumulative drug release profile over 12 hours.',
  },
];

// ── PDF Reader Modal ───────────────────────────────────────────────────────────

const PdfReaderModal: React.FC<{
  paper: ResearchEntry;
  allPapers: ResearchEntry[];
  onClose: () => void;
  onSwitch: (p: ResearchEntry) => void;
}> = ({ paper, allPapers, onClose, onSwitch }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/90 backdrop-blur-md animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-white z-10 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden pr-2">
          <div className="w-9 h-9 rounded-lg bg-[#00594C]/30 border border-[#00594C]/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            {paper.type && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mr-2">
                {paper.type}
              </span>
            )}
            <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-xs sm:max-w-lg">
              {paper.title}
            </h3>
          </div>
        </div>

        {/* Desktop switcher */}
        {allPapers.length > 1 && (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {allPapers.map((p) => (
              <button
                key={p.filename}
                onClick={() => onSwitch(p)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  paper.filename === p.filename
                    ? 'bg-[#00594C] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {p.title.length > 32 ? p.title.slice(0, 32) + '…' : p.title}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={paper.url}
            download={paper.filename}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download</span>
          </a>
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>New Tab</span>
          </a>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Badges strip */}
      {paper.badges && paper.badges.length > 0 && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2 flex items-center gap-4 overflow-x-auto text-xs text-slate-300 flex-shrink-0">
          {paper.badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {b}
            </span>
          ))}
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 w-full relative bg-slate-900 flex flex-col overflow-hidden">
        <object
          data={`${paper.url}#toolbar=1&navpanes=0&view=FitH`}
          type="application/pdf"
          className="w-full h-full flex-grow border-0 bg-slate-800"
        >
          <iframe
            src={`${paper.url}#toolbar=1&navpanes=0&view=FitH`}
            title={paper.title}
            className="w-full h-full flex-grow border-0 bg-white"
          >
            <div className="flex flex-col items-center justify-center p-8 text-center text-white h-full">
              <FileText className="w-16 h-16 text-emerald-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">Unable to preview PDF inline</h4>
              <p className="text-slate-300 max-w-md text-sm mb-6">
                Your browser may not support embedded PDF viewing. Open or download it directly.
              </p>
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-[#00594C] hover:bg-[#00473C] text-white font-semibold text-sm transition-colors inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Browser</span>
              </a>
            </div>
          </iframe>
        </object>
      </div>
    </div>
  );
};

// ── Main Page Component ───────────────────────────────────────────────────────

type FilterTab = 'all' | 'clinical' | 'safety';

const OurResearchPage: React.FC = () => {
  const [papers, setPapers] = useState<ResearchEntry[]>(defaultPapers);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<ResearchEntry | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ── Fetch manifest dynamically ──
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/Research/manifest.json?_=${Date.now()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`manifest.json not found (${res.status})`);
        return res.json();
      })
      .then((data: ResearchEntry[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map to ensure titles & formatting align with the concept design
          const mapped = data.map((item) => {
            const isSafety =
              item.category === 'safety' ||
              item.filename.toLowerCase().includes('nls') ||
              item.filename.toLowerCase().includes('menstroherb');
            return {
              ...item,
              category: (isSafety ? 'safety' : 'clinical') as 'safety' | 'clinical',
              type: isSafety
                ? 'PRECLINICAL SAFETY AND REGULATORY REPORT'
                : 'PEER-REVIEWED JOURNAL ARTICLE',
              title: isSafety
                ? 'Drepto MenstroHerb sheet summary and preclinical safety report'
                : 'JAIMS research article: clinical and formulation study',
              publication: isSafety
                ? 'Study No. NLS-TX-270/26 · Certified laboratory study'
                : 'Journal of Ayurveda and Integrated Medical Sciences (JAIMS) 2026; 11(7): 107–117 · Peer-reviewed original research',
              overview: isSafety
                ? 'Summarizes the preclinical safety evaluation of the MenstroHerb transdermal patch, including skin irritation testing performed in line with ISO 10993-23:2021. In-vivo evaluation confirmed a Primary Irritation Index (PII) score of 0.00 with zero erythema and zero edema, classifying the patch formulation as completely non-irritant.'
                : 'Describes the formulation, in-vitro drug release, and clinical evaluation of the transdermal patch. In clinical evaluation of female participants with primary dysmenorrhea, 96% reported rapid onset of pain relief within 30 minutes, accompanied by a sustained 91.23% cumulative drug release profile over 12 hours.',
            };
          });
          setPapers(mapped);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to default configured papers
        setPapers(defaultPapers);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const clinicalCount = papers.filter((p) => p.category === 'clinical').length;
  const safetyCount = papers.filter((p) => p.category === 'safety').length;

  const filteredPapers = papers.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00594C] selection:text-white">
      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-grow">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16">
          {/* ── HEADER ──────────────────────────────────────────────────────── */}
          <header className="mb-12 sm:mb-14">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#00594C] mb-3">
              RESEARCH
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 tracking-tight leading-tight mb-4">
              Our research and clinical evidence
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              A list of the published papers, preclinical safety reports, and peer-reviewed studies
              on Drepto's transdermal patch technology. Each entry links to its full document.
            </p>

          </header>

          {/* ── PUBLISHED PAPERS AND REPORTS ─────────────────────────────────── */}
          <section className="mb-14 sm:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-slate-200 mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Published papers and reports
              </h2>

              {/* Filter Tabs / Links */}
              <div className="flex items-center text-sm font-medium">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`transition-colors ${
                    activeTab === 'all'
                      ? 'underline underline-offset-4 font-semibold text-[#00594C]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({papers.length})
                </button>
                <span className="mx-2 text-slate-400">·</span>
                <button
                  onClick={() => setActiveTab('clinical')}
                  className={`transition-colors ${
                    activeTab === 'clinical'
                      ? 'underline underline-offset-4 font-semibold text-[#00594C]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clinical ({clinicalCount})
                </button>
                <span className="mx-2 text-slate-400">·</span>
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`transition-colors ${
                    activeTab === 'safety'
                      ? 'underline underline-offset-4 font-semibold text-[#00594C]'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Safety ({safetyCount})
                </button>
              </div>
            </div>

            {/* List of Papers */}
            {loading ? (
              <div className="py-12 flex items-center justify-center gap-3 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-[#00594C]" />
                <span className="text-sm">Loading research records…</span>
              </div>
            ) : filteredPapers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No publications found in this category.
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-12">
                {filteredPapers.map((paper) => {
                  const isClinical = paper.category === 'clinical';
                  const readButtonText = isClinical ? 'Read full article' : 'Read full report';

                  return (
                    <article key={paper.filename} className="pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#00594C] mb-2">
                        {paper.type ||
                          (isClinical
                            ? 'PEER-REVIEWED JOURNAL ARTICLE'
                            : 'PRECLINICAL SAFETY AND REGULATORY REPORT')}{' '}
                        · {paper.date || '2026'}
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-1.5">
                        {paper.title}
                      </h3>

                      {paper.publication && (
                        <p className="text-sm text-slate-500 mb-3.5">{paper.publication}</p>
                      )}

                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-5">
                        {paper.overview}
                      </p>

                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => setSelectedPaper(paper)}
                          className="bg-[#00594C] hover:bg-[#00473C] text-white text-sm font-medium px-5 py-2.5 rounded transition-colors"
                        >
                          {readButtonText}
                        </button>
                        <a
                          href={paper.url}
                          download={paper.filename}
                          className="text-sm font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 transition-colors"
                        >
                          Download PDF
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── ADDITIONAL FILINGS: INTELLECTUAL PROPERTY ──────────────────── */}
          <hr className="border-t border-slate-200 my-12 sm:my-14" />

          <section className="mb-14 sm:mb-16">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#00594C] mb-2">
              ADDITIONAL FILINGS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1.5">
              Intellectual property
            </h2>
            <p className="text-sm text-slate-500 mb-3.5">
              Patent application IN202521129798 · Trademark application 7344054
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Proprietary polyherbal transdermal matrix and formulation architecture filed under
              Indian Patent Application IN202521129798 and registered Trademark Application 7344054
              with IP India.
            </p>
          </section>

          {/* ── COMPARISON TABLE ────────────────────────────────────────────── */}
          <hr className="border-t border-slate-200 my-12 sm:my-14" />

          <section className="mb-16 sm:mb-20">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#00594C] mb-2">
              COMPARISON
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Transdermal patch and oral medicines
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Each route of administration has different advantages and limitations. The table
              below describes the general features of each. Consult a doctor or pharmacist to decide
              which option is suitable for you.
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-3 px-4 sm:px-0 font-medium text-slate-900 w-1/4"></th>
                    <th className="py-3 px-4 font-semibold text-slate-900 w-[38%]">
                      Transdermal patch (MenstroHerb)
                    </th>
                    <th className="py-3 px-4 font-semibold text-slate-900 w-[37%]">
                      Oral tablets
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm sm:text-[15px]">
                  <tr>
                    <td className="py-4 sm:py-5 px-4 sm:px-0 font-semibold text-slate-900 align-top">
                      How it is taken
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-700 align-top leading-relaxed">
                      Applied to the skin
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-600 align-top leading-relaxed">
                      Swallowed
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 sm:py-5 px-4 sm:px-0 font-semibold text-slate-900 align-top">
                      Stomach effects
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-700 align-top leading-relaxed">
                      Bypasses the stomach. Preclinical study reports no gastric irritation from
                      the patch itself.
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-600 align-top leading-relaxed">
                      May cause stomach irritation or nausea in some people, particularly with
                      regular use.
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 sm:py-5 px-4 sm:px-0 font-semibold text-slate-900 align-top">
                      Onset and duration
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-700 align-top leading-relaxed">
                      Rapid onset within 30 minutes; sustained biphasic release over 12+ continuous
                      hours.
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-600 align-top leading-relaxed">
                      Typical onset within 45–60 minutes; short 3–5 hour duration requiring
                      repeated daily doses.
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 sm:py-5 px-4 sm:px-0 font-semibold text-slate-900 align-top">
                      Safety testing
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-700 align-top leading-relaxed">
                      Preclinical irritation testing under ISO 10993-23:2021.
                    </td>
                    <td className="py-4 sm:py-5 px-4 text-slate-600 align-top leading-relaxed">
                      Regulated as a drug. Refer to the product label for warnings.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── RESEARCH ENQUIRIES / BOTTOM ACTIONS ─────────────────────────── */}
          <section className="pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Research enquiries
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  For clinical investigators, research institutions, and distributors.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/contact"
                  className="border border-[#00594C] text-[#00594C] hover:bg-[#00594C]/5 text-sm font-medium px-5 py-2.5 rounded transition-colors"
                >
                  Contact research team
                </Link>
                <Link
                  to="/our-products"
                  className="bg-[#00594C] hover:bg-[#00473C] text-white text-sm font-medium px-5 py-2.5 rounded transition-colors shadow-sm"
                >
                  View products
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── PDF Reader Modal ────────────────────────────────────────────────── */}
      {selectedPaper && (
        <PdfReaderModal
          paper={selectedPaper}
          allPapers={papers}
          onClose={() => setSelectedPaper(null)}
          onSwitch={(p) => setSelectedPaper(p)}
        />
      )}

      <Footer />
    </div>
  );
};

export default OurResearchPage;
