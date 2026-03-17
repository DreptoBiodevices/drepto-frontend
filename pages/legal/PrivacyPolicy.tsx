import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPolicy: React.FC = () => {
    return (
        <LegalPageLayout title="Privacy Policy" lastUpdated="December 23, 2025" breadcrumbLabel="Privacy Policy">
            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                <p>
                    At Drepto Biodevices Pvt. Ltd., located at SINE, Rahul Bajaj Building, IIT Bombay, Powai, Mumbai, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information when you order products like the Drepto Shanti Pain Patch or Suraveda Relief.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personal Information:</strong> Name, shipping address, email address, and phone number required to process your orders.</li>
                    <li><strong>Health Information:</strong> We do strictly not store sensitive medical records. However, if you voluntarily provide feedback regarding your experience with our pain relief products (e.g., for back pain, menstrual cramps, or arthritis), this data may be anonymized and used for research purposes to improve our affordable healthcare technologies.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To fulfill orders and deliver products to your doorstep.</li>
                    <li>To send order confirmations and shipping updates.</li>
                    <li>To improve our website functionality and customer service.</li>
                    <li>To comply with legal obligations.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Security</h3>
                <p>
                    We implement industry-standard security measures to protect your personal data during transmission and storage. Payment processing is handled by secure third-party gateways; we do not store your credit/debit card details on our servers.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Third-Party Disclosure</h3>
                <p>
                    We do not sell, trade, or transfer your personally identifiable information to outside parties, except for trusted third parties who assist us in operating our website and conducting our business (e.g., logistics partners), so long as those parties agree to keep this information confidential.
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default PrivacyPolicy;
