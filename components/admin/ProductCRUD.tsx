
import React, { useState, useEffect } from 'react';
import { ProductService } from '../../lib/api_controller';
import { Plus, Edit2, Trash2, X, Save, Search, Image as ImageIcon, Loader2, Tag, Percent, Sparkles, Gift } from 'lucide-react';
import { Product, PackageDetail, ProductOffer, OfferType } from '../../pages/ProductDetailPage';

// Extended interface to include ID for management
interface AdminProduct extends Product {
    _id?: string;
    id?: string;
}

const emptyPackageDetail: PackageDetail = { length: undefined, breadth: undefined, height: undefined, weight: undefined };

const defaultOffer: ProductOffer = {
    title: 'Buy 2 Get 1 Free',
    description: 'Buy 2 items and get 1 item free automatically applied at checkout',
    type: 'BOGO',
    buyQuantity: 2,
    getFreeQuantity: 1,
    discountPercentage: 20,
    flatDiscount: 100,
    minQuantity: 1,
    isActive: false,
};

const emptyProduct: AdminProduct = {
    name: '',
    description: '',
    detailedDescription: '',
    price: 0,
    mrp: 0,
    offerDescription: '',
    offer: { ...defaultOffer },
    images: [],
    category: '',
    quantity: '',
    form: '',
    containerType: '',
    applicationArea: '',
    packOf: undefined,
    idealsFor: '',
    licenseNumber: '',
    itemIncluded: [],
    keyFeatures: [],
    keySpecs: [],
    composition: [],
    ingredients: [],
    benefits: [],
    sideEffects: [],
    developmentStory: '',
    maximumShelfLife: '',
    packageDetail: { ...emptyPackageDetail },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <div className="col-span-full mt-4 -mb-1">
        <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
            <p className="text-xs font-bold uppercase tracking-widest text-primary/80">{title}</p>
            {subtitle && <span className="text-[11px] text-gray-400 font-normal">{subtitle}</span>}
        </div>
    </div>
);

const Field: React.FC<{
    label: string; value: string | number | undefined; onChange: (v: string) => void;
    type?: string; required?: boolean; placeholder?: string; colSpan?: boolean;
}> = ({ label, value, onChange, type = 'text', required, placeholder, colSpan }) => (
    <div className={`space-y-1.5${colSpan ? ' col-span-full' : ''}`}>
        <label className="text-sm font-medium text-gray-700">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
            type={type}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/30"
        />
    </div>
);

const TextAreaField: React.FC<{
    label: string; value: string; onChange: (v: string) => void;
    rows?: number; required?: boolean; placeholder?: string; colSpan?: boolean;
}> = ({ label, value, onChange, rows = 3, required, placeholder, colSpan = true }) => (
    <div className={`space-y-1.5${colSpan ? ' col-span-full' : ''}`}>
        <label className="text-sm font-medium text-gray-700">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <textarea
            rows={rows}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/30 resize-y"
        />
    </div>
);

