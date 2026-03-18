import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Medicines from '../components/medicines/Medicines';
import MedicineDetail from '../components/medicines/MedicineDetail';
import { Medicine } from '../types';
import { useLocation } from 'react-router-dom';

const MedicinesPage: React.FC = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const location = useLocation();

  const dummyRefs = {
    home: { current: null }, product: { current: null },
    about: { current: null }, contact: { current: null },
  };

  useEffect(() => { window.scrollTo(0, 0); }, [selectedMedicine, location]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SEOHead
        title="Buy Medicines Online — Drepto"
        description="Order genuine medicines online with home delivery. Browse prescription and OTC medicines at affordable prices."
        keywords="buy medicines online, pharmacy, prescription medicines, OTC, medicine delivery"
        url="/medicines"
      />

      <div className="hidden md:block">
        <Navbar sectionRefs={dummyRefs as any} />
      </div>

      <main className="flex-grow">
        <div className="container mx-auto px-6 max-w-6xl py-4">
          <Breadcrumbs items={[{ label: 'Medicines' }]} />
        </div>

        {selectedMedicine ? (
          <MedicineDetail medicine={selectedMedicine} onBack={() => setSelectedMedicine(null)} />
        ) : (
          <Medicines onViewDetails={setSelectedMedicine} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MedicinesPage;