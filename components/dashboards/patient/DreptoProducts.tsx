import React, { useState, useEffect } from 'react';
import { ProductService, PaymentService } from '../../../lib/api_controller';
import ProductDetailModal, { Product } from '../../ProductDetailModal';

interface ProductWithId extends Product {
    _id: string;
}

const DreptoProducts: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<ProductWithId | null>(null);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getAllProducts();
                // Ensure response data matches Product interface or map it
                const fetchedProducts = Array.isArray(response.data) ? response.data :
                    (response.data.products || response.data.data || []);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const displayedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="animate-fade-in-up pb-10">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">Drepto Store</h2>
                </div>
                <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-500 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </button>
            </div>

            <div className="bg-orange-50 rounded-2xl p-8 mb-10 text-center relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-200 rounded-full opacity-50"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-200 rounded-full opacity-50"></div>
                <h3 className="text-2xl md:text-3xl font-bold text-orange-900 mb-2 relative z-10">Wellness Essentials</h3>
                <p className="text-orange-800/70 relative z-10">Curated products for your healthy lifestyle.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProducts.length > 0 ? displayedProducts.map(product => (
                        <div key={product._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 flex flex-col">
                            <div className="relative h-60 overflow-hidden bg-gray-100">
                                <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                    {product.category}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                <div className="mt-auto pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        View Details
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-orange-50 text-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            </div>
                            <p className="text-gray-500 font-medium">No products available in store.</p>
                        </div>
                    )}
                </div>
            )}

            {products.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium disabled:opacity-50 hover:bg-gray-50">Previous</button>
                    <span className="text-gray-600 font-medium">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium disabled:opacity-50 hover:bg-gray-50">Next</button>
                </div>
            )}

            <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={async (product) => {
                    console.log("Get Samples for:", product.name);

                    const storedUser = localStorage.getItem('user');
                    let userDetails = {
                        name: "",
                        email: "",
                        contact: ""
                    };

                    if (storedUser) {
                        try {
                            const user = JSON.parse(storedUser);
                            userDetails = {
                                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                                email: user.email || "",
                                contact: user.mobileNumber ? String(user.mobileNumber) : ""
                            };
                        } catch (e) {
                            console.error("Error parsing user from local storage", e);
                        }
                    }

                    // Generate a temporary Order ID for tracking purposes since we lack a backend create-order endpoint
                    // valid Razorpay Order IDs start with "order_"
                    const mockOrderId = `order_${Date.now()}`;

                    try {
                        // 1. Record Transaction (before payment)
                        await PaymentService.recordTransaction({
                            razorpayOrderId: mockOrderId,
                            amount: 50 * 100,
                            currency: "INR",
                            notes: {
                                productName: product.name,
                                userEmail: userDetails.email
                            }
                        });
                    } catch (error) {
                        console.error("Failed to record transaction", error);
                        // Continue flow or block? Usually continue to let user pay, 
                        // but ideally we should block if tracking is critical.
                    }

                    const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                        amount: 50 * 100, // Amount in currency subunits. Default currency is INR.
                        currency: "INR",
                        name: "Drepto Biodevices Pvt. Ltd.",
                        description: `Sample for ${product.name}`,
                        image: "/favicon.svg", // You can use your logo here
                        // status update call
                        handler: async function (response: any) {
                            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

                            try {
                                // 2. Update Status (after payment)
                                await PaymentService.updateStatus({
                                    razorpayOrderId: mockOrderId, // Using the same ID we recorded
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature || "signature_unavailable_client_mode",
                                    status: "success"
                                });
                                console.log("Payment status updated in backend");
                            } catch (error) {
                                console.error("Failed to update payment status in backend", error);
                            }
                        },
                        prefill: {
                            name: userDetails.name,
                            email: userDetails.email,
                            contact: userDetails.contact
                        },
                        notes: {
                            payment: `Sample for ${product.name}`,
                            internal_order_id: mockOrderId
                        },
                        theme: {
                            color: "#208428ff" // Orange-500
                        }
                    };

                    const rzp1 = new (window as any).Razorpay(options);
                    rzp1.on('payment.failed', function (response: any) {
                        alert(response.error.code);
                        alert(response.error.description);
                        alert(response.error.source);
                        alert(response.error.step);
                        alert(response.error.reason);
                        alert(response.error.metadata.order_id);
                        alert(response.error.metadata.payment_id);
                    });
                    rzp1.open();
                }}
            />
        </div>
    );
};

export default DreptoProducts;
