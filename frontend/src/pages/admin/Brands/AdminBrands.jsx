// Admin: Quản lý thương hiệu — thêm, sửa, xóa brands
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import { mediaUrl } from '../../../utils/mediaUrl';

const emptyForm = { name: '', slug: '', description: '' };
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim('-');

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBrands = () => {
    setLoading(true);
    adminAPI.getBrands()
      .then(r => setBrands(r.data.brands || r.data || []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBrands(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setLogo(null); setLogoPreview(null); setError(''); setShowForm(true); };
  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ name: b.name || '', slug: b.slug || '', description: b.description || '' });
    setLogo(null); setLogoPreview(b.logo ? mediaUrl(b.logo) : null); setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Vui lòng nhập tên thương hiệu'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logo) fd.append('logo', logo);
      if (editing) {
        await adminAPI.updateBrand(editing, fd);
      } else {
        await adminAPI.createBrand(fd);
      }
      setShowForm(false); fetchBrands();
    } catch (e) { setError(e.message || 'Lỗi lưu thương hiệu'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa thương hiệu "${name}"?`)) return;
    try { await adminAPI.deleteBrand(id); fetchBrands(); } catch (e) { alert(e.message); }
  };

  const upd = (f, v) => setForm(p => {
    const next = { ...p, [f]: v };
    if (f === 'name' && !editing) next.slug = slugify(v);
    return next;
  });

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý thương hiệu' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý thương hiệu</h1>
          <p className="text-xs text-gray-400 mt-1">{brands.length} thương hiệu</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1.5">
          <FiPlus size={13} /> Thêm thương hiệu
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({length:8}).map((_,i) => <div key={i} className="card h-28 animate-pulse bg-gray-50" />)
        ) : brands.map(b => (
          <div key={b.id} className="card group hover:border-primary hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              {b.logo ? (
                <img src={mediaUrl(b.logo)} alt={b.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-serif text-lg flex-shrink-0">
                  {b.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{b.name}</p>
                <p className="text-[10px] text-gray-400 font-mono truncate">{b.slug}</p>
              </div>
            </div>
            {b.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{b.description}</p>}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{b.product_count || 0} sản phẩm</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(b)} className="p-1 text-gray-400 hover:text-gray-700"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(b.id, b.name)} className="p-1 text-red-400 hover:text-red-600"><FiTrash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {!loading && !brands.length && (
          <div className="col-span-full py-12 text-center text-xs text-gray-400">Chưa có thương hiệu nào</div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">{editing ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><FiX size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>}

              {/* Logo upload */}
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex-shrink-0">
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files[0]; if(f){setLogo(f);setLogoPreview(URL.createObjectURL(f));} }} />
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="w-16 h-16 rounded-xl object-contain bg-gray-50 border border-gray-200 p-1 hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors">
                      <FiUpload size={16} className="text-gray-400" />
                      <span className="text-[9px] text-gray-400 mt-1">Logo</span>
                    </div>
                  )}
                </label>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Tên thương hiệu *</label>
                    <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="VD: Dior" className="input w-full" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">Slug</label>
                    <input value={form.slug} onChange={e => upd('slug', e.target.value)} placeholder="dior" className="input w-full font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Mô tả</label>
                <textarea value={form.description} onChange={e => upd('description', e.target.value)}
                  rows={3} placeholder="Mô tả ngắn về thương hiệu..." className="input w-full resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm thương hiệu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
