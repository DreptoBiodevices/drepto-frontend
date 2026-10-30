// @ts-nocheck
import React, { useState } from 'react';
import { ADMIN_AUTH_KEY } from './adminData';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Users, MapPin,
  MessageSquare, CreditCard, FlaskConical, Pill, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

interface Props { activeTab: string; setActiveTab: (t: string) => void; }

const nav = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard, group: 'Main' },
  { id: 'orders',        label: 'Orders',         icon: ShoppingBag,     group: 'Commerce' },
  { id: 'transactions',  label: 'Payments',       icon: CreditCard,      group: 'Commerce' },
  { id: 'users',         label: 'Users',          icon: Users,           group: 'Commerce' },
  { id: 'shipping',      label: 'Shipping',       icon: MapPin,          group: 'Commerce' },
  { id: 'products',      label: 'Products',       icon: Package,         group: 'Catalogue' },
  { id: 'medicines',     label: 'Medicines',      icon: Pill,            group: 'Catalogue' },
  { id: 'labtests',      label: 'Lab Tests',      icon: FlaskConical,    group: 'Catalogue' },
  { id: 'feedback',      label: 'Feedback',       icon: MessageSquare,   group: 'Insights' },
];

const groups = ['Main', 'Commerce', 'Catalogue', 'Insights'];

const AdminSidebar: React.FC<Props & { isOpen: boolean; onClose: () => void }> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    window.dispatchEvent(new Event('admin-auth-change'));
    navigate('/admin/login');
  };

  const handleNav = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-screen w-60 z-50 flex flex-col bg-white border-r border-gray-100
        transition-transform duration-300 md:translate-x-0 md:static md:h-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#c01226] flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-none">Drepto</p>
            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-700 md:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups.map(group => {
            const items = nav.filter(n => n.group === group);
            return (
              <div key={group}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1.5">{group}</p>
                <div className="space-y-0.5">
                  {items.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => handleNav(id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        activeTab === id
                          ? 'bg-[#c01226] text-white shadow-sm shadow-red-700/20'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