const ArrayField: React.FC<{
    label: string; value: string[]; onChange: (v: string[]) => void;
    placeholder?: string; colSpan?: boolean;
}> = ({ label, value, onChange, placeholder, colSpan }) => (
    <div className={`space-y-1.5${colSpan ? ' col-span-full' : ''}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            value={(value || []).join(', ')}
            onChange={e => onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50/30"
        />
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductCRUD: React.FC = () => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<AdminProduct | null>(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<AdminProduct>(emptyProduct);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await ProductService.getAllProducts();
            const data = Array.isArray(response.data) ? response.data :
                (response.data.products || response.data.data || []);
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setCurrentProduct(null);
        setFormData({
            ...emptyProduct,
            packageDetail: { ...emptyPackageDetail },
            offer: { ...defaultOffer, isActive: false }
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (product: AdminProduct) => {
        setCurrentProduct(product);
        // Normalize offer from product or legacy offerDescription
        let initialOffer: ProductOffer = { ...defaultOffer, isActive: false };
        if (product.offer) {
            initialOffer = { ...defaultOffer, ...product.offer };
        } else if (product.offerDescription && product.offerDescription.trim().length > 0) {
            initialOffer = {
                ...defaultOffer,
                title: product.offerDescription,
                isActive: true,
                type: 'BOGO',
                buyQuantity: 2,
                getFreeQuantity: 1
            };
        }

        setFormData({
            ...emptyProduct,
            ...product,
            packageDetail: product.packageDetail ? { ...product.packageDetail } : { ...emptyPackageDetail },
            offer: initialOffer
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await ProductService.deleteProduct(id);
                setProducts(products.filter(p => (p.id || p._id) !== id));
            } catch (error) {
                console.error('Failed to delete product', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Keep offerDescription synchronized with offer title when active
            const offerData = formData.offer;
            const updatedPayload: AdminProduct = {
                ...formData,
                offer: offerData,
                offerDescription: (offerData && offerData.isActive)
                    ? (offerData.title || 'Buy 2 Get 1 Free')
                    : ''
            };

            if (currentProduct) {
                const id = currentProduct.id || currentProduct._id;
                if (id) await ProductService.updateProduct(id, updatedPayload);
            } else {
                await ProductService.createProduct(updatedPayload);
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save product', error);
            alert('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const set = (field: keyof AdminProduct, value: any) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const setOffer = (field: keyof ProductOffer, value: any) => {
        setFormData(prev => {
            const currentOffer = prev.offer || { ...defaultOffer };
            const updatedOffer: ProductOffer = { ...currentOffer, [field]: value };

            // Automatically suggest descriptive title if user hasn't typed a custom override
            if (field === 'type' || field === 'buyQuantity' || field === 'getFreeQuantity' || field === 'discountPercentage' || field === 'flatDiscount') {
                if (updatedOffer.type === 'BOGO') {
                    const b = updatedOffer.buyQuantity || 2;
                    const f = updatedOffer.getFreeQuantity || 1;
                    updatedOffer.title = `Buy ${b} Get ${f} Free`;
                } else if (updatedOffer.type === 'PERCENTAGE') {
                    updatedOffer.title = `${updatedOffer.discountPercentage || 0}% OFF`;
                } else if (updatedOffer.type === 'FLAT') {
                    updatedOffer.title = `₹${updatedOffer.flatDiscount || 0} OFF`;
                }
            }

            return {
                ...prev,
                offer: updatedOffer,
                offerDescription: updatedOffer.isActive ? (updatedOffer.title || '') : ''
            };
        });
    };

    const setPkg = (field: keyof PackageDetail, value: string) =>
        setFormData(prev => ({
            ...prev,
            packageDetail: {
                ...prev.packageDetail,
                [field]: value === '' ? undefined : Number(value),
            },
        }));

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Products & Offer Management</h2>
                    <p className="text-sm text-gray-500">Create, edit products, and configure dynamic offers that apply directly at checkout</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Image</th>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price / MRP</th>
                                <th className="px-6 py-4 font-semibold">Applied Offer</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const offerActive = product.offer ? product.offer.isActive : !!product.offerDescription;
                                    const offerTitle = product.offer?.title || product.offerDescription;

                                    return (
                                        <tr key={product.id || product._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div>{product.name}</div>
                                                {product.quantity && <div className="text-xs text-gray-400">{product.quantity}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900">&#8377;{product.price}</span>
                                                    <span className="text-xs line-through text-gray-400">&#8377;{product.mrp}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {offerActive && offerTitle ? (
                                                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs">
                                                        <Tag className="w-3 h-3 text-emerald-700 shrink-0" />
                                                        <span>{offerTitle}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No offer active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                        title="Edit Product & Offer"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(product.id || product._id || '')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No products found. Click "Add Product" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {currentProduct ? 'Edit Product & Offer' : 'Add New Product'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Configure product attributes and automated discount offers</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* ── Core Info ── */}
                                <SectionHeading title="Core Info" />
                                <Field label="Product Name" value={formData.name} onChange={v => set('name', v)} required placeholder="e.g. Derma Shield Sunscreen" />
                                <Field label="Category" value={formData.category} onChange={v => set('category', v)} required placeholder="e.g. Skin Care" />
                                <TextAreaField label="Short Description" value={formData.description} onChange={v => set('description', v)} required rows={3} placeholder="Brief product summary..." />
                                <TextAreaField label="Detailed Description" value={formData.detailedDescription || ''} onChange={v => set('detailedDescription', v)} rows={4} placeholder="Extended product details..." />

                                {/* ── Pricing ── */}
                                <SectionHeading title="Pricing" />
                                <Field label="Selling Price (₹)" value={formData.price} onChange={v => set('price', Number(v))} type="number" required />
                                <Field label="MRP (₹)" value={formData.mrp} onChange={v => set('mrp', Number(v))} type="number" required />

                                {/* ── Dynamic Offer DTO Section ── */}
                                <div className="col-span-full bg-gradient-to-br from-emerald-50/60 to-teal-50/40 p-5 rounded-2xl border border-emerald-200/80 space-y-4">
                                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900">Direct Checkout Offer (DTO)</h4>
                                                <p className="text-xs text-gray-500">Automatically applied to product page badge and checkout amount calculation</p>
                                            </div>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.offer?.isActive || false}
                                                onChange={e => setOffer('isActive', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                            <span className="ml-2.5 text-xs font-semibold text-gray-800">
                                                {formData.offer?.isActive ? 'Offer Active' : 'Offer Disabled'}
                                            </span>
                                        </label>
                                    </div>

                                    {formData.offer?.isActive && (
                                        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                                            {/* Offer Type Selection */}
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 block mb-2">Offer Type</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOffer('type', 'BOGO')}
                                                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                            formData.offer?.type === 'BOGO'
                                                                ? 'border-emerald-500 bg-white shadow-sm ring-2 ring-emerald-500/20'
                                                                : 'border-gray-200 bg-white/70 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-bold text-gray-900">Buy X Get Y Free</span>
                                                            <Gift className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <span className="text-[11px] text-gray-500">e.g. Buy 2 Get 1 Free, Buy 1 Get 1</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setOffer('type', 'PERCENTAGE')}
                                                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                            formData.offer?.type === 'PERCENTAGE'
                                                                ? 'border-emerald-500 bg-white shadow-sm ring-2 ring-emerald-500/20'
                                                                : 'border-gray-200 bg-white/70 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-bold text-gray-900">Percentage Discount</span>
                                                            <Percent className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <span className="text-[11px] text-gray-500">e.g. 20% OFF the product price</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setOffer('type', 'FLAT')}
                                                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                            formData.offer?.type === 'FLAT'
                                                                ? 'border-emerald-500 bg-white shadow-sm ring-2 ring-emerald-500/20'
                                                                : 'border-gray-200 bg-white/70 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-bold text-gray-900">Flat Discount (₹)</span>
                                                            <Tag className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <span className="text-[11px] text-gray-500">e.g. ₹100 Flat OFF each item</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Type-specific inputs */}
                                            {formData.offer?.type === 'BOGO' && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-emerald-100">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-700 block mb-1">Buy Quantity (Paid)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={formData.offer?.buyQuantity ?? 2}
                                                            onChange={e => setOffer('buyQuantity', Number(e.target.value))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                                                            placeholder="2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-700 block mb-1">Get Free Quantity (Free)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={formData.offer?.getFreeQuantity ?? 1}
                                                            onChange={e => setOffer('getFreeQuantity', Number(e.target.value))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                                                            placeholder="1"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {formData.offer?.type === 'PERCENTAGE' && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-emerald-100">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-700 block mb-1">Discount Percentage (%)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="100"
                                                            value={formData.offer?.discountPercentage ?? 20}
                                                            onChange={e => setOffer('discountPercentage', Number(e.target.value))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                                                            placeholder="20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-700 block mb-1">Minimum Quantity Required</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={formData.offer?.minQuantity ?? 1}
                                                            onChange={e => setOffer('minQuantity', Number(e.target.value))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                                                            placeholder="1"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {formData.offer?.type === 'FLAT' && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-emerald-100">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-700 block mb-1">Flat Discount Amount (₹)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={formData.offer?.flatDiscount ?? 100}
                                                            onChange={e => setOffer('flatDiscount', Number(e.target.value))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                                                            placeholder="100"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-700 block mb-1">Minimum Quantity Required</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={formData.offer?.minQuantity ?? 1}
                                                            onChange={e => setOffer('minQuantity', Number(e.target.value))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50"
                                                            placeholder="1"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Offer Badge Title & Description */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-700 block mb-1">Offer Badge Title</label>
                                                    <input
                                                        type="text"
                                                        value={formData.offer?.title || ''}
                                                        onChange={e => setOffer('title', e.target.value)}
                                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                                                        placeholder="e.g. Buy 2 Get 1 Free"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-700 block mb-1">Customer Explanation</label>
                                                    <input
                                                        type="text"
                                                        value={formData.offer?.description || ''}
                                                        onChange={e => setOffer('description', e.target.value)}
                                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                                                        placeholder="e.g. Automatically applied at checkout"
                                                    />
                                                </div>
                                            </div>

                                            {/* Live Design 2 Badge Preview */}
                                            <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-center justify-between gap-3">
                                                <div>
                                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Live Badge Preview:</span>
                                                    <div className="mt-1 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs shrink-0">
                                                        <Tag className="w-4 h-4 text-emerald-700 shrink-0" />
                                                        <span>{formData.offer?.title || 'Buy 2 Get 1 Free'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right text-xs text-emerald-800 font-medium">
                                                    {formData.offer?.type === 'BOGO' && `Buy ${formData.offer.buyQuantity || 2}, Get ${formData.offer.getFreeQuantity || 1} Free`}
                                                    {formData.offer?.type === 'PERCENTAGE' && `${formData.offer.discountPercentage || 0}% deducted from cart amount`}
                                                    {formData.offer?.type === 'FLAT' && `₹${formData.offer.flatDiscount || 0} deducted per item`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ── Media ── */}
                                <SectionHeading title="Media" />
                                <ArrayField label="Image URLs (comma separated)" value={formData.images || []} onChange={v => set('images', v)} placeholder="https://..., https://..." colSpan />

                                {/* ── Classification ── */}
                                <SectionHeading title="Classification" />
                                <Field label="Quantity" value={formData.quantity || ''} onChange={v => set('quantity', v)} placeholder="e.g. 100ml" />
                                <Field label="Form" value={formData.form || ''} onChange={v => set('form', v)} placeholder="e.g. Cream, Tablet, Liquid" />
                                <Field label="Container Type" value={formData.containerType || ''} onChange={v => set('containerType', v)} placeholder="e.g. Tube, Bottle, Blister Pack" />
                                <Field label="Application Area" value={formData.applicationArea || ''} onChange={v => set('applicationArea', v)} placeholder="e.g. Face and Body" />
                                <Field label="Pack of" value={formData.packOf ?? ''} onChange={v => set('packOf', v === '' ? undefined : Number(v))} type="number" placeholder="e.g. 1" />
                                <Field label="Ideals For" value={formData.idealsFor || ''} onChange={v => set('idealsFor', v)} placeholder="e.g. All Skin Types" />
                                <Field label="License Number" value={formData.licenseNumber || ''} onChange={v => set('licenseNumber', v)} placeholder="e.g. FSSAI-12345" />
                                <ArrayField label="Items Included (comma separated)" value={formData.itemIncluded || []} onChange={v => set('itemIncluded', v)} placeholder="e.g. 1 Tube, 1 Dropper" />

                                {/* ── Product Details ── */}
                                <SectionHeading title="Product Details" />
                                <ArrayField label="Key Features (comma separated)" value={formData.keyFeatures || []} onChange={v => set('keyFeatures', v)} placeholder="e.g. SPF 50, Water resistant" colSpan />
                                <ArrayField label="Key Specs (comma separated)" value={formData.keySpecs || []} onChange={v => set('keySpecs', v)} placeholder="e.g. SPF 50, pH 5.5, PA++++" colSpan />
                                <ArrayField label="Composition (comma separated)" value={formData.composition || []} onChange={v => set('composition', v)} placeholder="e.g. Titanium Dioxide 5%, Zinc Oxide 5%" colSpan />
                                <ArrayField label="Ingredients (comma separated)" value={formData.ingredients || []} onChange={v => set('ingredients', v)} placeholder="e.g. Aqua, Glycerin, Titanium Dioxide" colSpan />
                                <ArrayField label="Benefits (comma separated)" value={formData.benefits || []} onChange={v => set('benefits', v)} placeholder="e.g. UV protection, Moisturization" colSpan />
                                <ArrayField label="Side Effects (comma separated)" value={formData.sideEffects || []} onChange={v => set('sideEffects', v)} placeholder="e.g. Mild irritation in rare cases" colSpan />
                                <TextAreaField label="Development Story" value={formData.developmentStory || ''} onChange={v => set('developmentStory', v)} rows={3} placeholder="Research background and story..." />

                                {/* ── Shelf Life ── */}
                                <SectionHeading title="Shelf Life" />
                                <Field label="Maximum Shelf Life" value={formData.maximumShelfLife || ''} onChange={v => set('maximumShelfLife', v)} placeholder="e.g. 24 months from manufacture date" colSpan />

                                {/* ── Package Details ── */}
                                <SectionHeading title="Package Details (for Shipping)" subtitle="Required for accurate courier shipping calculation" />
                                <Field label="Length (cm)" value={formData.packageDetail?.length} onChange={v => setPkg('length', v)} type="number" placeholder="e.g. 15" />
                                <Field label="Breadth (cm)" value={formData.packageDetail?.breadth} onChange={v => setPkg('breadth', v)} type="number" placeholder="e.g. 10" />
                                <Field label="Height (cm)" value={formData.packageDetail?.height} onChange={v => setPkg('height', v)} type="number" placeholder="e.g. 5" />
                                <Field label="Weight (grams)" value={formData.packageDetail?.weight} onChange={v => setPkg('weight', v)} type="number" placeholder="e.g. 250" />

                            </div>

                            {/* Actions */}
                            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 font-medium text-sm disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Product & Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCRUD;
