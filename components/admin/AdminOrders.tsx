// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { OrderService } from '../../lib/api_controller';
import { Search, RefreshCw, ChevronDown, Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const statusConfig = {
  pending:    { label: 'Pending',    color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: <Clock className="w-3 h-3" /> },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: <Package className="w-3 h-3" /> },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Truck className="w-3 h-3" /> },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-50 text-red-700 border-red-200',        icon: <XCircle className="w-3 h-3" /> },
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getAll();
      const data = Array.isArray(res.data) ? res.data : (res.data?.orders || res.data?.data || []);
      setOrders(data.sort((a: any, b: any) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime()));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      (o.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (o._id || o.id || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (o.status || '').toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await OrderService.update(id, { status });
      setOrders(prev => prev.map(o => (o._id === id || o.id === id) ? { ...o, status } : o));
      if (selected && (selected._id === id || selected.id === id)) setSelected({ ...selected, status });
    } catch (e) { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} total orders</p>
        </div>
        <button onClick={fetch} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email or order ID…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20">
          <option value="all">All Status</option>
          {Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading orders…
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((o: any) => (
                  <tr key={o._id || o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{(o._id || o.id || '').slice(-8)}</td>
                    <td className="px-4 py-3 text-gray-700">{o.userEmail || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{Array.isArray(o.items) ? o.items.length : '—'} item(s)</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{Number(o.totalAmount || o.total || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-500">{fmt(o.createdAt || o.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(o)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
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

      {/* Pagination */}
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

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-semibold text-gray-900">Order Detail</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{selected._id || selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status update */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Update Status</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.keys(statusConfig).map(s => (
                    <button key={s} disabled={updating === (selected._id || selected.id)}
                      onClick={() => updateStatus(selected._id || selected.id, s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                        (selected.status || '').toLowerCase() === s
                          ? statusConfig[s].color + ' ring-2 ring-offset-1 ring-gray-300'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}>
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-400 text-xs">Customer</p><p className="font-medium text-gray-800 mt-0.5">{selected.userEmail || '—'}</p></div>
                <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium text-gray-800 mt-0.5">{fmt(selected.createdAt || selected.created_at)}</p></div>
                <div><p className="text-gray-400 text-xs">Total</p><p className="font-semibold text-gray-900 mt-0.5">₹{Number(selected.totalAmount || selected.total || 0).toLocaleString('en-IN')}</p></div>
                <div><p className="text-gray-400 text-xs">Payment</p><p className="font-medium text-gray-800 mt-0.5">{selected.paymentId || selected.transactionId || '—'}</p></div>
              </div>

              {/* Shipping */}
              {selected.shippingAddress && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Shipping Address</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-0.5">
                    <p>{selected.shippingAddress.houseNo} {selected.shippingAddress.street}</p>
                    <p>{selected.shippingAddress.city}, {selected.shippingAddress.state} — {selected.shippingAddress.pincode}</p>
                    <p className="text-gray-500">{selected.shippingAddress.contactNumber}</p>
                  </div>
                </div>
              )}

              {/* Items */}
              {Array.isArray(selected.items) && selected.items.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Items</p>
                  <div className="space-y-2">
                    {selected.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.name || item.title || 'Product'}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">₹{Number(item.price || 0).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
