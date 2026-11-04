import { Medicine, FAQItem, Testimonial, LabTestDetail, LabPackageDetail, LabReview, City, SocialMediaPost } from './types';

export const MEDICINES: Medicine[] = [];

// --- Shared Order / Refund / Account Policy (keep in sync with backend order.service.ts) ---
export const ORDER_CANCELLATION_WINDOW_DAYS = 2;
export const REFUND_PROCESSING_TIME = '5–7 working days';
export const CANCELLATION_POLICY_TEXT = `You may cancel an order within ${ORDER_CANCELLATION_WINDOW_DAYS} days of placing it, as long as it has not been dispatched. If you have already paid, the full amount will be refunded to your original payment method within ${REFUND_PROCESSING_TIME}.`;
export const ACCOUNT_DELETION_TEXT = 'You can permanently delete your account at any time from Profile → Security → Delete My Account. This removes your personal information, saved addresses, order history and reviews and cannot be undone. Refunds already in progress will still be completed.';

// --- Authentic Drepto Biodevices & MenstroHerb FAQs ---
export const PHARMACY_FAQS: FAQItem[] = [
    {
        question: 'What is Drepto MenstroHerb™ and how does it work?',
        answer: 'Drepto MenstroHerb™ is an advanced, non-invasive transdermal therapeutic patch engineered at SINE, IIT Bombay. It delivers continuous, localized relief for dysmenorrhea and severe menstrual cramps by permeating botanical bio-actives directly into pelvic tissues over a 12-hour period.'
    },
    {
        question: 'How is transdermal delivery superior to oral pain relief tablets?',
        answer: 'Conventional oral pain pills (like NSAIDs) must pass through the gastrointestinal tract and liver, which often causes stomach acid reflux, gastritis, ulcers, and systemic side effects. MenstroHerb provides 100% gastrointestinal bypass, releasing active phyto-molecules directly across the skin barrier with high bioavailability and zero stomach irritation.'
    },
    {
        question: 'Is MenstroHerb clinically tested and safe for sensitive skin?',
        answer: 'Yes. MenstroHerb has undergone rigorous testing and is ISO 10993-23 certified with a 0.00 Non-Irritant score for dermal biocompatibility. Our clinical safety and permeation data are published in the peer-reviewed Journal of Ayurveda and Integrated Medical Sciences (JAIMS).'
    },
    {
        question: 'Do I need a prescription to order MenstroHerb?',
        answer: 'No prescription is required. MenstroHerb is formulated with natural herbal bio-actives and medical-grade biocompatible polymers, making it an OTC (Over-The-Counter) product that is safe for direct use.'
    },
    {
        question: 'How do I apply and wear the patch during the day?',
        answer: 'Simply peel the protective release liner and place the ultra-thin, skin-toned patch firmly onto your lower abdomen or lower back. Its breathable medical adhesive is sweat-resistant, discreet under any clothing, and remains secure during daily activities and workouts.'
    },
    {
        question: 'How can I track my shipment and order?',
        answer: 'Once your order is confirmed, you will receive a tracking link via SMS/Email. You can also view live order and dispatch status under the "My Orders" tab on our website.'
    },
    {
        question: 'What is your return and cancellation policy?',
        answer: 'Orders can be cancelled prior to dispatch within 2 days of placement. If you receive a damaged or defective package, please notify us within 48 hours of delivery for an immediate replacement or full refund.'
    },
];

// --- Verified Patient & Clinician Testimonials ---
export const PHARMACY_TESTIMONIALS: Testimonial[] = [
    {
        name: 'Dr. Ananya Sen',
        location: 'Mumbai',
        quote: 'As a gynecologist, I see young women constantly struggling with dysmenorrhea and suffering gastritis from oral painkillers. MenstroHerb transdermal delivery is a much-needed, stomach-safe alternative.'
    },
    {
        name: 'Priya Sharma',
        location: 'Mumbai',
        quote: 'My first day of periods usually meant canceling meetings with hot water bags. MenstroHerb stays discreetly on for 12 hours with zero drowsiness, allowing me to work without pain.'
    },
    {
        name: 'Sneha Kulkarni',
        location: 'Pune',
        quote: 'During marathon training, cramps used to ruin my schedule. MenstroHerb is sweat-resistant, stays in place, and provided targeted relief with no stomach burning or lethargy.'
    },
    {
        name: 'Ayesha Khan',
        location: 'IIT Bombay Campus',
        quote: 'Knowing MenstroHerb was developed right at SINE, IIT Bombay gave me full confidence in its scientific backing. It worked within 30 minutes and lasted my entire lab workday.'
    },
];

// --- Service Hubs & Delivery Cities ---
export const CITIES: City[] = [
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi NCR' },
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

// --- Clinical Trial & Evaluation Feedback ---
export const LAB_REVIEWS: LabReview[] = [
    {
        id: '1',
        userName: 'Clinical Trial Participant #14',
        date: 'Recent evaluation',
        rating: 5,
        comment: 'Onset of menstrual pain reduction observed within 25 minutes. No erythema or dermal irritation detected after 12-hour continuous wear (ISO 10993 protocol).'
    },
    {
        id: '2',
        userName: 'Clinical Evaluation Report',
        date: 'Verified batch',
        rating: 5,
        comment: 'Consistent transdermal flux achieved across multi-layer membrane matrix with high patient comfort and seamless adherence during physical mobility.'
    },
];

// --- Drepto Innovation & Research Highlights ---
export const SOCIAL_MEDIA_EMBEDS: SocialMediaPost[] = [
    {
        platform: 'linkedin',
        embedUrl: 'https://www.linkedin.com/company/drepto-biodevices',
        caption: 'Drepto Biodevices incubated at SINE, IIT Bombay: Pioneering precision transdermal drug delivery.',
        date: '2026-01-15',
    },
    {
        platform: 'linkedin',
        embedUrl: 'https://www.linkedin.com/company/drepto-biodevices',
        caption: 'MenstroHerb clinical research and biocompatibility certification published in JAIMS.',
        date: '2025-11-20',
    },
];
