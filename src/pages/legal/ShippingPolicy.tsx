import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const ShippingPolicy: React.FC = () => {
    return (
        <LegalPageLayout title="Shipping Policy" breadcrumbLabel="Shipping Policy">
            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Destinations</h3>
                <p>
                    We currently ship to all major cities and pin codes across India. Orders are dispatched from our fulfillment centers or our headquarters in Mumbai.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Processing Time</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Orders are typically processed within 24-48 hours of payment confirmation.</li>
                    <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Timelines</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Delivery</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Mumbai / Maharashtra</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2-3 Business Days</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Metro Cities</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3-5 Business Days</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Rest of India</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5-7 Business Days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">Note: Delivery times are estimates and may vary due to external factors.</p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Charges</h3>
                <p className="mb-2">Standard shipping charges apply based on the weight of the consignment and delivery location.</p>
                <p><strong>Free Shipping:</strong> We offer free shipping on orders above ₹499 (including bulk orders of our 2-patch packs).</p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking Your Order</h3>
                <p>
                    Once your order is dispatched, you will receive a tracking link via email/SMS. You can use this link to track the status of your Drepto pain relief patches until they arrive.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Damaged Packages</h3>
                <p>
                    If the outer packaging appears tampered with or heavily damaged at the time of delivery, please do not accept the package. Refuse delivery and contact our support team immediately.
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default ShippingPolicy;
