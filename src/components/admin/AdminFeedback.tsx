// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { FeedbackService } from '../../lib/api_controller';
import { RefreshCw, Star, MessageSquare } from 'lucide-react';

const AdminFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await FeedbackService.getAllApproved();
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setFeedback(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const avgRating = feedback.length
    ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Feedback & Reviews</h2>
          <p className="text-sm text-gray-500 mt-0.5">{feedback.length} responses · Avg rating {avgRating}</p>
        </div>
        <button onClick={fetchData} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading feedback…
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No feedback yet</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feedback.map((f: any, i: number) => (
            <div key={f._id || i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-semibold text-sm">
                    {(f.name || f.userName || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{f.name || f.userName || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{f.email || ''}</p>
                  </div>
                </div>
                {f.rating && (
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-amber-700">{f.rating}</span>
                  </div>
                )}
              </div>
              {f.message || f.comment || f.text ? (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{f.message || f.comment || f.text}</p>
              ) : (
                <p className="text-sm text-gray-300 italic">No message</p>
              )}
              {f.product && <p className="text-xs text-gray-400 mt-3 font-medium">Re: {f.product}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
