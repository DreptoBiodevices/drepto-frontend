
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
    <section className="bg-white min-h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                <span className="text-primary tracking-tighter">Drepto Biodevices</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Redefining Drug Delivery with Next-Gen Innovation
              </p>

              {/* Dynamic Stats */}
              <div className="mb-10 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="text-2xl font-bold text-primary mb-1">{stats.medicines}+</h3>
                  <p className="text-xs text-gray-600 font-medium">Medicines</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="text-2xl font-bold text-purple-600 mb-1">24/7</h3>
                  <p className="text-xs text-gray-600 font-medium">Support</p>
                </div>
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-primary text-white text-lg font-semibold px-10 py-3 rounded-[.25rem] hover:bg-primary/90"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>


          {/* Right Video */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <video
              src="/images/vid.mp4"
              className="w-full max-w-lg aspect-[16/9] object-cover h-64 md:h-80 lg:h-96"
              autoPlay
              loop
              muted
            />
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
