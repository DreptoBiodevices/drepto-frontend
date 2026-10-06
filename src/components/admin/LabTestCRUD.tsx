// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { loadLabTests, saveLabTests } from './LabTestData';
import { Search, Plus, Edit2, Trash2, ArrowLeft, Save, X } from 'lucide-react';

const emptyTest = {
  id: '',
  name: '',
  alias: '',
  testCount: 1,
  fasting: '',
  reportTime: '',
  price: 0,
  mrp: 0,
  discount: '',
  sampleType: '',
  tubeType: '',
  description: '',
  whyItMatters: '',
  parameters: '',
  category: '',
  rating: 0,
  reviewCount: 0
};

const LabTestCRUD = () => {
  const [items, setItems] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTest);
  const [search, setSearch] = useState('');

  // useEffect removed as per user request to disable API calling
  // useEffect(() => {
  //   setItems(loadLabTests());
  // }, []);

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      id: t.id,
      name: t.name,
      alias: t.alias,
      testCount: t.testCount,
      fasting: t.fasting,
      reportTime: t.reportTime,
      price: t.price,
      mrp: t.mrp,
      discount: t.discount,
      sampleType: t.sampleType,
      tubeType: t.tubeType,
      description: t.description,
      whyItMatters: t.whyItMatters,
      parameters: (t.parameters || []).join('\n'),
      category: t.category,
      rating: t.rating,
      reviewCount: t.reviewCount
    });
    setView('form');
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyTest);
    setView('form');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'mrp' || name === 'rating' || name === 'reviewCount' || name === 'testCount' ? Number(value) : value }));
  };

  const parseFormToModel = () => {
    const id = editingId || `lab-${Date.now()}`;
    return {
      id,
      name: form.name,
      alias: form.alias,
      testCount: Number(form.testCount) || 1,
      fasting: form.fasting,
      reportTime: form.reportTime,
      price: Number(form.price) || 0,
      mrp: Number(form.mrp) || 0,
      discount: form.discount,
      sampleType: form.sampleType,
      tubeType: form.tubeType,
      description: form.description,
      whyItMatters: form.whyItMatters,
      parameters: form.parameters ? form.parameters.split('\n').map(s => s.trim()).filter(Boolean) : [],
      category: form.category,
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0
    };
  };

  const save = () => {
    if (!form.name) return;
    const model = parseFormToModel();
    let next = [...items];
    const idx = next.findIndex(i => i.id === model.id);
    if (idx >= 0) next[idx] = model; else next.unshift(model);
    setItems(next);
    saveLabTests(next);
    try { window.dispatchEvent(new Event('labtests:updated')); } catch { }
    setView('list');
  };

  const remove = (id) => {
    if (!confirm('Are you sure?')) return;
    const next = items.filter(i => i.id !== id);
    setItems(next);
    saveLabTests(next);
    try { window.dispatchEvent(new Event('labtests:updated')); } catch { }
  };

  const filteredItems = items.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  // Icons (reused or imported)
  const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
  const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
  const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
  const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
  const BackIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Lab Tests</h2>
          <button onClick={handleCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all">
            <PlusIcon />
            Add Test
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Test Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.alias}</div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-100">{t.category || 'General'}</span>
                    </td>
                    <td className="px-6 py-3 font-medium">
                      ₹{t.price} <span className="text-gray-400 text-xs line-through ml-1">₹{t.mrp}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <EditIcon />
                        </button>
                        <button onClick={() => remove(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      No lab tests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border rounded-xl shadow-lg my-4 overflow-hidden">
      <div className="p-6 border-b bg-gray-50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-800 transition-colors">
            <BackIcon />
          </button>
          <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Test' : 'New Test'}</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Cancel</button>
          <button onClick={save} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium shadow-sm">Save Changes</button>
        </div>
      </div>

      <div className="p-8 space-y-8">

        {/* Section 1: Basic Info */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Test Info</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alias/Short Name</label>
              <input name="alias" value={form.alias} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
          </div>
        </section>

        {/* Section 2: Pricing */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Logistics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
              <input type="number" name="mrp" value={form.mrp} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Time</label>
              <input name="reportTime" value={form.reportTime} onChange={handleChange} placeholder="e.g. 24 Hours" className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <input name="sampleType" value={form.sampleType} onChange={handleChange} placeholder="Sample Type (e.g. Blood)" className="border rounded-lg p-2.5" />
            <input name="fasting" value={form.fasting} onChange={handleChange} placeholder="Fasting Required?" className="border rounded-lg p-2.5" />
          </div>
        </section>

        {/* Section 3: Details */}
        <section className="space-y-4 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2.5 h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why It Matters</label>
            <textarea name="whyItMatters" value={form.whyItMatters} onChange={handleChange} className="w-full border rounded-lg p-2.5 h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parameters Covered (Line separated)</label>
            <textarea name="parameters" value={form.parameters} onChange={handleChange} className="w-full border rounded-lg p-2.5 h-24 font-mono text-sm" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default LabTestCRUD;
