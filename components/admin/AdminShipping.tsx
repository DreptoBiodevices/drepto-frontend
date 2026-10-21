// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ShippingAddressService } from '../../lib/api_controller';
import { Search, RefreshCw, MapPin, Eye } from 'lucide-react';

const AdminShipping: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 15;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await ShippingAddressService.getAll();
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setAddresses(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = addresses.filter(a =>
    !search ||
    (a.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.state || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.pincode || '').includes(search) ||
    (a.contactNumber || '').includes(search)
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Shipping Addresses</h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} addresses on file</p>
        </div>
        <button onClick={fetchData} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by city, state, pincode, or phone…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading addresses…
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No addresses found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Address</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">City / State</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Pincode</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((a: any) => (
                  <tr key={a._id || a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
                        <span className="text-gray-700">{a.houseNo || ''} {a.street || ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.city || '—'}, {a.state || '—'}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{a.pincode || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{a.contactNumber || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(a)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">←</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">→</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Full Address</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                { label: 'House / Flat', value: selected.houseNo },
                { label: 'Building', value: selected.buildingName },
                { label: 'Street', value: selected.street },
                { label: 'Landmark', value: selected.landmark },
                { label: 'City', value: selected.city },
                { label: 'State', value: selected.state },
                { label: 'Country', value: selected.country },
                { label: 'Pincode', value: selected.pincode },
                { label: 'Contact', value: selected.contactNumber },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;
