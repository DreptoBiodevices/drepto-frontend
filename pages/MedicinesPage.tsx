
import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import Medicines from '../components/medicines/Medicines';
import MedicineDetail from '../components/medicines/MedicineDetail';
import { Medicine } from '../types';
import { useLocation } from 'react-router-dom';


const MedicinesPage: React.FC = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const location = useLocation();

  // Create dummy refs for Navbar since we are reusing it but not on Landing Page
  const dummyRefs = {
    home: { current: null },
    product: { current: null },
    about: { current: null },
    contact: { current: null },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedMedicine, location]);


  // ...



  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Buy Medicines Online"
        description="Order medicines online with home delivery. Browse our wide range of prescription and over-the-counter medicines at affordable prices."
        keywords="buy medicines online, online pharmacy, prescription medicines, OTC medicines, medicine delivery"
        url="/medicines"
      />

      <div className="hidden md:block">
        <Navbar sectionRefs={dummyRefs as any} />
      </div>
      <main className="flex-grow pt-[120px] lg:pt-[120px]">
        <div className="container mx-auto px-6 py-6">
          <Breadcrumbs items={[{ label: 'Medicines' }]} />
          <BackButton />
        </div>
        {selectedMedicine ? (
          <MedicineDetail
            medicine={selectedMedicine}
            onBack={() => setSelectedMedicine(null)}
          />
        ) : (
          <Medicines onViewDetails={setSelectedMedicine} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MedicinesPage;
