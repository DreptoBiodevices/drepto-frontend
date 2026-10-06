
import { Medicine, FAQItem, Testimonial, LabTestDetail, LabPackageDetail, LabReview, City, SocialMediaPost } from './types';

export const MEDICINES: Medicine[] = [];

export const PHARMACY_FAQS: FAQItem[] = [
    { question: 'Is it safe to buy medicines online?', answer: 'Yes, we ensure all medicines are sourced from licensed pharmacies and are 100% genuine.' },
    { question: 'Do I need a prescription?', answer: 'For certain scheduled drugs (Schedule H & H1), a valid prescription is mandatory. OTC products do not require one.' },
    { question: 'How can I track my order?', answer: 'You can track your order status in the "My Orders" section of the app or website.' },
    { question: 'What is the return policy?', answer: 'We have a 7-day return policy for damaged or incorrect items. Please check our return policy page for more details.' },
];

export const PHARMACY_TESTIMONIALS: Testimonial[] = [
    { name: 'Amit Sharma', location: 'Delhi', quote: 'Super fast delivery! Got my medicines within 2 hours. Highly recommended.' },
    { name: 'Priya Patel', location: 'Mumbai', quote: 'Genuine medicines and great discounts. The app is very easy to use.' },
    { name: 'Rahul Verma', location: 'Bangalore', quote: 'Customer support is excellent. They helped me find a substitute for a medicine that was out of stock.' },
    { name: 'Sneha Gupta', location: 'Hyderabad', quote: 'I order for my parents regularly. The subscription feature ensures they never run out of meds.' },
];

// --- Lab Data ---

export const CITIES: City[] = [
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'bengaluru', name: 'Bengaluru' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'pune', name: 'Pune' },
    { id: 'kolkata', name: 'Kolkata' },
    { id: 'ahmedabad', name: 'Ahmedabad' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'jaipur', name: 'Jaipur' },
    { id: 'nagpur', name: 'Nagpur' },
];

export const LAB_TESTS_DATA: LabTestDetail[] = [];

export const LAB_PACKAGES_DATA: LabPackageDetail[] = [];

export const LAB_REVIEWS: LabReview[] = [
    { id: '1', userName: 'Suresh Raina', date: '2 days ago', rating: 5, comment: 'Excellent service. The phlebotomist arrived on time and was very professional.' },
    { id: '2', userName: 'Anjali Menon', date: '1 week ago', rating: 4, comment: 'Reports were delivered on time via email. Good experience.' },
    { id: '3', userName: 'Vikram Singh', date: '3 weeks ago', rating: 5, comment: 'Very affordable packages compared to local labs. Highly recommend.' },
];

// --- Social Media Embeds ---
// Add your social media post URLs here. The blog page will embed them automatically.
export const SOCIAL_MEDIA_EMBEDS: SocialMediaPost[] = [
    {
        platform: 'instagram',
        embedUrl: 'https://www.instagram.com/p/EXAMPLE1/',
        caption: 'Drepto Biodevices — Innovating healthcare diagnostics',
        date: '2025-12-15',
    },
    {
        platform: 'linkedin',
        embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:EXAMPLE1',
        caption: 'Our journey in biotech innovation',
        date: '2025-12-10',
    },
    {
        platform: 'twitter',
        embedUrl: 'https://twitter.com/DreptoDevices/status/EXAMPLE1',
        caption: 'Launching our new water quality testing device!',
        date: '2025-12-05',
    },
    {
        platform: 'instagram',
        embedUrl: 'https://www.instagram.com/p/EXAMPLE2/',
        caption: 'Behind the scenes at SINE IIT Bombay',
        date: '2025-11-20',
    },
    {
        platform: 'linkedin',
        embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:EXAMPLE2',
        caption: 'Drepto team at the healthcare innovation summit',
        date: '2025-11-15',
    },
    {
        platform: 'twitter',
        embedUrl: 'https://twitter.com/DreptoDevices/status/EXAMPLE2',
        caption: 'Thank you for 1000+ customers!',
        date: '2025-11-01',
    },
];
