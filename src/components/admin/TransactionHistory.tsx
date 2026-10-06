
import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { PaymentService } from '../../lib/api_controller';
import { supabase } from '../../lib/supabase';
import { Search, ChevronDown, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';

const TransactionHistory: React.FC = () => {
    const [transactions, setTransactions] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch from Supabase directly as requested
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mappedOrders: Order[] = data.map((order: any) => ({
                        id: order.order_id || order.id, // Adjust based on Supabase column names
                        userEmail: order.user_email || '',
                        date: order.created_at,
                        items: order.items || [],
                        total: order.amount || order.total_amount,
                        status: order.status,
                        shippingAddress: order.shipping_address || {
                            houseNo: '', buildingName: '', street: '', landmark: '', city: '', state: '', country: '', pincode: '', contactNumber: 'N/A'
                        },
                        shippingMethod: order.shipping_method || 'Standard',
                        shippingCost: order.shipping_cost || 0,
                        paymentId: order.transaction_id || order.payment_id,
                    }));
                    setTransactions(mappedOrders);
                }
            } catch (error) {
                console.error("Failed to load transactions from Supabase", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter logic
    const filteredTransactions = transactions.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.shippingAddress.contactNumber.includes(searchTerm) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                    <p className="text-gray-500 text-sm">View and manage all customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-64"
                        />
                    </div>
                    {/* Placeholder for export functionality */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200 text-sm font-medium transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Order Info</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Customer Details</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Items & Payment</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-center text-xs uppercase tracking-wider">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                        {/* Order Info */}
                                        <td className="px-6 py-6 align-top">
                                            <div className="font-bold text-gray-900">{t.id}</div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                {new Date(t.date).toLocaleDateString()}
                                                <br />
                                                {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>

                                        {/* Customer Details */}
                                        <td className="px-6 py-6 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-medium text-gray-900">{t.shippingAddress.contactNumber}</div>
                                                {t.userEmail && (
                                                    <div className="text-sm text-blue-600 break-all">{t.userEmail}</div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Full Address */}
                                        <td className="px-6 py-6 align-top">
                                            <div className="text-sm text-gray-600 leading-relaxed min-w-[200px]">
                                                <span className="font-medium text-gray-900">{t.shippingAddress.houseNo}, {t.shippingAddress.buildingName}</span><br />
                                                {t.shippingAddress.street}<br />
                                                {t.shippingAddress.landmark && <span>Near {t.shippingAddress.landmark}<br /></span>}
                                                {t.shippingAddress.city}, {t.shippingAddress.state}<br />
                                                <span className="font-medium text-gray-900">Pin: {t.shippingAddress.pincode}</span>
                                            </div>
                                        </td>

                                        {/* Items & Payment */}
                                        <td className="px-6 py-6 align-top">
                                            <div className="space-y-3 min-w-[200px]">
                                                {/* Items List */}
                                                <div className="space-y-1">
                                                    {t.items.map((item, idx) => (
                                                        <div key={idx} className="text-sm text-gray-700 flex justify-between items-start gap-2 border-b border-gray-100 pb-1 last:border-0">
                                                            <span className="line-clamp-2">{item.name}</span>
                                                            <span className="text-gray-400 text-xs whitespace-nowrap">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Payment Details */}
                                                <div className="bg-gray-50 p-2 rounded-lg text-xs space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Total:</span>
                                                        <span className="font-bold text-gray-900">₹{t.total.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Method:</span>
                                                        <span className="text-gray-700">{t.shippingMethod || 'Standard'}</span>
                                                    </div>
                                                    {t.paymentId && t.paymentId !== 'COD' && (
                                                        <div className="flex justify-between gap-2">
                                                            <span className="text-gray-500">Pay ID:</span>
                                                            <span className="text-gray-500 font-mono break-all">{t.paymentId}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-6 align-top">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${t.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                t.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    t.status === 'Packaging' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                        'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}>
                                                {t.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-6 align-top text-center">
                                            <button
                                                onClick={() => window.open(`/invoice/${t.id}`, '_blank')}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                                                title="View Invoice"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination settings need no change if using same logic */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-medium">{filteredTransactions.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
