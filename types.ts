
export enum UserRole {
    PATIENT = 'Patient',
    DOCTOR = 'Doctor',
    NURSE = 'Nurse',
    ADMIN = 'Admin',
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isFirstLogin?: boolean;
    mobileNumber?: string;
    gender?: 'Male' | 'Female' | 'Other' | string;
    age?: number | string;
    bloodGroup?: string;
    weight?: number | string;
    profileImage?: string;
    // Nurse specific fields
    serviceTypes?: string[];
}

export interface ProductFAQ {
    question: string;
    answer: string;
}

export interface Precaution {
    title: string;
    advice: string;
}

export interface Dosage {
    overdose: string;
    missedDose: string;
}

export interface Medicine {
    id: string;
    name: string;
    brand: string;
    price: number;
    mrp: number;
    packSize: string;
    imageUrl: string;
    images?: string[];
    description: string;
    contains: string;
    therapy: string;
    uses: string[];
    contraindications: string[];
    sideEffects: string[];
    precautions: Precaution[];
    howToUse: string;
    storage: string;
    quickTips: string[];
    dosage: Dosage;
    modeOfAction: string;
    interactions: string;
    productFaqs: ProductFAQ[];
}

export interface Testimonial {
    name: string;
    location: string;
    quote: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

// --- Lab Test Specific Types ---

export interface LabTestDetail {
    id: string;
    name: string;
    alias: string;
    testCount: number;
    fasting: string;
    reportTime: string;
    price: number;
    mrp: number;
    discount: string;
    sampleType: string;
    tubeType: string;
    description: string;
    whyItMatters: string;
    parameters: string[];
    category: string;
    rating: number;
    reviewCount: number;
}

export interface LabPackageDetail {
    id: string;
    name: string;
    testCount: number;
    fasting: string;
    reportTime: string;
    price: number;
    mrp: number;
    discount: string;
    description: string;
    testsIncluded: string[]; // List of individual test names or categories
    rating: number;
    reviewCount: number;
    idealFor: string;
}

export interface LabReview {
    id: string;
    userName: string;
    date: string;
    rating: number;
    comment: string;
}

export interface City {
    id: string;
    name: string;
}

export interface Address {
    houseNo: string;
    buildingName: string;
    street: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    contactNumber: string;
}

export type ShippingSource = 'IIT Bombay' | 'Warehouse' | 'Digital';

export type OrderStatus = 'Placed' | 'Packaging' | 'Dispatched' | 'Delivered' | 'Active';

export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image?: string;
    shippingSource?: ShippingSource; // For free samples
}

export interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    shippingAddress: Address;
    trackingId?: string;
    estimatedDelivery?: string;
    shippingMethod?: 'India Post' | 'Speed Post' | 'Digital';
    shippingCost?: number;
    gst?: number;
    paymentId?: string;
}
