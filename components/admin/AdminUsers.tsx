// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  UserService, OrderService, PaymentService, ShippingAddressService, FeedbackService, ReviewService
} from '../../lib/api_controller';
import {
  Search, RefreshCw, User, Mail, Phone, Eye, X, ShoppingBag, MapPin,
  CreditCard, Star, Calendar, Shield, Package, CheckCircle2, Clock, Truck,
  XCircle, Copy, Check, ChevronRight, ExternalLink, AlertCircle
} from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  placed:     { label: 'Placed',     color: 'bg-teal-50 text-teal-700 border-teal-200',       icon: <Package className="w-3 h-3" /> },
  pending:    { label: 'Pending',    color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: <Clock className="w-3 h-3" /> },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: <Package className="w-3 h-3" /> },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Truck className="w-3 h-3" /> },
  delivered:  { label: 'Delivered',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled:  { label: 'Cancelled',  color: 'bg-rose-50 text-rose-700 border-rose-200',       icon: <XCircle className="w-3 h-3" /> },
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'shipping' | 'payments' | 'reviews'>('details');
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Detailed data for selected user
  const [userLoading, setUserLoading] = useState(false);
  const [detailData, setDetailData] = useState<{
    orders: any[];
    addresses: any[];
    payments: any[];
    reviews: any[];
  }>({
    orders: [],
    addresses: [],
    payments: [],
    reviews: [],
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const ensureValidToken = async () => {
    let token = localStorage.getItem('token');
    if (!token || token === 'admin_session_token') {
      try {
        const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'Dreptoadmin@gmail.com').trim().toLowerCase();
        const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'Drepto2025').trim();
        const loginRes = await UserService.login({ email: adminEmail, password: adminPassword });
        if (loginRes?.data?.token) {
          token = loginRes.data.token;
          localStorage.setItem('token', token);
        }
      } catch (err) {
        console.warn('Could not auto-login admin token', err);
      }
    }
    return token;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      await ensureValidToken();

      const [usersRes, ordersRes] = await Promise.allSettled([
        UserService.getAllUsers(),
        OrderService.getAll(),
      ]);

      let loadedUsers: any[] = [];
      if (usersRes.status === 'fulfilled' && usersRes.value?.data) {
        const data = Array.isArray(usersRes.value.data)
          ? usersRes.value.data
          : (usersRes.value.data?.users || usersRes.value.data?.data || []);
        // Exclude internal admin account from customer registry
        loadedUsers = data.filter((u: any) => (u.email || '').toLowerCase() !== 'dreptoadmin@gmail.com');
      }

      // Also merge any users found in orders
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        const ordersData = Array.isArray(ordersRes.value.data)
          ? ordersRes.value.data
          : (ordersRes.value.data?.orders || ordersRes.value.data?.data || []);

        ordersData.forEach((o: any) => {
          if (o.userEmail && o.userEmail.toLowerCase() !== 'dreptoadmin@gmail.com') {
            const alreadyExists = loadedUsers.some(u => (u.email || '').toLowerCase() === o.userEmail.toLowerCase());
            if (!alreadyExists) {
              const addr = o.shippingAddress;
              loadedUsers.push({
                _id: o.userId || o._id,
                id: o.userId || o._id,
                firstName: o.userEmail.split('@')[0],
                lastName: '',
                email: o.userEmail,
                mobileNumber: addr?.contactNumber || '—',
                role: 'Patient',
                createdAt: o.createdAt || o.created_at,
              });
            }
          }
        });
      }

      setUsers(loadedUsers);
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openUserProfile = async (user: any) => {
    setSelectedUser(user);
    setActiveTab('details');
    setUserLoading(true);

    try {
      await ensureValidToken();

      const userId = user._id || user.id;
      const userEmail = (user.email || '').toLowerCase().trim();
      const userPhone = String(user.mobileNumber || '').replace(/\D/g, '');

      const [ordersRes, paymentsRes, shippingRes, reviewsRes, feedbackRes] = await Promise.allSettled([
        OrderService.getAll(userEmail),
        PaymentService.getAllTransactions(),
        ShippingAddressService.getAll(),
        userId ? ReviewService.getByUser(userId) : Promise.reject('No userId'),
        FeedbackService.getAllApproved(),
      ]);

      // 1. Orders
      let userOrders: any[] = [];
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        const raw = Array.isArray(ordersRes.value.data)
          ? ordersRes.value.data
          : (ordersRes.value.data.orders || ordersRes.value.data.data || []);
        userOrders = raw.filter((o: any) => {
          const oEmail = (o.userEmail || o.email || '').toLowerCase().trim();
          const oUserId = o.userId || o.user;
          return (userEmail && oEmail === userEmail) || (userId && oUserId === userId);
        });
      }

      userOrders.sort((a, b) => new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime());

      // 2. Shipping Addresses
      let addresses: any[] = [];
      if (shippingRes.status === 'fulfilled' && shippingRes.value?.data) {
        const raw = Array.isArray(shippingRes.value.data) ? shippingRes.value.data : (shippingRes.value.data.data || []);
        addresses = raw.filter((a: any) => {
          const aUserId = a.userId || a.user;
          const aPhone = String(a.contactNumber || a.phone || '').replace(/\D/g, '');
          const aEmail = (a.email || '').toLowerCase().trim();
          return (userId && aUserId === userId) || (userEmail && aEmail === userEmail) || (userPhone && aPhone && aPhone === userPhone);
        });
      }

      // Extract distinct checkout shipping addresses from orders
      userOrders.forEach(o => {
        if (o.shippingAddress && (o.shippingAddress.city || o.shippingAddress.street || o.shippingAddress.houseNo)) {
          const addr = o.shippingAddress;
          const key = `${addr.houseNo || ''}-${addr.street || ''}-${addr.pincode || ''}`;
          const exists = addresses.some(a => `${a.houseNo || ''}-${a.street || ''}-${a.pincode || ''}` === key);
          if (!exists) {
            addresses.push({
              ...addr,
              _source: `Order #${(o._id || o.id || '').slice(-6)}`,
            });
          }
        }
      });

      // 3. Payments
      let userPayments: any[] = [];
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value?.data) {
        const allTx = Array.isArray(paymentsRes.value.data) ? paymentsRes.value.data : [];
        const orderIds = new Set(userOrders.map(o => String(o._id || o.id || o.orderId)));
        userPayments = allTx.filter((p: any) => {
          const pOrderId = String(p.orderId || p._id || '');
          const pEmail = (p.userEmail || p.email || '').toLowerCase().trim();
          return orderIds.has(pOrderId) || (userEmail && pEmail === userEmail);
        });
      }

      // Fallback from orders with paymentId
      userOrders.forEach(o => {
        const pid = o.paymentId || o.transactionId;
        if (pid) {
          const exists = userPayments.some(p => p.transactionId === pid || p.paymentId === pid);
          if (!exists) {
            userPayments.push({
              transactionId: pid,
              orderId: o._id || o.id,
              amount: o.totalAmount || o.total,
              status: o.status === 'cancelled' ? 'Refunded/Cancelled' : 'Captured/Success',
              created_at: o.createdAt || o.created_at,
              method: 'Razorpay / Online',
            });
          }
        }
      });

      userPayments.sort((a, b) => new Date(b.created_at || b.createdAt || 0).getTime() - new Date(a.created_at || a.createdAt || 0).getTime());

      // 4. Reviews & Feedback
      let userReviews: any[] = [];
      if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.data) {
        const raw = Array.isArray(reviewsRes.value.data) ? reviewsRes.value.data : (reviewsRes.value.data.reviews || reviewsRes.value.data.data || []);
        userReviews = raw;
      }
      if (feedbackRes.status === 'fulfilled' && feedbackRes.value?.data) {
        const raw = Array.isArray(feedbackRes.value.data) ? feedbackRes.value.data : (feedbackRes.value.data.data || []);
        const matched = raw.filter((f: any) => {
          const fEmail = (f.email || '').toLowerCase().trim();
          const fName = (f.name || f.userName || '').toLowerCase().trim();
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().trim();
          return (userEmail && fEmail === userEmail) || (fullName && fName === fullName);
        });
        userReviews = [
          ...userReviews,
          ...matched.map(f => ({
            ...f,
            title: f.title || 'Platform Feedback',
            rating: f.rating || 5,
            comment: f.message || f.feedback || f.comment,
            createdAt: f.createdAt || f.created_at,
            type: 'Feedback',
          }))
        ];
      }

      setDetailData({
        orders: userOrders,
        addresses,
        payments: userPayments,
        reviews: userReviews,
      });
    } catch (err) {
      console.error("Error gathering user data", err);
    } finally {
      setUserLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredUsers = users.filter(u =>
    !search ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.lastName || '').toLowerCase().includes(search.toLowerCase()) ||
    String(u.mobileNumber || '').includes(search) ||
    String(u._id || u.id || '').toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const totalSpent = detailData.orders.reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Registry & Profiles</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Click any customer account to inspect their full profile, orders, addresses, payments, and reviews
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by customer name, email, phone number, or MongoDB User ID…"
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all shadow-xs"
        />
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" /> Loading customer records from MongoDB…
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            No registered users match your query
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Customer Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Account Role</th>
                  <th className="px-6 py-3.5">Registered</th>
                  <th className="px-6 py-3.5 text-right">360° Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((u: any) => {
                  const initial = (u.firstName || u.name || u.email || '?')[0].toUpperCase();
                  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Drepto User';
                  const roleName = u.role || 'Patient';

                  return (
                    <tr
                      key={u._id || u.id}
                      onClick={() => openUserProfile(u)}
                      className="hover:bg-teal-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                              {fullName}
                            </p>
                            <p className="font-mono text-[10px] text-gray-400">
                              {(u._id || u.id || '').slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {u.email || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono">
                        {u.mobileNumber || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          {roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(u.createdAt || u.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openUserProfile(u);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-teal-600 hover:text-white text-gray-700 font-semibold rounded-lg text-xs transition-all shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Showing page {page} of {totalPages} ({filteredUsers.length} total users)</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* USER 360° COMPREHENSIVE DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close user profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg">
                  {(selectedUser.firstName || selectedUser.name || selectedUser.email || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold tracking-tight">
                      {selectedUser.firstName || ''} {selectedUser.lastName || ''}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 border border-teal-400/40 text-teal-100">
                      {selectedUser.role || 'Patient'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-teal-100/80">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {selectedUser.email || 'No email provided'}
                    </span>
                    {selectedUser.mobileNumber && (
                      <span className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5" /> {selectedUser.mobileNumber}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Joined {formatDate(selectedUser.createdAt || selectedUser.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick KPI Strip inside modal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
                <div className="bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] uppercase font-semibold text-teal-200">Total Spend</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {userLoading ? '…' : `₹${totalSpent.toLocaleString('en-IN')}`}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] uppercase font-semibold text-teal-200">Orders</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {userLoading ? '…' : detailData.orders.length}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] uppercase font-semibold text-teal-200">Addresses</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {userLoading ? '…' : detailData.addresses.length}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] uppercase font-semibold text-teal-200">Reviews & Feedback</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {userLoading ? '…' : detailData.reviews.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/70 px-6 overflow-x-auto shrink-0">
              {[
                { id: 'details',  label: 'Personal Details', icon: User, count: null },
                { id: 'orders',   label: 'Orders', icon: ShoppingBag, count: detailData.orders.length },
                { id: 'shipping', label: 'Shipping Address', icon: MapPin, count: detailData.addresses.length },
                { id: 'payments', label: 'Payments', icon: CreditCard, count: detailData.payments.length },
                { id: 'reviews',  label: 'Reviews', icon: Star, count: detailData.reviews.length },
              ].map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-teal-600 text-teal-700 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                    {t.count !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive ? 'bg-teal-100 text-teal-800' : 'bg-gray-200/80 text-gray-600'
                      }`}>
                        {userLoading ? '…' : t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {userLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
                  <p className="text-xs">Aggregating user details, orders, payments, shipping, and reviews…</p>
                </div>
              ) : (
                <>
                  {/* TAB 1: PERSONAL DETAILS */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Biographical & Account Telemetry
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { label: 'First Name', value: selectedUser.firstName || '—' },
                            { label: 'Last Name', value: selectedUser.lastName || '—' },
                            { label: 'Account Email', value: selectedUser.email || '—', copyable: true },
                            { label: 'Mobile Phone', value: selectedUser.mobileNumber || '—', copyable: true },
                            { label: 'Gender', value: selectedUser.gender || 'Not specified' },
                            { label: 'Age', value: selectedUser.age ? `${selectedUser.age} yrs` : 'Not specified' },
                            { label: 'Blood Group', value: selectedUser.bloodGroup || '—' },
                            { label: 'Weight', value: selectedUser.weight ? `${selectedUser.weight} kg` : '—' },
                            { label: 'Role Designation', value: selectedUser.role || 'Patient' },
                            { label: 'First Login Completed', value: selectedUser.isFirstLogin === false ? 'Yes' : 'Pending / First Session' },
                            { label: 'Registered Date', value: formatDate(selectedUser.createdAt || selectedUser.created_at) },
                            { label: 'MongoDB User ID', value: selectedUser._id || selectedUser.id || '—', mono: true, copyable: true },
                          ].map(({ label, value, mono, copyable }) => (
                            <div key={label} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className={`text-sm font-semibold text-gray-800 ${mono ? 'font-mono text-xs truncate max-w-[200px]' : ''}`}>
                                  {value}
                                </p>
                                {copyable && value !== '—' && (
                                  <button
                                    onClick={() => copyToClipboard(value, label)}
                                    className="text-gray-400 hover:text-teal-700 transition-colors p-1"
                                    title="Copy"
                                  >
                                    {copiedKey === label ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clinical / Extra metadata */}
                      {selectedUser.serviceTypes && selectedUser.serviceTypes.length > 0 && (
                        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                          <p className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">Service Specializations</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedUser.serviceTypes.map((st: string, idx: number) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-medium">
                                {st}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: USER ORDERS */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      {detailData.orders.length === 0 ? (
                        <div className="py-14 text-center text-gray-400 text-xs">
                          <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No purchase orders recorded for this customer in MongoDB
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {detailData.orders.map((o: any, idx: number) => {
                            const statusKey = (o.status || 'pending').toLowerCase();
                            const cfg = statusConfig[statusKey] || statusConfig.pending;
                            const items = Array.isArray(o.items) ? o.items : [];

                            return (
                              <div key={o._id || o.id || idx} className="rounded-2xl border border-gray-100 p-5 bg-white shadow-xs hover:border-gray-200 transition-colors">
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-gray-900 text-sm">
                                        Order #{o._id || o.id}
                                      </p>
                                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                                        {cfg.icon} {cfg.label}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      Placed on {formatDate(o.createdAt || o.created_at)} · Payment: <span className="font-mono text-gray-600">{o.paymentId || o.transactionId || 'Online'}</span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-base font-extrabold text-gray-900">
                                      ₹{Number(o.totalAmount || o.total || 0).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-[11px] text-gray-400">{items.length} item(s)</p>
                                  </div>
                                </div>

                                {/* Order Items List */}
                                <div className="mt-3 divide-y divide-gray-50">
                                  {items.map((it: any, i: number) => (
                                    <div key={i} className="py-2 flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                                          {i + 1}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-800">{it.name || it.title || 'Product'}</p>
                                          <p className="text-gray-400">Qty: {it.quantity || 1}</p>
                                        </div>
                                      </div>
                                      <p className="font-bold text-gray-800">
                                        ₹{Number(it.price || 0).toLocaleString('en-IN')}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SHIPPING ADDRESSES */}
                  {activeTab === 'shipping' && (
                    <div className="space-y-4">
                      {detailData.addresses.length === 0 ? (
                        <div className="py-14 text-center text-gray-400 text-xs">
                          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No delivery addresses recorded for this user
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {detailData.addresses.map((a: any, idx: number) => (
                            <div key={a._id || a.id || idx} className="rounded-2xl border border-gray-100 p-5 bg-gray-50/60 relative">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-900">
                                      {a.addressType || 'Shipping Address'}
                                    </p>
                                    {a._source && (
                                      <p className="text-[10px] text-teal-600 font-semibold">{a._source}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1 text-xs text-gray-700">
                                <p className="font-semibold text-gray-900">
                                  {[a.houseNo, a.buildingName, a.street].filter(Boolean).join(', ') || 'Address line'}
                                </p>
                                {a.landmark && (
                                  <p className="text-gray-500">Landmark: {a.landmark}</p>
                                )}
                                <p>
                                  {[a.city, a.state].filter(Boolean).join(', ')} — <span className="font-mono font-semibold">{a.pincode || 'Pincode'}</span>
                                </p>
                                {a.country && <p className="text-gray-400">{a.country}</p>}
                                {a.contactNumber && (
                                  <p className="text-teal-700 font-mono font-medium pt-1 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {a.contactNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: PAYMENTS & TRANSACTIONS */}
                  {activeTab === 'payments' && (
                    <div className="space-y-4">
                      {detailData.payments.length === 0 ? (
                        <div className="py-14 text-center text-gray-400 text-xs">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No payment transactions recorded for this user
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                              <tr>
                                <th className="px-5 py-3">Transaction ID</th>
                                <th className="px-5 py-3">Order Ref</th>
                                <th className="px-5 py-3">Amount</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {detailData.payments.map((p: any, idx: number) => {
                                const isSuccess = (p.status || '').toLowerCase().includes('success') || (p.status || '').toLowerCase().includes('captured') || (p.status || '').toLowerCase().includes('paid');
                                return (
                                  <tr key={p._id || p.transactionId || idx} className="hover:bg-gray-50/50">
                                    <td className="px-5 py-3.5 font-mono font-bold text-gray-900">
                                      {p.transactionId || p.paymentId || p._id || '—'}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-gray-600">
                                      {p.orderId ? (p.orderId.length > 10 ? `…${p.orderId.slice(-8)}` : p.orderId) : '—'}
                                    </td>
                                    <td className="px-5 py-3.5 font-bold text-gray-900">
                                      ₹{Number(p.amount || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-5 py-3.5">
                                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                        isSuccess
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                          : 'bg-amber-50 text-amber-700 border-amber-200'
                                      }`}>
                                        <CheckCircle2 className="w-3 h-3" />
                                        {p.status || 'Success'}
                                      </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500">
                                      {formatDate(p.created_at || p.createdAt)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: REVIEWS & FEEDBACK */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {detailData.reviews.length === 0 ? (
                        <div className="py-14 text-center text-gray-400 text-xs">
                          <Star className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No product reviews or customer feedback submitted by this user
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {detailData.reviews.map((r: any, idx: number) => {
                            const rating = Number(r.rating || 5);
                            return (
                              <div key={r._id || idx} className="rounded-2xl border border-gray-100 p-5 bg-white shadow-xs">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${
                                          star <= rating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-gray-200'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-xs font-bold text-gray-700 ml-1.5">{rating}.0</span>
                                  </div>
                                  <span className="text-[10px] text-gray-400">
                                    {formatDate(r.createdAt || r.created_at)}
                                  </span>
                                </div>

                                {r.title && (
                                  <p className="text-xs font-bold text-gray-900 mb-1">{r.title}</p>
                                )}

                                <p className="text-xs text-gray-600 leading-relaxed italic bg-gray-50 rounded-xl p-3 border border-gray-100">
                                  "{r.comment || r.message || r.feedback || 'Great experience.'}"
                                </p>

                                {r.productName && (
                                  <p className="text-[11px] text-teal-700 font-semibold mt-2">
                                    Product: {r.productName}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">
                MongoDB Record: {selectedUser._id || selectedUser.id}
              </span>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
