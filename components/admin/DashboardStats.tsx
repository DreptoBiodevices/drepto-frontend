import React, { useEffect, useState } from 'react';
import { 
  UserService, 
  DoctorService, 
  ProductService, 
  PaymentService, 
  LabCenterService,
  NurseService 
} from '../../lib/api_controller';
import { Users, UserPlus, ShoppingBag, CreditCard, Activity, Stethoscope } from 'lucide-react';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        users: 0,
        doctors: 0,
        nurses: 0,
        products: 0,
        transactions: 0,
        labCenters: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch real data from MongoDB APIs
                const [
                    usersRes,
                    doctorsRes,
                    nursesRes,
                    productsRes,
                    transactionsRes,
                    labsRes
                ] = await Promise.all([
                    UserService.getAllUsers().catch(() => ({ data: [] })),
                    DoctorService.getAll().catch(() => ({ data: [] })),
                    NurseService.getAllNurses().catch(() => ({ data: [] })),
                    ProductService.getAllProducts().catch(() => ({ data: [] })),
                    PaymentService.getAllTransactions().catch(() => ({ data: [] })),
                    LabCenterService.getAll().catch(() => ({ data: [] }))
                ]);

                // Extract array data safely depending on API response shape
                const extractArray = (res: any) => Array.isArray(res.data) ? res.data : (res.data?.data || []);

                const users = extractArray(usersRes);
                const doctors = extractArray(doctorsRes);
                const nurses = extractArray(nursesRes);
                const products = extractArray(productsRes);
                const transactions = extractArray(transactionsRes);
                const labCenters = extractArray(labsRes);

                const totalRevenue = transactions.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

                setStats({
                    users: users.length,
                    doctors: doctors.length,
                    nurses: nurses.length,
                    products: products.length,
                    transactions: transactions.length,
                    labCenters: labCenters.length,
                    revenue: totalRevenue
                });
                
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
                setError('Failed to load real-time statistics from the database.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const cards = [
        { label: 'Total Patients', value: stats.users, color: 'text-blue-600', bg: 'bg-blue-100', icon: <Users size={24} /> },
        { label: 'Doctors', value: stats.doctors, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: <Stethoscope size={24} /> },
        { label: 'Nurses', value: stats.nurses, color: 'text-cyan-600', bg: 'bg-cyan-100', icon: <UserPlus size={24} /> },
        { label: 'Products', value: stats.products, color: 'text-purple-600', bg: 'bg-purple-100', icon: <ShoppingBag size={24} /> },
        { label: 'Lab Centers', value: stats.labCenters, color: 'text-rose-600', bg: 'bg-rose-100', icon: <Activity size={24} /> },
        { label: 'Total Orders', value: stats.transactions, color: 'text-amber-600', bg: 'bg-amber-100', icon: <CreditCard size={24} /> },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
    );

    const totalPersonnel = stats.users + stats.doctors + stats.nurses || 1;

    return (
        <div className="space-y-6 mb-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{error}</div>}
            
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
                <div>
                    <p className="text-blue-100 font-medium mb-1">Total Revenue</p>
                    <h2 className="text-4xl font-bold">₹{stats.revenue.toLocaleString('en-IN')}</h2>
                </div>
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                    <CreditCard size={32} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-2">{card.label}</p>
                            <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                        </div>
                        <div className={`${card.bg} ${card.color} w-14 h-14 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Visual Distribution Bar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Platform User Distribution</h3>
                <div className="w-full h-6 flex rounded-full overflow-hidden bg-gray-100">
                    <div style={{ width: `${(stats.users / totalPersonnel) * 100}%` }} className="bg-blue-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Patients: ${stats.users}`}></div>
                    <div style={{ width: `${(stats.doctors / totalPersonnel) * 100}%` }} className="bg-emerald-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Doctors: ${stats.doctors}`}></div>
                    <div style={{ width: `${(stats.nurses / totalPersonnel) * 100}%` }} className="bg-cyan-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Nurses: ${stats.nurses}`}></div>
                </div>
                <div className="flex flex-wrap gap-6 mt-6 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-500"></span> 
                        Patients <span className="font-bold text-gray-900 ml-1">{stats.users}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500"></span> 
                        Doctors <span className="font-bold text-gray-900 ml-1">{stats.doctors}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-500"></span> 
                        Nurses <span className="font-bold text-gray-900 ml-1">{stats.nurses}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
