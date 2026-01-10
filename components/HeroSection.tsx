
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadMedicines } from './admin/MedicineData';
import { loadLabTests } from './admin/LabTestData';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ medicines: 0, labTests: 0 });

  // useEffect removed as per user request to disable API calling
  // useEffect(() => {
  //   const meds = loadMedicines();
  //   const labs = loadLabTests();
  //   setStats({
  //     medicines: meds.length,
  //     labTests: labs.length
  //   });
  // }, []);

  return (
    <section className="bg-light-blue pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-dark-blue leading-tight">
              <span className="text-primary">Drepto Biodevices</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-600">
              Redefining Drug Delivery with Next-Gen Innovation
            </p>

            {/* Dynamic Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-50">
                <h3 className="text-2xl font-bold text-primary">{stats.medicines}+</h3>
                <p className="text-xs text-gray-500 font-medium">Medicines</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-50">
                <h3 className="text-2xl font-bold text-green-600">{stats.labTests}+</h3>
                <p className="text-xs text-gray-500 font-medium">Lab Tests</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-50">
                <h3 className="text-2xl font-bold text-purple-600">24/7</h3>
                <p className="text-xs text-gray-500 font-medium">Support</p>
              </div>
            </div>

            <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => navigate('/auth')}
                className="bg-primary text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 relative flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {/* CORRECTED: Use a path relative to the public folder root */}
          <video
            src="/images/vid.mp4"
            className="rounded-2xl shadow-2xl max-w-4xl w-full object-cover h-64 md:h-auto"
            autoPlay // Consider adding this if you want it to play automatically
            loop     // Consider adding this if you want it to loop
            muted    // Muted is often required for autoPlay to work
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
