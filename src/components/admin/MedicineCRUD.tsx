// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { loadMedicines, saveMedicines } from './MedicineData';
import { Search, Plus, Edit2, Trash2, ArrowLeft, Save, X, Image as ImageIcon } from 'lucide-react'; // Assuming we can use lucide-react, or I will use SVGs if not available.
// Since I don't know if lucide-react is installed, I will use SVGs to be safe, similar to AdminSidebar.

const emptyMed = {
  id: '',
  name: '',
  brand: '',
  price: 0,
  mrp: 0,
  packSize: '',
  imageUrl: '',
  images: [],
  description: '',
  contains: '',
  therapy: '',
  uses: '',
  contraindications: '',
  sideEffects: '',
  precautions: '',
  howToUse: '',
  storage: '',
  quickTips: '',
  overdose: '',
  missedDose: '',
  modeOfAction: '',
  interactions: '',
  faqs: ''
};

const MedicineCRUD = () => {
  const [items, setItems] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMed);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // useEffect removed as per user request to disable API calling
  // useEffect(() => {
  //   setItems(loadMedicines());
  // }, []);

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      id: m.id,
      name: m.name,
      brand: m.brand,
      price: m.price,
      mrp: m.mrp,
      packSize: m.packSize,
      imageUrl: m.imageUrl || '',
      images: (m.images || []).join(','),
      description: m.description,
      contains: m.contains,
      therapy: m.therapy || '',
      uses: (m.uses || []).join('\n'),
      contraindications: (m.contraindications || []).join('\n'),
      sideEffects: (m.sideEffects || []).join('\n'),
      precautions: (m.precautions || []).map(p => `${p.title}: ${p.advice}`).join('\n'),
      howToUse: m.howToUse,
      storage: m.storage,
      quickTips: (m.quickTips || []).join('\n'),
      overdose: m.dosage?.overdose || '',
      missedDose: m.dosage?.missedDose || '',
      modeOfAction: m.modeOfAction,
      interactions: m.interactions,
      faqs: (m.productFaqs || []).map(f => `${f.question} | ${f.answer}`).join('\n')
    });
    setView('form');
  };

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyMed);
    setError('');
    setView('form');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const parseFormToModel = () => {
    const id = editingId || `med-${Date.now()}`;
    return {
      id,
      name: form.name,
      brand: form.brand,
      price: Number(form.price) || 0,
      mrp: Number(form.mrp) || 0,
      packSize: form.packSize,
      imageUrl: form.imageUrl,
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      description: form.description,
      contains: form.contains,
      therapy: form.therapy,
      uses: form.uses ? form.uses.split('\n').map(s => s.trim()).filter(Boolean) : [],
      contraindications: form.contraindications ? form.contraindications.split('\n').map(s => s.trim()).filter(Boolean) : [],
      sideEffects: form.sideEffects ? form.sideEffects.split('\n').map(s => s.trim()).filter(Boolean) : [],
      precautions: form.precautions ? form.precautions.split('\n').map(row => {
        const [title, ...rest] = row.split(':');
        return { title: (title || '').trim(), advice: rest.join(':').trim() };
      }).filter(p => p.title || p.advice) : [],
      howToUse: form.howToUse,
      storage: form.storage,
      quickTips: form.quickTips ? form.quickTips.split('\n').map(s => s.trim()).filter(Boolean) : [],
      dosage: {
        overdose: form.overdose,
        missedDose: form.missedDose
      },
      modeOfAction: form.modeOfAction,
      interactions: form.interactions,
      productFaqs: form.faqs ? form.faqs.split('\n').map(row => {
        const [q, ...a] = row.split('|');
        return { question: (q || '').trim(), answer: a.join('|').trim() };
      }).filter(f => f.question || f.answer) : []
    };
  };

  const save = () => {
    const requiredFields = ['price', 'mrp']; // Reduced strictness for easier testing, can increase later
    for (const f of requiredFields) {
      const v = String(form[f] ?? '').trim();
      if (!v || (['price', 'mrp'].includes(f) && Number(form[f]) <= 0)) {
        setError(`Please fill ${f} (price/mrp > 0).`);
        return;
      }
    }
    setError('');
    if (!form.name) return;
    const model = parseFormToModel();
    let next = [...items];
    const idx = next.findIndex(i => i.id === model.id);
    if (idx >= 0) next[idx] = model; else next.unshift(model);
    setItems(next);
    saveMedicines(next);
    try { window.dispatchEvent(new Event('medicines:updated')); } catch { }
    setView('list');
  };

  const remove = (id) => {
    if (!confirm('Are you sure?')) return;
    const next = items.filter(i => i.id !== id);
    setItems(next);
    saveMedicines(next);
    try { window.dispatchEvent(new Event('medicines:updated')); } catch { }
  };

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.brand.toLowerCase().includes(search.toLowerCase())
  );

  // Icons
  const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
  const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
  const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
  const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
  const BackIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Medicines</h2>
          <button onClick={handleCreate} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all">
            <PlusIcon />
            Add Medicine
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Brand</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center border overflow-hidden">
                          {m.imageUrl ? (
                            <img src={m.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400">IMG</span>
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{m.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{m.brand}</td>
                    <td className="px-6 py-3 font-medium">
                      ₹{m.price} <span className="text-gray-400 text-xs line-through ml-1">₹{m.mrp}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <EditIcon />
                        </button>
                        <button onClick={() => remove(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      No medicines found.
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
          <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Medicine' : 'New Medicine'}</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Cancel</button>
          <button onClick={save} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium shadow-sm">Save Changes</button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">{error}</div>}

        {/* Section 1: Basic Stats */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Info</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
              <input required name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input required name="brand" value={form.brand} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
              <input name="packSize" value={form.packSize} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" placeholder="e.g. 10 Tablets" />
            </div>
          </div>
        </section>

        {/* Section 2: Pricing */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
              <input type="number" name="mrp" value={form.mrp} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary font-bold" />
            </div>
          </div>
        </section>

        {/* Section 3: Media */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Media</h3>
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden relative group">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-2">No Image</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-white text-xs font-bold">Change</p>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Image URLs (Comma separated)</label>
              <textarea name="images" value={form.images} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary h-24 text-sm font-mono" />
            </div>
          </div>
        </section>

        {/* Section 4: Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Usage & Description</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary h-32" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uses (Lines)</label>
              <textarea name="uses" value={form.uses} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary h-32" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review/Side Effects</label>
              <textarea name="sideEffects" value={form.sideEffects} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none focus:border-primary h-32" />
            </div>
          </div>
        </section>

        {/* Section 5: Extra */}
        <section className="space-y-4 pb-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Medical Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <input name="contains" value={form.contains} onChange={handleChange} placeholder="Composition/Salt" className="border rounded-lg p-2.5" />
            <input name="therapy" value={form.therapy} onChange={handleChange} placeholder="Therapy Class" className="border rounded-lg p-2.5" />
          </div>
          <textarea name="howToUse" value={form.howToUse} onChange={handleChange} placeholder="How to Use" className="w-full border rounded-lg p-2.5 h-20" />
          <textarea name="precautions" value={form.precautions} onChange={handleChange} placeholder="Precautions (Format: Title: Advice)" className="w-full border rounded-lg p-2.5 h-20" />
        </section>
      </div>
    </div>
  );
};

export default MedicineCRUD;
