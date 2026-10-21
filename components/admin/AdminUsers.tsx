// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { UserService } from '../../lib/api_controller';
import { Search, RefreshCw, User, Mail, Phone, Eye } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 15;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await UserService.getAllUsers();
      const data = Array.isArray(res.data) ? res.data : (res.data?.users || res.data?.data || []);
      setUsers(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    !search ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.lastName || '').toLowerCase().includes(search.toLowerCase()) ||
    String(u.mobileNumber || '').includes(search)
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, or phone…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading users…
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((u: any) => (
                  <tr key={u._id || u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs shrink-0">
                          {(u.firstName || u.name || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.firstName || ''} {u.lastName || ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{u.mobileNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{fmt(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(u)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
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

      {/* User Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-brand-50 to-teal-50 p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl">
                {(selected.firstName || selected.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selected.firstName || ''} {selected.lastName || ''}</h3>
                <p className="text-sm text-gray-500">{selected.email || '—'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="ml-auto text-gray-400 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'User ID', value: (selected._id || selected.id || '').slice(-10), mono: true },
                { label: 'Phone', value: selected.mobileNumber || '—' },
                { label: 'Gender', value: selected.gender || '—' },
                { label: 'Age', value: selected.age || '—' },
                { label: 'Role', value: selected.role || 'Patient' },
                { label: 'Joined', value: fmt(selected.createdAt) },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className={`mt-0.5 font-medium text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
