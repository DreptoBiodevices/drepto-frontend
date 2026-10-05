import React, { useState } from 'react';
import { ContactService } from '../lib/api_controller';
import { Phone, Linkedin } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const ContactSection: React.FC = () => {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Basic Validation if needed, but HTML5 validation handles 'required'
            await ContactService.create(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', contactNumber: '', subject: '', message: '' }); // Reset
        } catch (err: any) {
            console.error("Contact submission failed", err);
            setError(err.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-primary inline-block border-b-4 border-primary pb-2 mb-6">
                        {t('contact.title')}
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left Column: Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-primary text-center mb-8">
                            {t('contact.sendMessage')}
                        </h3>

                        {submitted ? (
                            <div className="text-center py-10">
                                <h3 className="text-2xl font-bold text-secondary mb-2">{t('contact.thankYou')}</h3>
                                <p className="text-gray-600">{t('contact.successMessage')}</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 text-primary underline hover:text-dark-blue"
                                >
                                    {t('contact.sendAnother')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.contactNumber')}</label>
                                    <input
                                        type="tel"
                                        id="contactNumber" // Changed ID to match DTO field name
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.subject')}</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    ></textarea>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`bg-primary text-white font-semibold py-2 px-6 rounded hover:bg-dark-blue transition-colors w-full flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('contact.sending')}
                                            </>
                                        ) : t('contact.send')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Right Column: Info & Hiring */}
                    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col justify-between">
                        {/* Hiring Section */}
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-primary mb-6">
                                We're Growing Fast and Hiring!
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Join our team and help shape the future of technology.
                            </p>
                            <a href="https://forms.gle/Li6JY1YQW5fs8bUW8" target="_blank" rel="noopener noreferrer" className="block w-full py-3 text-center no-underline bg-[#00857C] text-white font-semibold rounded-lg shadow-md hover:bg-[#006A63] transition-colors">Submit Your Application</a>
                        </div>

                        {/* Why Join Us - Filler Content */}
                        <div className="mb-8">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Why Join Drepto?</h4>
                            <ul className="space-y-3 text-gray-600 px-4">
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Work on ground-breaking medical technology</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Collaborative and innovative environment</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Opportunities for growth and research</span>
                                </li>
                            </ul>
                        </div>

                        <hr className="border-gray-200 my-8" />

                        {/* Connect Section */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-primary mb-6">
                                Connect With Us
                            </h3>
                            <div className="flex flex-col gap-4 text-left max-w-sm mx-auto">
                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-lg">✉</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary text-sm">Email</p>
                                        <a href="mailto:office@dreptobiodevices.com" className="text-gray-700 hover:text-primary transition-colors break-all">office@dreptobiodevices.com</a>
                                    </div>
                                </div>

                                {/* Contact Number */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Phone className="w-4 h-4 text-green-600" />
                                    </div>

                                    <div>
                                        <p className="font-bold text-primary text-sm">Phone</p>
                                        <a
                                            href="tel:+918451822256"
                                            className="text-gray-700 hover:text-primary transition-colors"
                                        >
                                            +91 84518 22256
                                        </a>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-lg">🕒</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary text-sm">Working Hours</p>
                                        <p className="text-gray-700">Monday - Friday, 9am - 5pm IST</p>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary text-sm">LinkedIn</p>
                                        <a
                                            href="https://www.linkedin.com/company/drepto-biodevices-pvt-ltd/posts/?feedView=all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 hover:text-primary transition-colors"
                                        >
                                            Follow us on LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
