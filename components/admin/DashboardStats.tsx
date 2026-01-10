import React, { useEffect, useState } from 'react';
import { loadMedicines } from './MedicineData';
import { loadLabTests } from './LabTestData';
import { loadProjects } from './ProjectData';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        medicines: 0,
        labTests: 0,
        projects: 0
    });

    // useEffect removed as per user request to disable API calling
    // useEffect(() => {
    //     const update = () => {
    //         const meds = loadMedicines();
    //         const labs = loadLabTests();
    //         const projects = loadProjects();

    //         setStats({
    //             medicines: meds.length,
    //             labTests: labs.length,
    //             projects: projects.length
    //         });
    //     };

    //     update();

    //     window.addEventListener('medicines:updated', update);
    //     window.addEventListener('labtests:updated', update);
    //     window.addEventListener('projects:updated', update);
    //     window.addEventListener('storage', update);

    //     return () => {
    //         window.removeEventListener('medicines:updated', update);
    //         window.removeEventListener('labtests:updated', update);
    //         window.removeEventListener('projects:updated', update);
    //         window.removeEventListener('storage', update);
    //     };
    // }, []);

    const cards = [
        { label: 'Total Medicines', value: stats.medicines, color: 'bg-blue-500', icon: '💊' },
        { label: 'Total Lab Tests', value: stats.labTests, color: 'bg-green-500', icon: '🧪' },
        { label: 'Active Projects', value: stats.projects, color: 'bg-purple-500', icon: '📁' },
        { label: 'Pending Reviews', value: 12, color: 'bg-orange-500', icon: '📝' } // Mock
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                    </div>
                    <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-xl text-white`}>
                        {card.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
