
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import OrderTracking from '../components/OrderTracking';
import { Order } from '../types';
import { Package, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { OrderService } from '../lib/api_controller';
import { useAuth } from '../hooks/useAuth';

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            let localOrders: Order[] = [];
            try {
                const storedOrders = localStorage.getItem('orders');
                if (storedOrders) {
                    localOrders = JSON.parse(storedOrders);
                }
            } catch (error) {
                console.error("Failed to load orders from local storage", error);
            }
            
            if (user?.email) {
                try {
                    const response = await OrderService.getAll(user.email);
                    const apiOrders = response.data;
                    
                    // Merge based on ID
                    const merged = [...apiOrders];
                    localOrders.forEach(lo => {
                        if (!merged.find(ao => ao.id === lo.id)) {
                            merged.push(lo);
                        }
                    });
                    
                    // Sort descending by date
                    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setOrders(merged);
                } catch (error) {
                    console.error("Failed to fetch orders from API", error);
                    setOrders(localOrders);
                }
            } else {
                setOrders(localOrders);
            }
        };
        fetchOrders();
    }, [user]);

    const toggleExpand = (orderId: string) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">No orders found.</p>
                        <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
                                {/* Order Header - Summary */}
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    onClick={() => toggleExpand(order.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-gray-900 text-lg">Order #{order.id}</h3>
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                    }`}>
                                                    {order.status}
                                                </span>
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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/invoice/${order.id}`;
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

                                {/* Expanded Details */}
                                {expandedOrderId === order.id && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-6 animate-fade-in">
                                        {/* Tracking Component */}
                                        <div className="mb-8">
                                            <h4 className="font-bold text-gray-900 mb-4">Order Tracking</h4>
                                            <OrderTracking status={order.status} estimatedDelivery={order.estimatedDelivery} />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Items List */}
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

                                            {/* Shipping Info */}
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
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderHistoryPage;
