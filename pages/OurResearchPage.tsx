import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  X,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  FlaskConical,
  ChevronRight,
  ArrowRight,
  Microscope, Activity,
  Stethoscope,
  HeartPulse,
  Leaf,
  Scale,
  FileQuestion,
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

/**
 * Each entry in the auto-generated manifest.json.
 * `filename`, `url`, `sizeBytes` and `title` are always present.
 * Everything else comes from the optional .meta.json sidecar.
 */
interface ResearchEntry {
  filename: string;
  url: string;
  sizeBytes: number;
  title: string;
  // Optional rich fields from .meta.json
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Generic card for papers without a .meta.json sidecar ─────────────────────

const GenericCard: React.FC<{
  paper: ResearchEntry;
  onRead: () => void;
}> = ({ paper, onRead }) => (
  <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden hover:border-[#c01226]/40">
    <div className="h-2 w-full bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400" />

    <div className="p-6 sm:p-8 flex flex-col flex-grow">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <FileQuestion className="w-3.5 h-3.5 text-slate-500" />
          Research Paper
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          {formatBytes(paper.sizeBytes)}
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#c01226] transition-colors leading-snug mb-2">
        {paper.title}
      </h3>
      <p className="text-xs text-slate-500 font-mono mb-6 break-all">{paper.filename}</p>

      {/* No metadata notice */}
      <div className="flex-grow flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mb-6">
        <FileQuestion className="w-10 h-10 text-slate-300 mb-3" />
        <p className="text-sm font-semibold text-slate-500">No metadata file yet</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Drop a <code className="bg-slate-100 px-1 rounded font-mono text-[#c01226]">.meta.json</code> sidecar
          alongside this PDF in <code className="bg-slate-100 px-1 rounded font-mono text-[#c01226]">public/Research/</code> to
          populate a rich card with title, overview, outcomes and more.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onRead}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 shadow-md hover:shadow-lg transition-all group/btn"
        >
          <FileText className="w-4 h-4 text-slate-300 group-hover/btn:scale-110 transition-transform" />
          <span>Read more</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
        <a
          href={paper.url}
          download={paper.filename}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span className="sm:hidden">Download PDF</span>
        </a>
      </div>
    </div>
  </div>
);

// ── Rich card for papers with a .meta.json sidecar ───────────────────────────

const RichCard: React.FC<{
  paper: ResearchEntry;
  onRead: () => void;
}> = ({ paper, onRead }) => {
  const isClinical = paper.category === 'clinical';

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden hover:border-[#c01226]/40">
      {/* Accent bar */}
      <div
        className={`h-2 w-full ${
          isClinical
            ? 'bg-gradient-to-r from-teal-500 via-brand-500 to-cyan-500'
            : 'bg-gradient-to-r from-emerald-500 via-brand-600 to-teal-500'
        }`}
      />

      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isClinical
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isClinical ? (
              <Award className="w-3.5 h-3.5 text-cyan-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            {paper.type}
          </span>
          {paper.date && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              {paper.date}
            </span>
          )}
        </div>

        {/* Title & publication */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#c01226] transition-colors leading-snug">
          {paper.title}
        </h3>
        {paper.publication && (
          <p className="text-xs sm:text-sm font-medium text-[#c01226] mt-1 mb-4">
            {paper.publication}
          </p>
        )}

        {/* Overview */}
        {paper.overview && (
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 mb-6">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#c01226]" />
              Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">{paper.overview}</p>
          </div>
        )}

        {/* Safety-specific highlight blocks */}
        {paper.ipDetails && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Scale className="w-4 h-4 text-amber-700" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Intellectual Property &amp; Trademarks
              </h5>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono font-bold text-amber-900 mb-2">
              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-300">
                Patent: {paper.ipDetails.patentApp}
              </span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-300">
                TM App: {paper.ipDetails.trademarkApp}
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">{paper.ipDetails.details}</p>
          </div>
        )}

        {paper.safetyDetails && (
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Safety &amp; Biocompatibility Certification
              </h5>
            </div>
            <p className="text-xs text-emerald-900/90 leading-relaxed">{paper.safetyDetails.details}</p>
          </div>
        )}

        {/* Clinical-specific highlight blocks */}
        {paper.clinicalDetails && (
          <div className="space-y-3 mb-6">
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#c01226] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  96%
                </div>
                <div>
                  <h5 className="text-xs font-bold text-red-950 uppercase tracking-wider">
                    Key Clinical Outcome
                  </h5>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {paper.clinicalDetails.onsetSpeed}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  12h+
                </div>
                <div>
                  <h5 className="text-xs font-bold text-cyan-950 uppercase tracking-wider">
                    Sustained Release Performance
                  </h5>
                  <p className="text-xs text-cyan-900 mt-1 leading-relaxed">
                    {paper.clinicalDetails.cumulativeRelease}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Gastro-Sparing Alternative
                  </h5>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {paper.clinicalDetails.advantage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active ingredients */}
        {paper.actives && paper.actives.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#c01226]" />
              Key Ingredients &amp; Active Matrix
            </div>
            <div className="flex flex-wrap gap-1.5">
              {paper.actives.map((active, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80"
                >
                  {active}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key outcome metrics */}
        {paper.keyOutcomes && paper.keyOutcomes.length > 0 && (
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 mb-6 mt-auto">
            {paper.keyOutcomes.map((item, idx) => (
              <div key={idx} className="text-center p-2 rounded-xl bg-slate-50">
                <div className="text-base sm:text-lg font-bold text-[#c01226] font-mono leading-tight">
                  {item.value}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-tight mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRead}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-700 to-teal-700 hover:from-brand-800 hover:to-teal-800 shadow-md hover:shadow-lg transition-all group/btn"
          >
            <FileText className="w-4 h-4 text-red-300 group-hover/btn:scale-110 transition-transform" />
            <span>Read more</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <a
            href={paper.url}
            download={paper.filename}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Download Research PDF"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span className="sm:hidden">Download PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// ── PDF Reader Modal ───────────────────────────────────────────────────────────

const PdfReaderModal: React.FC<{
  paper: ResearchEntry;
  allPapers: ResearchEntry[];
  onClose: () => void;
  onSwitch: (p: ResearchEntry) => void;
}> = ({ paper, allPapers, onClose, onSwitch }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/90 backdrop-blur-md animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900/95 border-b border-slate-800 text-white z-10 shadow-lg flex-shrink-0">
        {/* Left: Doc info */}
        <div className="flex items-center gap-3 overflow-hidden pr-2">
          <div className="w-10 h-10 rounded-xl bg-[#c01226]/30 border border-[#c01226]/40 flex items-center justify-center text-red-300 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            {paper.type && (
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60 mr-2">
                {paper.type}
              </span>
            )}
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-lg mt-0.5">
              {paper.title}
            </h3>
          </div>
        </div>

        {/* Centre: document switcher tabs (desktop) */}
        {allPapers.length > 1 && (
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {allPapers.map((p) => (
              <button
                key={p.filename}
                onClick={() => onSwitch(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  paper.filename === p.filename
                    ? 'bg-[#c01226] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {p.title.length > 30 ? p.title.slice(0, 30) + '…' : p.title}
              </button>
            ))}
          </div>
        )}

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={paper.url}
            download={paper.filename}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Download</span>
          </a>
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>New Tab</span>
          </a>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Badges strip */}
      {paper.badges && paper.badges.length > 0 && (
        <div className="bg-slate-900 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center gap-4 overflow-x-auto text-xs text-slate-300 flex-shrink-0">
          {paper.badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 text-red-400" />
              {b}
            </span>
          ))}

          {/* Mobile document switcher */}
          {allPapers.length > 1 && (
            <div className="lg:hidden flex items-center gap-1 flex-shrink-0 ml-auto">
              <span className="text-[11px] text-slate-400 mr-1">Switch:</span>
              {allPapers.map((p) => (
                <button
                  key={p.filename}
                  onClick={() => onSwitch(p)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    paper.filename === p.filename
                      ? 'bg-[#c01226] text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {p.title.slice(0, 12)}…
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PDF viewer */}
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
            {/* Final fallback */}
            <div className="flex flex-col items-center justify-center p-8 text-center text-white h-full">
              <FileText className="w-16 h-16 text-red-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">Unable to preview PDF inline</h4>
              <p className="text-slate-300 max-w-md text-sm mb-6">
                Your browser may not support embedded PDF viewing. Open or download it directly.
              </p>
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#c01226] hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
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

// ── Main Page ─────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'clinical' | 'safety' | 'unknown';

const OurResearchPage: React.FC = () => {
  const [papers, setPapers] = useState<ResearchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<ResearchEntry | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ── Fetch manifest ──
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/Research/manifest.json?_=${Date.now()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`manifest.json not found (${res.status})`);
        return res.json();
      })
      .then((data: ResearchEntry[]) => {
        setPapers(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Could not load research papers. Please check back shortly.');
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  // ── Filter logic ──
  const filteredPapers = papers.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unknown') return !p.category;
    return p.category === activeTab;
  });

  const countByTab = (tab: FilterTab) =>
    tab === 'all'
      ? papers.length
      : tab === 'unknown'
      ? papers.filter((p) => !p.category).length
      : papers.filter((p) => p.category === tab).length;

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 text-slate-500 bg-slate-50">
          <Loader2 className="w-10 h-10 animate-spin text-[#c01226]" />
          <p className="text-base font-medium">Loading research papers…</p>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-grow flex flex-col items-center justify-center gap-4 text-slate-500 bg-slate-50 px-4 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <p className="text-base font-semibold text-slate-700">{error}</p>
          <p className="text-xs text-slate-400 max-w-sm">
            Make sure PDFs are placed in <code className="bg-slate-100 px-1 rounded">public/Research/</code> and
            the app has been rebuilt.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-grow">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f1f3f6] border-b border-slate-200/80">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/90 text-[#c01226] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-2xs">
                <Microscope className="w-4 h-4 text-[#c01226]" />
                <span>PIONEERING BIOMEDICAL SCIENCE • IIT BOMBAY COLLABORATION</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 font-display">
                Our Research &amp;{' '}
                <span className="text-[#c01226]">
                  Clinical Evidence
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-2 font-normal">
                Explore the scientific publications, preclinical safety certifications, and peer-reviewed studies
                validating Drepto Biodevices' breakthrough polyherbal transdermal drug delivery systems.
              </p>
            </div>
          </div>
        </section>

        {/* ── PAPERS GRID ──────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          {/* Section header + filter tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-[#c01226] font-bold text-xs uppercase tracking-widest mb-2">
                <FlaskConical className="w-4 h-4 text-[#c01226]" />
                <span>Published Research &amp; Regulatory Dossiers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Scientific Papers &amp; Preclinical Reports
              </h2>
              <p className="text-slate-600 mt-2 text-base max-w-2xl">
                Click{' '}
                <span className="font-semibold text-[#c01226]">Read more</span> on any card to view the full
                paper directly on this page.{' '}
                <span className="text-slate-400 text-sm">
                  New PDFs dropped in <code className="bg-slate-100 px-1 rounded text-[#c01226]">public/Research/</code> appear
                  automatically after the next build.
                </span>
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl self-start md:self-auto shadow-inner flex-wrap">
              {(['all', 'clinical', 'safety'] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all capitalize ${
                    activeTab === tab ? 'bg-[#c01226] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all' ? `All (${countByTab('all')})` : tab === 'clinical' ? `Clinical (${countByTab('clinical')})` : `Safety & ISO (${countByTab('safety')})`}
                </button>
              ))}
              {countByTab('unknown') > 0 && (
                <button
                  onClick={() => setActiveTab('unknown')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'unknown' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Other ({countByTab('unknown')})
                </button>
              )}
            </div>
          </div>

          {/* Cards */}
          {filteredPapers.length === 0 ? (
            <div className="py-24 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">No papers in this category yet</p>
              <p className="text-sm mt-1">Add PDFs to <code className="bg-slate-100 px-1 rounded">public/Research/</code> and rebuild.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {filteredPapers.map((paper) =>
                paper.overview ? (
                  <RichCard key={paper.filename} paper={paper} onRead={() => setSelectedPaper(paper)} />
                ) : (
                  <GenericCard key={paper.filename} paper={paper} onRead={() => setSelectedPaper(paper)} />
                )
              )}
            </div>
          )}
        </section>

        {/* ── SCIENCE EXPLAINER ────────────────────────────────────────────── */}
        <section className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[#c01226] font-bold text-xs uppercase tracking-widest">Scientific Innovation</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Why Drepto Transdermal Technology Outperforms Conventional Oral Relief
              </h2>
              <p className="text-slate-600 text-base mt-3">
                Oral NSAIDs frequently trigger gastrointestinal irritation, acid rebound, and liver metabolism.
                Our biphasic patch architecture delivers rapid, continuous relief right where it is needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  Icon: Clock,
                  color: 'brand',
                  title: 'Biphasic Drug Release',
                  desc: 'Immediate flux for relief within 30 minutes, followed by a sustained depot releasing 91.23% of actives over 12+ hours.',
                },
                {
                  Icon: ShieldCheck,
                  color: 'teal',
                  title: 'Gastro-Sparing Safety',
                  desc: 'By bypassing the stomach entirely, users experience zero nausea, gastric mucosal erosion, or dyspepsia.',
                },
                {
                  Icon: Leaf,
                  color: 'emerald',
                  title: 'Synergistic Polyherbal Matrix',
                  desc: 'Curcuma longa, Boswellia, Mentha piperita, Eucalyptus, and cinnamon synergistically inhibit COX/LOX inflammatory cascades.',
                },
                {
                  Icon: Award,
                  color: 'amber',
                  title: 'ISO 10993 Biocompatibility',
                  desc: 'PII score of 0 — hypoallergenic, breathable, and clinically verified non-irritant even during extended wear.',
                },
              ].map(({ Icon, color, title, desc }) => (
                <div
                  key={title}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#c01226]/50 hover:bg-white transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-${color}-500/10 text-${color}-700 flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* ── Modern Clinical Comparison Matrix: Transdermal vs Oral ── */}
            <div className="mt-16 bg-gradient-to-br from-white via-[#f8f9fa] to-[#ebedf1] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="max-w-3xl mb-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
                  <Activity className="w-3.5 h-3.5 text-[#c01226]" />
                  <span>PHARMACOKINETIC &amp; CLINICAL BENCHMARK</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
                  Targeted Transdermal Delivery vs. Conventional Oral NSAIDs
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                  How direct transdermal permeation overcomes the systemic toxicity and gastric erosion of traditional oral analgesics.
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#c01226] font-bold text-lg shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Onset Time</div>
                    <div className="text-base font-extrabold text-slate-900">&lt; 30 Minutes</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg shrink-0">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gastric Safety</div>
                    <div className="text-base font-extrabold text-slate-900">100% GI Safe</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                    ⏱️
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sustained Relief</div>
                    <div className="text-base font-extrabold text-slate-900">12+ Hours</div>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Dual Comparison Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                
                {/* Winner Card: Drepto MenstroHerb */}
                <div className="bg-white rounded-[2rem] border-2 border-[#c01226]/30 shadow-lg shadow-red-950/5 overflow-hidden flex flex-col justify-between">
                  <div className="bg-gradient-to-r from-[#c01226] to-red-600 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-100 block">Proprietary Transdermal Patch</span>
                      <h4 className="text-lg sm:text-xl font-black">Drepto MenstroHerb™</h4>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Clinical Standard
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 flex-1">
                    <div className="p-4 rounded-xl bg-red-50/50 border border-red-100/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Onset of Action</span>
                        <span className="text-xs font-extrabold text-[#c01226] bg-red-100 px-2.5 py-0.5 rounded-full">&lt; 30 Minutes</span>
                      </div>
                      <p className="text-xs text-slate-600">Rapid local micro-vascular diffusion yields 96% symptomatic dysmenorrhea relief in clinical testing.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50/50 border border-red-100/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Duration of Action</span>
                        <span className="text-xs font-extrabold text-[#c01226] bg-red-100 px-2.5 py-0.5 rounded-full">12+ Hours Continuous</span>
                      </div>
                      <p className="text-xs text-slate-600">Biphasic matrix delivery sustains continuous therapeutic levels across day and night without redosing.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">GI Safety Profile</span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">100% Gastro-Safe</span>
                      </div>
                      <p className="text-xs text-slate-600">Completely bypasses stomach and digestive tract, causing zero gastric erosion, hyperacidity, or ulcers.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50/50 border border-red-100/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Biocompatibility (PII)</span>
                        <span className="text-xs font-extrabold text-[#c01226] bg-red-100 px-2.5 py-0.5 rounded-full">PII = 0.00 (Zero Irritation)</span>
                      </div>
                      <p className="text-xs text-slate-600">Certified hypoallergenic under ISO 10993-23:2021 medical device biocompatibility benchmarks.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50/50 border border-red-100/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Formulation</span>
                        <span className="text-xs font-extrabold text-[#c01226] bg-red-100 px-2.5 py-0.5 rounded-full">Natural Polyherbal</span>
                      </div>
                      <p className="text-xs text-slate-600">Standardized extracts of Curcuma longa, Boswellia, Mentha piperita and Eucalyptus multi-target COX &amp; LOX pathways.</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">✓ SINE IIT Bombay Incubated &bull; JAIMS Peer-Reviewed</span>
                    <span className="text-[#c01226] font-bold">Recommended</span>
                  </div>
                </div>

                {/* Drawback Card: Conventional Oral NSAIDs */}
                <div className="bg-[#f8f9fa] rounded-[2rem] border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="bg-slate-200 text-slate-800 px-6 py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Conventional Oral Regimen</span>
                      <h4 className="text-lg sm:text-xl font-bold">Traditional Oral Painkillers</h4>
                    </div>
                    <span className="bg-slate-300 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Mefenamic / NSAID
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 flex-1">
                    <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Onset of Action</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">Slow: 45–60+ Minutes</span>
                      </div>
                      <p className="text-xs text-slate-500">Delayed gastric transit and liver metabolism delay pain mitigation, prolonging intense acute pain.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration of Action</span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">3–5 Hours (Repeat Dosing)</span>
                      </div>
                      <p className="text-xs text-slate-500">Rapid drop in plasma drug concentration requires taking 3–4 pills daily, creating wear-off pain spikes.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-800">GI Safety Profile</span>
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">Severe Ulcer Risk</span>
                      </div>
                      <p className="text-xs text-slate-500">Direct mucosal irritation causes stomach acid reflux, gastritis, nausea, and ulceration with repetitive use.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">First-Pass Metabolism</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">High Hepatic Burden</span>
                      </div>
                      <p className="text-xs text-slate-500">Up to 60% of active drug degraded by liver enzymes, requiring heavy chemical doses that strain internal organs.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Formulation</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">Synthetic NSAIDs</span>
                      </div>
                      <p className="text-xs text-slate-500">Single-action synthetic molecules with known long-term cardiovascular and renal contraindications.</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-100/70 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
                    <span>Higher organ load &bull; Unpleasant gastric distress</span>
                    <span className="text-slate-500 font-semibold">Conventional</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-teal-50/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-[#c01226] text-xs font-bold uppercase tracking-wider mb-4">
              <Stethoscope className="w-4 h-4 text-[#c01226]" />
              <span>Research Collaboration &amp; Clinical Inquiries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Partner With Drepto Biodevices
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              We collaborate with research institutions, clinical trial investigators, and healthcare distributors
              to advance targeted transdermal healthcare solutions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/our-products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#c01226] hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
              >
                <span>View Patented Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm transition-all"
              >
                <span>Contact Research Team</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── PDF Reader Modal ──────────────────────────────────────────────── */}
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
