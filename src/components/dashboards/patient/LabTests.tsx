
import React, { useState, useRef, useEffect } from 'react';
import { loadLabTests } from '../../admin/LabTestData';

// --- Types ---
interface LabTest {
  id: string; // Changed to string to match Admin ID
  name: string;
  sampleType: string;
  preparation: string;
  price: number;
  availability: string;
  turnaroundTime: string;
  category?: string;
  description?: string;
}

interface LabPackage {
  id: number;
  name: string;
  tests: string[];
  price: number;
  originalPrice: number;
  discount: string;
}

interface City {
  id: number;
  name: string;
}

// --- Mock Packages (Keeping as mock for now as requested fix focuses on items visibility) ---
const labPackages: LabPackage[] = [];

const cities: City[] = [
  { id: 1, name: 'Mumbai' },
  { id: 2, name: 'Delhi' },
  { id: 3, name: 'Bangalore' },
  { id: 4, name: 'Hyderabad' },
  { id: 5, name: 'Chennai' },
  { id: 6, name: 'Kolkata' },
  { id: 7, name: 'Pune' },
  { id: 8, name: 'Ahmedabad' },
];

const LabTests: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  // Data State
  const [labTests, setLabTests] = useState<LabTest[]>([]);

  // Booking & Modal States
  const [bookingStep, setBookingStep] = useState<'none' | 'date' | 'success'>('none');
  const [bookingItem, setBookingItem] = useState<{ name: string, price: number } | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');

  // Upload States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = () => {
      const raw = loadLabTests() || [];
      // Map Admin Data to Component State
      const mapped = raw.map((t: any) => ({
        id: t.id,
        name: t.name,
        sampleType: t.sampleType || 'N/A',
        preparation: t.fasting || 'No special preparation',
        price: Number(t.price) || 0,
        availability: 'Available in all locations', // Default for now
        turnaroundTime: t.reportTime || '24 hours',
        category: t.category || 'General',
        description: t.description
      }));
      setLabTests(mapped);
    };
    load();
    const onUpdate = () => load();
    window.addEventListener('labtests:updated', onUpdate);
    window.addEventListener('storage', onUpdate); // Listen to storage events too
    return () => {
      window.removeEventListener('labtests:updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  const filteredTests = labTests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCity === null || test.availability.includes(cities.find(c => c.id === selectedCity)?.name || ''))
  );

  const handleBook = (name: string, price: number) => {
    setBookingItem({ name, price });
    setBookingStep('date');
  };

  const confirmBooking = () => {
    setBookingStep('success');
  };

  const closeBooking = () => {
    setBookingStep('none');
    setBookingItem(null);
    setBookingDate('');
    setBookingTime('');
    setAddress('');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setIsUploadOpen(false);
        }, 2000);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 animate-fade-in-up relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center w-full md:w-auto">
          <button onClick={onBack} className="mr-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
            <svg className="w-5 h-5 text-gray-500 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lab Tests & Packages</h1>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          Upload Prescription
        </button>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Top Cities Filter */}
        <div className="mb-8 overflow-x-auto">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Select Location</h2>
          <div className="flex flex-wrap gap-2 min-w-max">
            <button
              onClick={() => setSelectedCity(null)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCity === null
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCity === city.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Search</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-medium bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 scrollbar-hide">
                {labTests.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => { setSelectedTest(test.id); setSearchTerm(test.name); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedTest === test.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {test.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 order-1 lg:order-2">
            {/* Lab Tests */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Popular Lab Tests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTests.length > 0 ? filteredTests.map((test) => (
                  <div key={test.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-md">{test.category}</span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-500 mt-3">
                        <p><span className="font-bold text-gray-700">Sample:</span> {test.sampleType}</p>
                        <p><span className="font-bold text-gray-700">Preparation:</span> {test.preparation}</p>
                        <p><span className="font-bold text-gray-700">Report:</span> {test.turnaroundTime}</p>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">₹{test.price}</span>
                      <button onClick={() => handleBook(test.name, test.price)} className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                        Book Now
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12 text-gray-500">No tests found matching your search.</div>
                )}
              </div>
            </div>

            {/* Lab Packages */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Health Packages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {labPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                      <div className="flex items-center mt-2 gap-2">
                        <span className="text-2xl font-bold text-indigo-700">₹{pkg.price}</span>
                        <span className="ml-1 text-sm text-gray-400 line-through font-medium">₹{pkg.originalPrice}</span>
                        <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          {pkg.discount}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-1">
                      <h4 className="font-bold text-xs text-gray-400 uppercase mb-3 tracking-wide">Includes {pkg.tests.length} Tests:</h4>
                      <ul className="space-y-2">
                        {pkg.tests.map((test, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="truncate">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-5 pt-0 mt-auto">
                      <button onClick={() => handleBook(pkg.name, pkg.price)} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg">
                        View Details & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Prescription Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button onClick={() => setIsUploadOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="text-center mb-8 mt-2">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Upload Prescription</h3>
              <p className="text-gray-500 text-sm mt-1">Upload your doctor's note to book tests.</p>
            </div>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center bg-indigo-50/30 hover:bg-indigo-50 cursor-pointer transition-all group">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*,.pdf" />
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-indigo-600 font-bold">Uploading file...</p>
                </div>
              ) : uploadSuccess ? (
                <div className="flex flex-col items-center text-green-500 animate-fade-in-up">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-lg font-bold">Upload Successful!</p>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-indigo-300 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="text-gray-700 font-bold">Click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, PDF (Max 5MB)</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingStep !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 relative">
            {bookingStep === 'date' && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h3>
                <p className="text-indigo-600 font-bold text-lg mb-6">{bookingItem?.name} - ₹{bookingItem?.price}</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                      <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                      <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                    <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border-transparent focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Enter collection address..."></textarea>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={closeBooking} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                    <button onClick={confirmBooking} disabled={!bookingDate || !bookingTime || !address} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg disabled:opacity-50 transition-all">Confirm</button>
                  </div>
                </div>
              </>
            )}
            {bookingStep === 'success' && (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 mb-8">Your lab test has been scheduled.</p>
                <button onClick={closeBooking} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default LabTests;
