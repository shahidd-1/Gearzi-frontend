import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Search, Loader2, X,
  AlertCircle, Check, Upload, ImageIcon, Star
} from 'lucide-react';
import {
  productService,
  categoryService,
  brandService,
  shopService,
  uploadService,
  getApiError
} from '../../api/services';
import client from '../../api/client';

// ─────────────────────────────────────────
// Product Image API helpers
// ─────────────────────────────────────────
const productImageApi = {
  getByProduct: async (productId) => {
    const res = await client.get(`/product-images/product/${productId}`);
    return res.data;
  },
  create: async (data) => {
    const res = await client.post('/product-images/', data);
    return res.data;
  },
  delete: async (imageId) => {
    const res = await client.delete(`/product-images/${imageId}`);
    return res.data;
  },
};

// ─────────────────────────────────────────
// Delete Confirmation Modal
// ─────────────────────────────────────────
const DeleteModal = ({ product, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#121212] border border-[#ffffff]/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 className="text-lg font-black text-white mb-2">Delete Product?</h3>
      <p className="text-[#ffffff]/60 text-sm mb-6">
        Are you sure you want to delete{' '}
        <span className="text-white font-bold">{product?.name}</span>? This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-[#ffffff]/10 text-white font-bold text-sm hover:bg-[#ffffff]/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────
// Image Upload Field
// ─────────────────────────────────────────
const ImageUploadField = ({ onUpload, isUploading, previewUrl }) => {
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
  };

  return (
    <div>
      <label className="block text-[10px] font-black text-[#ffffff]/40 uppercase tracking-wider mb-1.5">
        Product Image
      </label>

      {previewUrl ? (
        <div className="relative w-full h-40 bg-[#000000] border border-[#00DF81]/30 rounded-xl overflow-hidden flex items-center justify-center">
          <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-2" />
          <button
            type="button"
            onClick={() => onUpload(null)}
            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
          >
            <X size={14} />
          </button>
          <span className="absolute bottom-2 left-2 bg-[#00DF81]/10 text-[#00DF81] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#00DF81]/20">
            Uploaded ✓
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-full h-40 bg-[#000000] border-2 border-dashed border-[#ffffff]/10 hover:border-[#00DF81]/40 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-[#00DF81]" />
              <span className="text-xs text-[#ffffff]/40 font-medium">Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <Upload size={24} className="text-[#ffffff]/20 group-hover:text-[#00DF81] transition-colors" />
              <span className="text-xs text-[#ffffff]/40 group-hover:text-[#ffffff]/60 font-medium transition-colors">
                Click to upload image
              </span>
              <span className="text-[10px] text-[#ffffff]/20">JPG, PNG, WEBP, AVIF</span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

// ─────────────────────────────────────────
// Product Form Modal (Add / Edit)
// ─────────────────────────────────────────
const ProductModal = ({ product, categories, brands, shops, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    daily_rate: product?.daily_rate || '',
    deposit_amount: product?.deposit_amount || '',
    quantity: product?.quantity || 1,
    category_id: product?.category_id || (categories[0]?.id || ''),
    brand_id: product?.brand_id || (brands[0]?.id || ''),
    shop_id: product?.shop_id || (shops[0]?.id || ''),
    is_available: product?.is_available ?? true,
    is_active: product?.is_active ?? true,
  });

  const [imagePreview, setImagePreview] = useState(product?.images?.[0]?.image_url || null);
  const [uploadedImageData, setUploadedImageData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setImagePreview(null);
      setUploadedImageData(null);
      return;
    }
    setIsUploading(true);
    setImageError(null);
    try {
      // POST /upload/image → { url, public_id }
      const result = await uploadService.uploadImage(file);
      setUploadedImageData({ url: result.url, public_id: result.public_id });
      setImagePreview(result.url);
    } catch (err) {
      setImageError(getApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.daily_rate) return;
    onSave({
      formData: {
        ...form,
        daily_rate: parseFloat(form.daily_rate),
        deposit_amount: form.deposit_amount ? parseFloat(form.deposit_amount) : null,
        quantity: parseInt(form.quantity),
        category_id: parseInt(form.category_id),
        brand_id: parseInt(form.brand_id),
        shop_id: parseInt(form.shop_id),
      },
      uploadedImageData,
    });
  };

  const inputClass = 'w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium placeholder-[#ffffff]/20 focus:outline-none focus:border-[#00DF81]/50 transition-colors';
  const labelClass = 'block text-[10px] font-black text-[#ffffff]/40 uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-[#ffffff]/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white">{product ? 'Edit Product' : 'Add New Gear'}</h3>
          <button onClick={onClose} className="text-[#ffffff]/40 hover:text-white p-1.5 rounded-lg hover:bg-[#ffffff]/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUploadField
            onUpload={handleImageUpload}
            isUploading={isUploading}
            previewUrl={imagePreview}
          />
          {imageError && (
            <p className="text-red-400 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle size={13} /> {imageError}
            </p>
          )}

          <div>
            <label className={labelClass}>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sony FX3 Cinema Line" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description..." className={`${inputClass} resize-none h-20`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Daily Rate (₹) *</label>
              <input name="daily_rate" type="number" value={form.daily_rate} onChange={handleChange} placeholder="500" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Deposit (₹)</label>
              <input name="deposit_amount" type="number" value={form.deposit_amount} onChange={handleChange} placeholder="Optional" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <select name="brand_id" value={form.brand_id} onChange={handleChange} className={inputClass}>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Qty</label>
              <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Shop</label>
            <select name="shop_id" value={form.shop_id} onChange={handleChange} className={inputClass}>
              {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {product && (
            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} className="accent-[#00DF81]" />
                <span className="text-sm text-white font-medium">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="accent-[#00DF81]" />
                <span className="text-sm text-white font-medium">Active</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#ffffff]/10 text-white font-bold text-sm hover:bg-[#ffffff]/5 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || isUploading || !form.name || !form.daily_rate}
            className="flex-1 py-3 rounded-xl bg-[#00DF81] hover:bg-[#00DF81]/90 text-black font-black text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Main Inventory Page
// ─────────────────────────────────────────
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [shops, setShops] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Featured IDs stored in localStorage
  const [featuredIds, setFeaturedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('gearzi_featured_ids');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const saveFeaturedIds = (ids) => {
    setFeaturedIds(ids);
    localStorage.setItem('gearzi_featured_ids', JSON.stringify(ids));
  };

  const toggleFeatured = (productId) => {
    const updated = featuredIds.includes(productId)
      ? featuredIds.filter((id) => id !== productId)
      : [...featuredIds, productId];
    saveFeaturedIds(updated);
  };

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [p, c, b, s] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        brandService.getAll(),
        shopService.getAll(),
      ]);
      setProducts(p);
      setCategories(c);
      setBrands(b);
      setShops(s);

      // Fetch image for each product in parallel
      const imageMap = {};
      await Promise.allSettled(
        p.map(async (product) => {
          try {
            const images = await productImageApi.getByProduct(product.id);
            if (images?.length > 0) imageMap[product.id] = images[0].image_url;
          } catch { /* no image */ }
        })
      );
      setProductImages(imageMap);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSave = async ({ formData, uploadedImageData }) => {
    setIsSaving(true);
    try {
      let savedProduct;
      if (editProduct) {
        savedProduct = await productService.update(editProduct.id, formData);
        if (uploadedImageData) {
          // Replace old image
          const oldImages = await productImageApi.getByProduct(editProduct.id);
          if (oldImages?.length > 0) await productImageApi.delete(oldImages[0].id);
          await productImageApi.create({
            product_id: savedProduct.id,
            image_url: uploadedImageData.url,
            public_id: uploadedImageData.public_id,
            is_primary: true,
          });
        }
        showSuccess('Product updated successfully');
      } else {
        savedProduct = await productService.create(formData);
        if (uploadedImageData) {
          await productImageApi.create({
            product_id: savedProduct.id,
            image_url: uploadedImageData.url,
            public_id: uploadedImageData.public_id,
            is_primary: true,
          });
        }
        showSuccess('Product added successfully');
      }
      setShowAddModal(false);
      setEditProduct(null);
      fetchAll();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.delete(deleteProduct.id);
      showSuccess('Product deleted');
      setDeleteProduct(null);
      fetchAll();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || `Cat ${id}`;
  const getBrandName = (id) => brands.find((b) => b.id === id)?.name || `Brand ${id}`;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    getCategoryName(p.category_id).toLowerCase().includes(search.toLowerCase()) ||
    getBrandName(p.brand_id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#000000] text-white min-h-full p-6 lg:p-10">

      {(showAddModal || editProduct) && (
        <ProductModal
          product={editProduct}
          categories={categories}
          brands={brands}
          shops={shops}
          onSave={handleSave}
          onClose={() => { setShowAddModal(false); setEditProduct(null); }}
          isSaving={isSaving}
        />
      )}
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onConfirm={handleDelete}
          onCancel={() => setDeleteProduct(null)}
          isDeleting={isDeleting}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Inventory</h1>
          <p className="text-[#ffffff]/40 font-medium mt-1">Manage your camera and lens stock efficiently.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#00DF81] hover:bg-[#00DF81]/90 text-black font-black text-sm px-5 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(0,223,129,0.2)]"
        >
          <Plus size={16} /> Add New Gear
        </button>
      </div>

      <div className="flex items-start gap-2 bg-[#ffffff]/3 border border-[#ffffff]/8 rounded-xl p-3 mb-6">
        <Star size={14} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-[#ffffff]/50 text-xs font-medium leading-relaxed">
          Click <span className="text-yellow-400 font-bold">Feature</span> on any product to pin it on the Home page featured section. Saved on this device.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-[#00DF81]/10 border border-[#00DF81]/20 rounded-xl p-3 mb-6 text-[#00DF81] text-sm font-bold">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-red-400 text-sm font-medium">
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      <div className="bg-[#121212] border border-[#ffffff]/10 rounded-2xl p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffffff]/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or brand..."
            className="w-full bg-[#000000] border border-[#ffffff]/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#ffffff]/20 focus:outline-none focus:border-[#00DF81]/50 transition-colors max-w-sm"
          />
        </div>
      </div>

      <div className="bg-[#121212] border border-[#ffffff]/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#00DF81]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#ffffff]/40 text-sm">
              {search ? 'No products match your search.' : 'No products yet. Add your first gear!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#ffffff]/5">
                  {['Image', 'Gear Item', 'Category', 'Daily Rate', 'Stock', 'Status', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-4 text-[10px] font-black text-[#ffffff]/30 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const isFeatured = featuredIds.includes(product.id);
                  const imageUrl = productImages[product.id];
                  return (
                    <tr key={product.id} className="border-b border-[#ffffff]/5 hover:bg-[#ffffff]/2 transition-colors">
                      <td className="px-4 py-4">
                        <div className="w-12 h-12 bg-[#000000] border border-[#ffffff]/5 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                          {imageUrl
                            ? <img src={imageUrl} alt={product.name} className="w-full h-full object-contain p-1" />
                            : <ImageIcon size={18} className="text-[#ffffff]/15" />
                          }
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-sm text-white">{product.name}</p>
                        <p className="text-[11px] font-bold text-[#00DF81] uppercase tracking-wider mt-0.5">{getBrandName(product.brand_id)}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-[#ffffff]/60 font-medium">{getCategoryName(product.category_id)}</td>
                      <td className="px-4 py-4 text-sm font-black text-white">₹{product.daily_rate}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${product.quantity > 0 ? 'bg-[#00DF81]/10 text-[#00DF81] border-[#00DF81]/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {product.quantity} in stock
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${product.is_available ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-[#ffffff]/5 text-[#ffffff]/30 border-[#ffffff]/10'}`}>
                          {product.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleFeatured(product.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${isFeatured ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-[#ffffff]/5 text-[#ffffff]/30 border-[#ffffff]/10 hover:text-yellow-400 hover:border-yellow-500/20'}`}
                        >
                          <Star size={12} className={isFeatured ? 'fill-yellow-400' : ''} />
                          {isFeatured ? 'Featured' : 'Feature'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditProduct(product)} className="p-2 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 border border-[#ffffff]/10 rounded-lg text-white transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteProduct(product)} className="p-2 bg-[#ffffff]/5 hover:bg-red-500/10 border border-[#ffffff]/10 hover:border-red-500/20 rounded-lg text-[#ffffff]/60 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;