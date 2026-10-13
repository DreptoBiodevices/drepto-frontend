import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import OrderTracking from '../components/OrderTracking';
import { Order } from '../types';
import { Package, Calendar, MapPin, ChevronDown, ChevronUp, Stethoscope, Activity, FileText, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { LabTestBookingService, DoctorAppointmentService, NurseAppointmentService, OrderService } from '../lib/api_controller';
import { useAuth } from '../hooks/useAuth';
import { ORDER_CANCELLATION_WINDOW_DAYS, REFUND_PROCESSING_TIME, CANCELLATION_POLICY_TEXT } from '../constants';

type TabType = 'products' | 'doctor' | 'nurse';

const OrderHistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [orders, setOrders] = useState<Order[]>([]);
    
    // New states for appointments and bookings
    const [labBookings, setLabBookings] = useState<any[]>([]);
    const [doctorAppts, setDoctorAppts] = useState<any[]>([]);
    const [nurseAppts, setNurseAppts] = useState<any[]>([]);
    
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Orders from API and merge with localStorage
                try {
                    let localOrders: Order[] = [];
                    const storedOrders = localStorage.getItem('orders');
                    if (storedOrders) {
                        localOrders = JSON.parse(storedOrders);
                    }

                    if (user?.email) {
                        const orderRes = await OrderService.getAll(user.email);
                        const apiOrders = orderRes.data || [];
                        
                        const merged = [...apiOrders];
                        localOrders.forEach(lo => {
                            if (!merged.find(ao => ao.id === lo.id)) {
                                merged.push(lo);
                            }
                        });
                        merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        setOrders(merged);
                    } else {
                        setOrders(localOrders);
                    }
                } catch (e) {
                    console.error("Failed to load orders", e);
                }

                // 2. Fetch Lab Bookings
                try {
                    const labRes = await LabTestBookingService.getAll();
                    setLabBookings(labRes.data || []);
                } catch (e) {
                    console.error("Failed to load lab bookings", e);
                }

                // 3. Fetch Doctor Appointments
                try {
                    const docRes = await DoctorAppointmentService.getAll();
                    setDoctorAppts(docRes.data || []);
                } catch (e) {
                    console.error("Failed to load doctor appointments", e);
                }

                // 4. Fetch Nurse Appointments
                try {
                    const nurseRes = await NurseAppointmentService.getAll();
                    setNurseAppts(nurseRes.data || []);
                } catch (e) {
                    console.error("Failed to load nurse appointments", e);
                }

            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    };

    // Check if order is within the shared cancellation window
    const isWithinCancellationWindow = (order: Order): boolean => {
        const placed = new Date(order.createdAt ?? order.date).getTime();
        if (isNaN(placed)) return false;
        const windowMs = ORDER_CANCELLATION_WINDOW_DAYS * 24 * 60 * 60 * 1000;
        return (Date.now() - placed) <= windowMs;
    };

    const handleCancelOrder = async (orderId: string) => {
        setCancellingOrderId(orderId);
        try {
            const res = await OrderService.cancel(orderId);
            const updated: Partial<Order> = res?.data ?? { status: 'Cancelled' };
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated, status: 'Cancelled' } : o));
            setShowCancelConfirm(null);
        } catch (e: any) {
            alert(e.response?.data?.message || 'Failed to cancel order. Please try again.');
        } finally {
            setCancellingOrderId(null);
        }
    };

    const renderTabs = () => (
        <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 mb-8 pb-2 scrollbar-hide">
            <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <Package className="w-4 h-4" /> Product Orders
            </button>
            <button
                onClick={() => setActiveTab('doctor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'doctor' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <Stethoscope className="w-4 h-4" /> Doctor Appointments
            </button>
            <button
                onClick={() => setActiveTab('nurse')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === 'nurse' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                <FileText className="w-4 h-4" /> Nurse Appointments
            </button>
        </div>
    );

    const renderEmptyState = (type: string, icon: React.ReactNode) => (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <p className="text-gray-500 font-medium text-lg">No {type} found.</p>
        </div>
    );

    const renderProductOrders = () => {
        if (orders.length === 0) return renderEmptyState('orders', <Package className="w-8 h-8" />);
        return (
            <div className="space-y-6">
                {/* Cancellation Policy Banner */}
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-800">Order Cancellation Policy</p>
                        <p className="text-sm text-blue-700 mt-0.5">{CANCELLATION_POLICY_TEXT} <a href="/refund-policy" className="underline font-medium">View full policy</a></p>
                    </div>
                </div>

                {orders.map((order) => {
                    const canCancel = isWithinCancellationWindow(order) && !['Delivered', 'Dispatched', 'Cancelled'].includes(order.status);
                    return (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
                        <div
                            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            onClick={() => toggleExpand(order.id)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="font-bold text-gray-900 text-lg">Order #{order.id}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${
                                            (order.status as string) === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                            order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                            'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                            {order.status}
                                        </span>
                                        {canCancel && (
                                            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center gap-1">
                                                <RefreshCw className="w-3 h-3" /> Cancellable
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            ₹{order.total.toFixed(2)}
                                        </span>
                                        <span className="text-gray-400">
                                            ({order.items.length} items)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {canCancel && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCancelConfirm(order.id);
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                                    >
                                        <XCircle className="w-3.5 h-3.5" /> Cancel Order
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/invoice/${order.id}`);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    View Invoice
                                </button>
                                <div className="text-gray-400">
                                    {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </div>
                        </div>

                        {/* Refund notice for cancelled orders */}
                        {order.status === 'Cancelled' && (
                            <div className="border-t border-amber-100 bg-amber-50 px-6 py-3 text-xs text-amber-800 flex items-start gap-2">
                                <RefreshCw className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                <span>
                                    {order.refundStatus === 'Processed'
                                        ? <>Refund of <strong>₹{order.total.toFixed(2)}</strong> has been processed to your original payment method.</>
                                        : order.refundStatus === 'Not Applicable'
                                            ? <>This order was cancelled. No payment was captured, so no refund is required.</>
                                            : <>This order was cancelled{order.cancelledAt ? ` on ${new Date(order.cancelledAt).toLocaleDateString('en-IN')}` : ''}. If paid, your refund of <strong>₹{order.total.toFixed(2)}</strong> will be credited within <strong>{REFUND_PROCESSING_TIME}</strong>.</>}
                                </span>
                            </div>
                        )}

                        {/* Cancel Confirmation Inline Panel */}
                        {showCancelConfirm === order.id && (
                            <div className="border-t border-red-100 bg-red-50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                                <div>
                                    <p className="font-semibold text-red-800 text-sm">Cancel this order?</p>
                                    <p className="text-red-700 text-xs mt-1">If already paid, your refund of <strong>₹{order.total.toFixed(2)}</strong> will be credited within <strong>{REFUND_PROCESSING_TIME}</strong> to your original payment method.</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setShowCancelConfirm(null)}
                                        className="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        Keep Order
                                    </button>
                                    <button
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={cancellingOrderId === order.id}
                                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                        {cancellingOrderId === order.id ? (
                                            <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Cancelling...</>
                                        ) : (
                                            <><XCircle className="w-3.5 h-3.5" /> Yes, Cancel</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {expandedOrderId === order.id && (
                            <div className="border-t border-gray-100 bg-gray-50/50 p-6 animate-fade-in">
                                <div className="mb-8">
                                    <h4 className="font-bold text-gray-900 mb-4">Order Tracking</h4>
                                    <OrderTracking status={order.status} estimatedDelivery={order.estimatedDelivery} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3">Items</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.image && (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                                                        <div className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</div>
                                                        {item.shippingSource && (
                                                            <div className="text-[10px] font-bold text-blue-600 mt-0.5">
                                                                Source: {item.shippingSource}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3">Shipping Address</h4>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-600 space-y-1">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p>{order.shippingAddress.houseNo}, {order.shippingAddress.buildingName && `${order.shippingAddress.buildingName}, `}{order.shippingAddress.street}</p>
                                                    <p>{order.shippingAddress.landmark && `Near ${order.shippingAddress.landmark}, `}{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                                    <p>{order.shippingAddress.country}</p>
                                                    <p className="mt-2 font-medium text-gray-900">Contact: {order.shippingAddress.contactNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    );
                })}
            </div>
        );
    };

    const renderLabBookings = () => {
        if (labBookings.length === 0) return renderEmptyState('lab bookings', <Activity className="w-8 h-8" />);
        return (
            <div className="space-y-6">
                {labBookings.map((booking, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row justify-between gap-4 animate-fade-in-up">
                        <div>
                            <h3 className="font-bold text-gray-900">{booking.testName} at {booking.labName}</h3>
                            <div className="text-sm text-gray-500 mt-2 space-y-1">
                                <p><Calendar className="w-4 h-4 inline mr-2" /> {booking.date} | {booking.time}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                                {booking.statusLabel || booking.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDoctorAppts = () => {
        if (doctorAppts.length === 0) return renderEmptyState('doctor appointments', <Stethoscope className="w-8 h-8" />);
        return (
            <div className="space-y-6">
                {doctorAppts.map((appt, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row justify-between gap-4 animate-fade-in-up">
                        <div>
                            <h3 className="font-bold text-gray-900">Dr. {appt.doctorName}</h3>
                            <p className="text-sm text-gray-500 mb-2">{appt.specialization}</p>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p><Calendar className="w-4 h-4 inline mr-2" /> {appt.date} | {appt.time}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                {appt.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderNurseAppts = () => {
        if (nurseAppts.length === 0) return renderEmptyState('nurse appointments', <FileText className="w-8 h-8" />);
        return (
            <div className="space-y-6">
                {nurseAppts.map((appt, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row justify-between gap-4 animate-fade-in-up">
                        <div>
                            <h3 className="font-bold text-gray-900">Nurse: {appt.nurseName}</h3>
                            <p className="text-sm text-gray-500 mb-2">{appt.serviceType}</p>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p><Calendar className="w-4 h-4 inline mr-2" /> {appt.date} | {appt.time}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                                {appt.statusLabel || appt.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings & Orders</h1>
                
                {renderTabs()}

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading data...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'products' && renderProductOrders()}
                        {activeTab === 'doctor' && renderDoctorAppts()}
                        {activeTab === 'nurse' && renderNurseAppts()}
                    </>
                )}
            </main>
        </div>
    );
};

export default OrderHistoryPage;
