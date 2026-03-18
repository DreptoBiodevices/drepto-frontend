import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const RefundPolicy: React.FC = () => {
    return (
        <LegalPageLayout title="Refund and Return Policy" breadcrumbLabel="Refund Policy">
            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                <p>
                    At Drepto Biodevices, we take pride in our rigorous quality standards and research-backed formulations. Due to the nature of our products—hygienic, transdermal patches for external use—our return policy is structured to ensure the safety of all customers.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Non-Returnable Items</h3>
                <p className="mb-2">Due to health and hygiene regulations, we cannot accept returns on opened or used products. This applies to:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Opened pouches of Drepto Suraveda Relief, MenstroHerb Sheet, or Shanti Pain Patch.</li>
                    <li>Patches where the liners have been peeled off.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Eligibility for Refunds/Replacements</h3>
                <p className="mb-2">You are eligible for a full refund or free replacement strictly under the following circumstances:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Defective Product:</strong> The product received is damaged or the packaging is compromised upon arrival.</li>
                    <li><strong>Wrong Item:</strong> You received a product different from what you ordered (e.g., received MenstroHerb instead of Suraveda).</li>
                    <li><strong>Expiry:</strong> The product delivered is past its expiration date.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How to Initiate a Return</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Notification:</strong> You must notify us within 48 hours of delivery by emailing <a href="mailto:support@dreptobiodevices.com" className="text-primary hover:underline">support@dreptobiodevices.com</a> with your Order ID and clear photographs of the damaged/wrong product.</li>
                    <li><strong>Verification:</strong> Our team will review the claim. Once approved, we will initiate a reverse pickup or ask you to dispose of the item safely.</li>
                    <li><strong>Refund Processing:</strong> Refunds will be processed to the original payment method within 7-10 business days after claim approval.</li>
                </ul>
            </section>
        </LegalPageLayout>
    );
};

export default RefundPolicy;
