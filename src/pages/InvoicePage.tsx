
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { OrderService } from '../lib/api_controller';

const InvoicePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            
            // 1. Try localStorage first
            let foundOrder: Order | null = null;
            try {
                const storedOrders = localStorage.getItem('orders');
                if (storedOrders) {
                    const orders: Order[] = JSON.parse(storedOrders);
                    foundOrder = orders.find(o => String(o.id) === String(orderId) || String((o as any)._id) === String(orderId)) || null;
                }
            } catch (err) {
                console.error("Failed to parse localStorage orders", err);
            }
            
            if (foundOrder) {
                setOrder({
                    ...foundOrder,
                    id: foundOrder.id || (foundOrder as any).orderId || String((foundOrder as any)._id)
                });
                setLoading(false);
            } else {
                // 2. Try API
                try {
                    const response = await OrderService.getById(orderId);
                    if (response.data) {
                        const ord = response.data;
                        setOrder({
                            ...ord,
                            id: ord.id || ord.orderId || String(ord._id)
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch order from API", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        if (localStorage.getItem('adminAuth') === 'true') {
            navigate('/admin/dashboard');
        } else {
            navigate('/orders');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
                    <p className="text-gray-500 mt-2">The requested invoice could not be retrieved.</p>
                    <button onClick={handleBack} className="mt-4 text-primary hover:underline font-medium">
                        Return {localStorage.getItem('adminAuth') === 'true' ? 'to Admin Portal' : 'to Orders'}
                    </button>
                </div>
            </div>
        );
    }

    // Consume server-calculated figures directly, avoiding client-side array reduction
    const deliveryCharge = typeof (order as any).deliveryCharge === 'number'
        ? (order as any).deliveryCharge
        : (typeof order.shippingCost === 'number' ? order.shippingCost : (order.total > 50 ? 50 : 0));

    const subtotal = typeof (order as any).subtotal === 'number'
        ? (order as any).subtotal
        : ((order.items || []).reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0) || Math.max(0, order.total - deliveryCharge));

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden print:shadow-none">
                {/* Toolbar */}
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center print:hidden">
                    <button onClick={handleBack} className="flex items-center gap-2 text-sm hover:text-gray-300">
                        <ArrowLeft className="w-4 h-4" /> Back {localStorage.getItem('adminAuth') === 'true' ? 'to Admin Portal' : 'to Orders'}
                    </button>
                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                            <Printer className="w-4 h-4" /> Print Invoice
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="p-8 md:p-12" id="invoice-content">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                        <div>
                            <img src="/images/logo.png" alt="Drepto" className="h-10 mb-4" />
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                            <p className="text-gray-500">#{order.id}</p>
                        </div>
                        <div className="text-right mt-6 md:mt-0">
                            <h3 className="font-bold text-gray-900">Drepto Biodevices</h3>
                            <p className="text-gray-600 text-sm">SINE IIT Bombay</p>
                            <p className="text-gray-600 text-sm">Mumbai 400076, India</p>
                            <p className="text-gray-600 text-sm">office@dreptobiodevices.com</p>
                        </div>
                    </div>

                    {/* Bill To / Ship To */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-gray-100">
                        <div>
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Billed To</h3>
                            <div className="text-gray-900 font-medium">{order.shippingAddress?.contactNumber || order.userEmail || 'Customer'}</div>
                            <div className="text-gray-600 text-sm mt-1">
                                {[order.shippingAddress?.houseNo, order.shippingAddress?.buildingName, order.shippingAddress?.street].filter(Boolean).join(', ') || 'N/A'}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(', ')}{order.shippingAddress?.pincode ? ` - ${order.shippingAddress.pincode}` : ''}
                            </div>
                            <div className="text-gray-600 text-sm">{order.shippingAddress?.country || 'India'}</div>
                        </div>
                        <div className="md:text-right">
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Details</h3>
                            <div className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-gray-900">Date:</span> {new Date(order.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-900">Status:</span>
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Paid</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-12">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-4 font-bold text-gray-900 w-1/2">Item Description</th>
                                    <th className="py-4 font-bold text-gray-900 text-center">Qty</th>
                                    <th className="py-4 font-bold text-gray-900 text-right">Price</th>
                                    <th className="py-4 font-bold text-gray-900 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(order.items || []).map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-4">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            {item.shippingSource && (
                                                <div className="text-xs text-gray-400 mt-0.5">Source: {item.shippingSource}</div>
                                            )}
                                        </td>
                                        <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                                        <td className="py-4 text-right text-gray-600">₹{(item.price || 0).toFixed(2)}</td>
                                        <td className="py-4 text-right font-medium text-gray-900">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/3 space-y-3">
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Delivery Charge</span>
                                <span>₹{deliveryCharge.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>₹{(order.total || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
                        <p>Thank you for your business!</p>
                        <p className="mt-1">For any queries, please contact office@dreptobiodevices.com or call +91 84518 22256</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
