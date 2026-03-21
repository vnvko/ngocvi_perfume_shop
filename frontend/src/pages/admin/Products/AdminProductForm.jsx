// Admin: Thêm / Sửa sản phẩm — form đầy đủ theo thiết kế
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI, productAPI } from '../../../services/api';

const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');

const GENDERS   = [{ value: 'male', label: 'Nam' }, { value: 'female', label: 'Nữ' }, { value: 'unisex', label: 'Unisex' }];
const CONCS     = ['EDT', 'EDP', 'Parfum', 'EDP Intense', 'EDC', 'Elixir'];
const SCENT_TAGS = ['Floral', 'Woody', 'Oriental', 'Citrus', 'Aquatic', 'Spicy', 'Gourmand', 'Musky', 'Fresh', 'Oud'];

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', sku: '', brand_id: '', category_id: '',
    gender: 'male', concentration: 'EDP',
    description: '', status: 'active',
    price: '', sale_price: '',
    meta_title: '', meta_desc: '',
  });
  const [selectedTags, setSelectedTags]   = useState([]);
  const [variants, setVariants]           = useState([{ volume_ml: 100, price: '', stock: 0 }]);
  const [mainImage, setMainImage]         = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews]   = useState([]);

  // Load brands & categories
  useEffect(() => {
    productAPI.getBrands().then(r => setBrands(r.data.brands || [])).catch(() => {});
    productAPI.getCategories().then(r => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  // Load product nếu là edit
  useEffect(() => {
    if (!isEdit) return;
    adminAPI.getProduct(id).then(r => {
      const p = r.data.product;
      setForm({
        name: p.name || '', sku: p.sku || '',
        brand_id: p.brand_id || '', category_id: p.category_id || '',
        gender: p.gender || 'male', concentration: p.concentration || 'EDP',
        description: p.description || '', status: p.status || 'active',
        price: p.price || '', sale_price: p.sale_price || '',
        meta_title: '', meta_desc: '',
      });
      if (p.variants?.length) setVariants(p.variants.map(v => ({ id: v.id, volume_ml: v.volume_ml, price: v.price, stock: v.stock })));
      if (p.images?.length) setMainImagePreview(p.images.find(i => i.is_main)?.image_url || p.images[0]?.image_url);
    }).catch(() => {});
  }, [id, isEdit]);

  const update = (f, v) => {
    setForm(prev => {
      const next = { ...prev, [f]: v };
      if (f === 'name' && !isEdit) next.sku = 'NGV-' + slugify(v).toUpperCase().slice(0, 8).replace(/-/g, '');
      return next;
    });
  };

  const toggleTag = (tag) => setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);

  const addVariant = () => setVariants(v => [...v, { volume_ml: '', price: '', stock: 0 }]);
  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i));
  const updateVariant = (i, f, val) => setVariants(v => v.map((x, idx) => idx === i ? { ...x, [f]: val } : x));

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Vui lòng nhập tên sản phẩm'); return; }
    if (!form.price || isNaN(form.price)) { setError('Vui lòng nhập giá hợp lệ'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        variants: JSON.stringify(variants),
        tags: JSON.stringify(selectedTags),
      };
      if (mainImage) payload.images = [mainImage];

      if (isEdit) {
        await adminAPI.updateProduct(id, payload);
      } else {
        await adminAPI.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Lỗi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout breadcrumb={{ parent: 'Quản lý sản phẩm', parentLink: '/admin/products', current: isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/products')} className="btn-outline flex items-center gap-1.5">
            <FiX size={14} /> Hủy
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary flex items-center gap-1.5 disabled:opacity-60">
            <FiSave size={14} /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>}

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left — Main info */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="VD: Chanel No. 5 Eau de Parfum"
                  className="input w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Mã SKU</label>
                  <input value={form.sku} onChange={e => update('sku', e.target.value)}
                    placeholder="VD: NGV-CHAN-001" className="input w-full" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Thương hiệu</label>
                  <select value={form.brand_id} onChange={e => update('brand_id', e.target.value)} className="input w-full">
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Danh mục</label>
                  <select value={form.category_id} onChange={e => update('category_id', e.target.value)} className="input w-full">
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Giới tính</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input w-full">
                    {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Nồng độ (Concentration)</label>
                <select value={form.concentration} onChange={e => update('concentration', e.target.value)} className="input w-full">
                  {CONCS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Scent tags */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Nhóm hương</label>
                <div className="flex flex-wrap gap-2">
                  {SCENT_TAGS.map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                      }`}>
                      {selectedTags.includes(tag) && '× '}{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Mô tả chi tiết</h3>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              rows={8} placeholder="Nhập mô tả sản phẩm chi tiết tại đây..."
              className="input w-full resize-none leading-relaxed" />
          </div>

          {/* Pricing & Variants */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Giá &amp; Kho hàng</h3>
            {/* Base price */}
            <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Giá gốc (VND) <span className="text-red-500">*</span></label>
                <input type="number" value={form.price} onChange={e => update('price', e.target.value)}
                  placeholder="2950000" className="input w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Giá khuyến mãi</label>
                <input type="number" value={form.sale_price} onChange={e => update('sale_price', e.target.value)}
                  placeholder="Để trống nếu không KM" className="input w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Số lượng kho (mặc định)</label>
                <input type="number" defaultValue={0} placeholder="0" className="input w-full" />
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-700">Biến thể dung tích</h4>
                <button onClick={addVariant} type="button" className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <FiPlus size={12} /> Thêm dung tích
                </button>
              </div>
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 items-center">
                    <div className="relative">
                      <input type="number" value={v.volume_ml} onChange={e => updateVariant(i, 'volume_ml', e.target.value)}
                        placeholder="100" className="input w-full pr-8" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">ml</span>
                    </div>
                    <input type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)}
                      placeholder="Giá (VND)" className="input w-full" />
                    <input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                      placeholder="Tồn kho" className="input w-full" />
                    <button onClick={() => removeVariant(i)} disabled={variants.length === 1}
                      className="flex items-center justify-center text-red-400 hover:text-red-600 disabled:opacity-30 h-9">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-400 px-0.5">
                  <span>Dung tích</span><span>Giá theo dung tích</span><span>Tồn kho</span><span></span>
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Meta Title</label>
                <input value={form.meta_title} onChange={e => update('meta_title', e.target.value)}
                  placeholder="Tiêu đề hiển thị trên Google" className="input w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Meta Description</label>
                <textarea value={form.meta_desc} onChange={e => update('meta_desc', e.target.value)}
                  rows={3} placeholder="Mô tả ngắn gọn về sản phẩm..." className="input w-full resize-none" />
              </div>
              {/* SEO Preview */}
              {form.name && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-1">Xem trước SEO</p>
                  <p className="text-sm text-blue-600 font-medium truncate">{form.meta_title || form.name} — NGOCVI</p>
                  <p className="text-[11px] text-green-700">ngocvi.vn › san-pham › {slugify(form.name) || 'ten-san-pham'}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{form.meta_desc || form.description || 'Mô tả sản phẩm...'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Status + Images */}
        <div className="space-y-5">
          {/* Status */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Trạng thái hiển thị</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {form.status === 'active' ? 'Công khai' : 'Ẩn'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {form.status === 'active' ? 'Sản phẩm hiển thị trên cửa hàng' : 'Sản phẩm đã bị ẩn'}
                </p>
              </div>
              <button type="button" onClick={() => update('status', form.status === 'active' ? 'inactive' : 'active')}
                className={`toggle ${form.status === 'active' ? 'bg-primary' : 'bg-gray-200'}`}>
                <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${form.status === 'active' ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh sản phẩm</h3>
            <p className="text-xs text-gray-500 mb-3">Ảnh đại diện</p>
            <label className="cursor-pointer block">
              <input type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
              {mainImagePreview ? (
                <div className="relative group">
                  <img src={mainImagePreview} alt="Main" className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                  <FiUpload size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium text-primary">Click to upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG (MAX. 800×800px)</p>
                </div>
              )}
            </label>

            <p className="text-xs text-gray-500 mt-4 mb-2">Thư viện ảnh</p>
            <div className="flex gap-2 flex-wrap">
              {galleryPreviews.map((src, i) => (
                <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
              ))}
              <label className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <FiPlus size={18} className="text-gray-400" />
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
                  }} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
