
import React, { useState, useEffect } from 'react';
import { ProductService } from '../../lib/api_controller';
import { Plus, Edit2, Trash2, X, Save, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Product, PackageDetail } from '../../pages/ProductDetailPage';

// Extended interface to include ID for management
interface AdminProduct extends Product {
    _id?: string;
    id?: string;
}

const emptyPackageDetail: PackageDetail = { length: undefined, breadth: undefined, height: undefined, weight: undefined };

const emptyProduct: AdminProduct = {
    name: '',
    description: '',
    detailedDescription: '',
    price: 0,
    mrp: 0,
    offerDescription: '',
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

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
    <div className="col-span-full mt-4 -mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/60 border-b border-gray-100 pb-1">{title}</p>
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
            required={required}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
        />
    </div>
);

const TextAreaField: React.FC<{
    label: string; value: string; onChange: (v: string) => void;
    rows?: number; required?: boolean; placeholder?: string;
}> = ({ label, value, onChange, rows = 3, required, placeholder }) => (
    <div className="space-y-1.5 col-span-full">
        <label className="text-sm font-medium text-gray-700">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <textarea
            required={required}
            rows={rows}
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
        />
    </div>
);

const ArrayField: React.FC<{
    label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; colSpan?: boolean;
}> = ({ label, value, onChange, placeholder, colSpan }) => (
    <div className={`space-y-1.5${colSpan ? ' col-span-full' : ''}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={e => onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder={placeholder || 'Comma separated values'}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
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
        setFormData({ ...emptyProduct, packageDetail: { ...emptyPackageDetail } });
        setIsModalOpen(true);
    };

    const handleEditClick = (product: AdminProduct) => {
        setCurrentProduct(product);
        setFormData({ ...emptyProduct, ...product });
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
            if (currentProduct) {
                const id = currentProduct.id || currentProduct._id;
                if (id) await ProductService.updateProduct(id, formData);
            } else {
                await ProductService.createProduct(formData);
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

    const setPkg = (field: keyof PackageDetail, value: string) =>
        setFormData(prev => ({
            ...prev,
            packageDetail: { ...(prev.packageDetail || {}), [field]: value === '' ? undefined : Number(value) },
        }));

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
                    <p className="text-gray-500 text-sm">Add, edit, and remove products from the store</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                                <th className="px-6 py-4 font-semibold">Offer</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
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
                                                <span className="font-bold">&#8377;{product.price}</span>
                                                <span className="text-xs line-through text-gray-400">&#8377;{product.mrp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-emerald-700">
                                            {product.offerDescription || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                    title="Edit"
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-in">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">
                                {currentProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* ── Core Info ── */}
                                <SectionHeading title="Core Info" />
                                <Field label="Product Name" value={formData.name} onChange={v => set('name', v)} required placeholder="e.g. Derma Shield Sunscreen" />
                                <Field label="Category" value={formData.category} onChange={v => set('category', v)} required placeholder="e.g. Skin Care" />
                                <TextAreaField label="Short Description" value={formData.description} onChange={v => set('description', v)} required rows={3} placeholder="Brief product summary..." />
                                <TextAreaField label="Detailed Description" value={formData.detailedDescription || ''} onChange={v => set('detailedDescription', v)} rows={4} placeholder="Extended product details..." />

                                {/* ── Pricing ── */}
                                <SectionHeading title="Pricing" />
                                <Field label="Selling Price (Rs.)" value={formData.price} onChange={v => set('price', Number(v))} type="number" required />
                                <Field label="MRP (Rs.)" value={formData.mrp} onChange={v => set('mrp', Number(v))} type="number" required />
                                <Field label="Offer Description" value={formData.offerDescription || ''} onChange={v => set('offerDescription', v)} placeholder="e.g. Buy 2 Get 1 Free" colSpan />

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
                                <ArrayField label="Side Effects (comma separated)" value={formData.sideEffects || []} onChange={v => set('sideEffects', v)} placeholder="e.g. May cause irritation in sensitive skin" colSpan />
                                <TextAreaField label="Development Story" value={formData.developmentStory || ''} onChange={v => set('developmentStory', v)} rows={3} placeholder="The story behind this product..." />

                                {/* ── Shelf Life ── */}
                                <SectionHeading title="Shelf Life" />
                                <Field label="Maximum Shelf Life" value={formData.maximumShelfLife || ''} onChange={v => set('maximumShelfLife', v)} placeholder="e.g. 24 months from manufacture date" colSpan />

                                {/* ── Package Dimensions ── */}
                                <SectionHeading title="Package Dimensions" />
                                <Field label="Length (cm)" value={formData.packageDetail?.length ?? ''} onChange={v => setPkg('length', v)} type="number" />
                                <Field label="Breadth (cm)" value={formData.packageDetail?.breadth ?? ''} onChange={v => setPkg('breadth', v)} type="number" />
                                <Field label="Height (cm)" value={formData.packageDetail?.height ?? ''} onChange={v => setPkg('height', v)} type="number" />
                                <Field label="Weight (g)" value={formData.packageDetail?.weight ?? ''} onChange={v => setPkg('weight', v)} type="number" />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-medium shadow-lg shadow-primary/25 transition-colors flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Saving...' : 'Save Product'}
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
