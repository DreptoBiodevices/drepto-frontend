// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Film,
  Video,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  RefreshCw,
  Eye,
  Instagram,
  Youtube,
  Sparkles,
} from 'lucide-react';
import { SocialPostService } from '../../lib/api_controller';
import { SocialMediaPost } from '../../types';

interface ReelFormState {
  _id?: string;
  platform: 'reel' | 'instagram' | 'youtube' | 'video';
  uploadType: 'file' | 'url';
  title: string;
  caption: string;
  embedUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  order: number;
  isActive: boolean;
  date: string;
}

const initialForm: ReelFormState = {
  platform: 'reel',
  uploadType: 'file',
  title: '',
  caption: '',
  embedUrl: '',
  videoUrl: '',
  thumbnailUrl: '',
  order: 0,
  isActive: true,
  date: new Date().toISOString().split('T')[0],
};

const AdminReels: React.FC = () => {
  const [reels, setReels] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<SocialMediaPost | null>(null);
  const [form, setForm] = useState<ReelFormState>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Active playing card state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Load all reels (admin endpoint)
  const fetchReels = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch admin list (includes active and inactive)
      const res = await SocialPostService.getAllAdmin().catch(() => SocialPostService.getAll());
      const data = res?.data || [];
      // Sort: highest priority (lower order number first), then newest
      const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setReels(sorted);
    } catch (err: any) {
      console.error('Failed to fetch reels:', err);
      setError('Failed to load reels. Please ensure your backend is reachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Show transient notifications
  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Open modal for new reel
  const handleOpenNew = () => {
    setEditingReel(null);
    setForm({
      ...initialForm,
      order: reels.length,
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (reel: SocialMediaPost) => {
    setEditingReel(reel);
    setForm({
      _id: reel._id || reel.id,
      platform: (reel.platform as any) || 'reel',
      uploadType: 'url',
      title: reel.title || '',
      caption: reel.caption || '',
      embedUrl: reel.embedUrl || '',
      videoUrl: reel.videoUrl || reel.embedUrl || '',
      thumbnailUrl: reel.thumbnailUrl || '',
      order: reel.order ?? 0,
      isActive: reel.isActive !== false,
      date: reel.date || new Date().toISOString().split('T')[0],
    });
    setSelectedFile(null);
    setFilePreviewUrl(reel.videoUrl || reel.embedUrl || null);
    setModalOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, WebM, MOV)');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setFilePreviewUrl(localUrl);

    // Auto-fill title if empty
    if (!form.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setForm((prev) => ({ ...prev, title: cleanName }));
    }
  };

  // Convert selected video file to base64 data URL
  const uploadVideoFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Submit reel (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let finalEmbedUrl = form.embedUrl.trim();
      let finalVideoUrl = form.videoUrl.trim();

      // If uploading a file
      if (form.uploadType === 'file' && selectedFile) {
        setUploadProgress(30);
        const uploadedUrl = await uploadVideoFile(selectedFile);
        finalEmbedUrl = uploadedUrl;
        finalVideoUrl = uploadedUrl;
        setUploadProgress(90);
      } else if (!finalEmbedUrl && !finalVideoUrl) {
        setError('Please provide a video file or a video/reel URL.');
        setSaving(false);
        return;
      }

      // Ensure embedUrl has a value
      if (!finalEmbedUrl && finalVideoUrl) {
        finalEmbedUrl = finalVideoUrl;
      }

      // Auto-detect platform if URL is provided
      let detectedPlatform = form.platform;
      if (finalEmbedUrl.includes('instagram.com')) {
        detectedPlatform = 'instagram';
      } else if (finalEmbedUrl.includes('youtube.com') || finalEmbedUrl.includes('youtu.be')) {
        detectedPlatform = 'youtube';
      }

      const payload = {
        platform: detectedPlatform,
        embedUrl: finalEmbedUrl,
        videoUrl: finalVideoUrl || finalEmbedUrl,
        title: form.title.trim() || 'Drepto Reel',
        caption: form.caption.trim(),
        thumbnailUrl: form.thumbnailUrl.trim(),
        order: Number(form.order) || 0,
        isActive: Boolean(form.isActive),
        date: form.date,
      };

      if (editingReel) {
        const id = editingReel._id || editingReel.id;
        await SocialPostService.update(id, payload);
        notifySuccess('Reel updated successfully!');
      } else {
        await SocialPostService.create(payload);
        notifySuccess('New reel uploaded and published!');
      }

      setModalOpen(false);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      await fetchReels();

      // Trigger a sync event so homepage updates immediately if rendered
      window.dispatchEvent(new Event('reels-updated'));
    } catch (err: any) {
      console.error('Error saving reel:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to save reel. Please try again.');
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  // Toggle active state directly from table/card
  const handleToggleActive = async (reel: SocialMediaPost) => {
    try {
      const id = reel._id || reel.id;
      const nextActive = !reel.isActive;
      await SocialPostService.update(id, { isActive: nextActive });
      setReels((prev) =>
        prev.map((r) => (r._id === id || r.id === id ? { ...r, isActive: nextActive } : r))
      );
      notifySuccess(`Reel is now ${nextActive ? 'active' : 'hidden'} on the homepage.`);
      window.dispatchEvent(new Event('reels-updated'));
    } catch (err) {
      console.error('Failed to toggle active status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Delete reel
  const handleDelete = async (reel: SocialMediaPost) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${reel.title || reel.caption || 'this reel'}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const id = reel._id || reel.id;
      await SocialPostService.delete(id);
      setReels((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      notifySuccess('Reel deleted successfully.');
      window.dispatchEvent(new Event('reels-updated'));
    } catch (err) {
      console.error('Failed to delete reel:', err);
      alert('Failed to delete reel. Please try again.');
    }
  };

  // Quick stats
  const totalReels = reels.length;
  const activeReels = reels.filter((r) => r.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0B6F6D]/10 text-[#0B6F6D] flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  Homepage Reels &amp; Video Showcase
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Uploaded reels will display right inside the &ldquo;Curing the World, Caring Beyond&rdquo; section on the homepage.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchReels}
              title="Refresh"
              className="p-2.5 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B6F6D] hover:bg-[#0B5C5A] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Reel</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Reels</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalReels}</p>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Active on Homepage</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{activeReels}</p>
          </div>
          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-[11px] font-medium text-purple-600 uppercase tracking-wider">Supported Media</p>
            <p className="text-xs font-semibold text-purple-700 mt-1">MP4, WebM, Instagram, Shorts</p>
          </div>
          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-[11px] font-medium text-[#0B6F6D] uppercase tracking-wider">Homepage Placement</p>
            <p className="text-xs font-semibold text-[#0B6F6D] mt-1">&ldquo;Curing the World&rdquo; Card</p>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Reel Grid / Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
          <Loader2 className="w-8 h-8 text-[#0B6F6D] animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading reels...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0B6F6D] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Film className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Reels Uploaded Yet</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1 mb-5">
            Upload your first video reel (MP4/WebM) or add an Instagram Reel link. It will automatically show in the highlighted card on your homepage!
          </p>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B6F6D] hover:bg-[#0B5C5A] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Your First Reel</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reels.map((reel) => {
            const id = reel._id || reel.id;
            const isThisPlaying = playingId === id;
            const isVideoFile =
              reel.platform === 'reel' ||
              reel.platform === 'video' ||
              reel.embedUrl.endsWith('.mp4') ||
              reel.embedUrl.endsWith('.webm') ||
              reel.embedUrl.startsWith('data:video');
            const isInstagram = reel.platform === 'instagram' || reel.embedUrl.includes('instagram.com');
            const isYoutube =
              reel.platform === 'youtube' ||
              reel.embedUrl.includes('youtube.com') ||
              reel.embedUrl.includes('youtu.be');

            return (
              <div
                key={id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
                  reel.isActive !== false
                    ? 'border-gray-200 shadow-xs hover:shadow-md'
                    : 'border-dashed border-gray-300 opacity-70 bg-gray-50/50'
                }`}
              >
                {/* Media Preview Window */}
                <div className="relative aspect-[9/14] max-h-[380px] bg-slate-950 flex items-center justify-center overflow-hidden group">
                  {isVideoFile ? (
                    <>
                      <video
                        id={`admin-video-${id}`}
                        src={reel.videoUrl || reel.embedUrl}
                        poster={reel.thumbnailUrl}
                        className="w-full h-full object-cover"
                        loop
                        playsInline
                        muted={isMuted}
                        onPlay={() => setPlayingId(id)}
                        onPause={() => {
                          if (playingId === id) setPlayingId(null);
                        }}
                      />

                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            const vid = document.getElementById(`admin-video-${id}`) as HTMLVideoElement;
                            if (vid) {
                              if (vid.paused) {
                                vid.play();
                                setPlayingId(id);
                              } else {
                                vid.pause();
                                setPlayingId(null);
                              }
                            }
                          }}
                          className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                          {isThisPlaying ? (
                            <Pause className="w-5 h-5 fill-slate-900" />
                          ) : (
                            <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </>
                  ) : isInstagram ? (
                    <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-pink-900/60 via-purple-900/60 to-slate-950">
                      <Instagram className="w-12 h-12 text-pink-400 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-wider text-pink-200">Instagram Reel</p>
                      <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 px-2">
                        {reel.title || reel.caption || reel.embedUrl}
                      </p>
                      <a
                        href={reel.embedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>Open on Instagram</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : isYoutube ? (
                    <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-red-900/60 via-slate-900 to-slate-950">
                      <Youtube className="w-12 h-12 text-red-500 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-wider text-red-200">YouTube Short</p>
                      <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 px-2">
                        {reel.title || reel.caption || reel.embedUrl}
                      </p>
                      <a
                        href={reel.embedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>Open on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="text-white text-center p-4">
                      <Video className="w-10 h-10 mx-auto text-teal-400 mb-2" />
                      <p className="text-xs font-semibold text-gray-200">Direct Video Reel</p>
                    </div>
                  )}

                  {/* Platform Badge (Top Left) */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-xs bg-black/60 text-white border border-white/20">
                    {isInstagram ? (
                      <Instagram className="w-3 h-3 text-pink-400" />
                    ) : isYoutube ? (
                      <Youtube className="w-3 h-3 text-red-400" />
                    ) : (
                      <Film className="w-3 h-3 text-teal-400" />
                    )}
                    <span className="capitalize">{reel.platform || 'Reel'}</span>
                  </div>

                  {/* Priority Order Pill (Top Right) */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 text-slate-900 font-mono text-[10px] font-bold shadow-xs">
                    Order #{reel.order ?? 0}
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {reel.title || 'Untitled Reel'}
                    </h4>
                    {reel.caption && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {reel.caption}
                      </p>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                    {/* Active Switch */}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={reel.isActive !== false}
                        onChange={() => handleToggleActive(reel)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0B6F6D] relative" />
                      <span className="text-[11px] font-medium text-gray-600">
                        {reel.isActive !== false ? 'Live on Home' : 'Hidden'}
                      </span>
                    </label>

                    {/* Edit & Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(reel)}
                        title="Edit reel info"
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(reel)}
                        title="Delete reel"
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── UPLOAD / EDIT REEL MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden my-8 animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0B6F6D]/10 text-[#0B6F6D] flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingReel ? 'Edit Reel Details' : 'Upload New Reel to Homepage'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Upload Type Selector (File vs Link) */}
              {!editingReel && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, uploadType: 'file', platform: 'reel' }));
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      form.uploadType === 'file'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    📁 Upload Video File (.mp4, .webm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, uploadType: 'url', platform: 'instagram' }));
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      form.uploadType === 'url'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    🔗 Paste Reel / Video Link
                  </button>
                </div>
              )}

              {/* Video File Drop Area (Only if uploadType is file) */}
              {form.uploadType === 'file' && !editingReel ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Video File (Recommended 9:16 vertical ratio)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 hover:border-[#0B6F6D] rounded-xl cursor-pointer bg-slate-50/70 hover:bg-slate-50 transition-colors p-4">
                    <UploadCloud className="w-8 h-8 text-[#0B6F6D] mb-2" />
                    <p className="text-xs font-semibold text-gray-700">
                      {selectedFile ? selectedFile.name : 'Click to select or drag & drop video'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Supports MP4, WebM, MOV (Under 50MB recommended)
                    </p>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Local video preview if selected */}
                  {filePreviewUrl && (
                    <div className="mt-3 p-3 bg-slate-900 rounded-xl flex items-center gap-3">
                      <video src={filePreviewUrl} className="w-12 h-16 object-cover rounded-lg" autoPlay muted loop />
                      <div className="text-white text-xs min-w-0 flex-1">
                        <p className="font-semibold truncate">{selectedFile?.name}</p>
                        <p className="text-[10px] text-emerald-400 mt-0.5">Ready to upload</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Reel or Video URL Input */
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Reel Link / Video URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.embedUrl}
                    onChange={(e) => setForm({ ...form, embedUrl: e.target.value })}
                    placeholder="e.g. https://www.instagram.com/reel/C-xyz... or https://.../reel.mp4"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0B6F6D] focus:ring-1 focus:ring-[#0B6F6D]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Accepts Instagram Reel links, YouTube Shorts, or direct .mp4/.webm video links.
                  </p>
                </div>
              )}

              {/* Title / Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Reel Title / Product Highlight
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. MenstroHerb 12-Hour Relief In Action"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0B6F6D] focus:ring-1 focus:ring-[#0B6F6D]"
                />
              </div>

              {/* Caption / Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Caption / Subtitle (Shown on homepage hover)
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Briefly describe what happens in this reel or highlight clinical benefits..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0B6F6D] focus:ring-1 focus:ring-[#0B6F6D]"
                />
              </div>

              {/* Priority Order & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Display Order (0 = first)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0B6F6D] focus:ring-1 focus:ring-[#0B6F6D]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B6F6D] relative" />
                    <span className="text-xs font-semibold text-gray-700">Display Live on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#0B6F6D] hover:bg-[#0B5C5A] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{uploadProgress ? `Uploading (${uploadProgress}%)...` : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{editingReel ? 'Update Reel' : 'Publish Reel'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReels;

