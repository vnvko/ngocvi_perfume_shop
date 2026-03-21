// Admin: Thêm / Sửa danh mục — form với SEO preview theo thiết kế
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const slugify = (str) =>
  str.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');

export default function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', slug: '', description: '', status: true, featured: false });
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminAPI.getCategories().then(r => {
      const cat = (r.data.categories || []).find(c => String(c.id) === String(id));
      if (cat) setForm({ name: cat.name || '', slug: cat.slug || '', description: '', status: true, featured: false });
    }).catch(() => {});
  }, [id, isEdit]);

  const update = (f, v) => {
    setForm(prev => {
      const next = { ...prev, [f]: v };
      if (f === 'name' && !isEdit) next.slug = slugify(v);
      return next;
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Vui lòng nhập tên danh mục'); return; }
    setSaving(true); setError('');
    try {
      if (isEdit) {
        await adminAPI.updateCategory(id, { name: form.name, slug: form.slug });
      } else {
        await adminAPI.createCategory({ name: form.name, slug: form.slug });
      }
      navigate('/admin/categories');
    } catch (err) {
      setError(err.message || 'Lỗi lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout breadcrumb={{ parent: 'Quản lý danh mục', parentLink: '/admin/categories', current: isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h1>
          <p className="text-xs text-gray-400 mt-1">Quản lý và tổ chức các dòng sản phẩm nước hoa cao cấp</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/categories')} className="btn-outline">Hủy bỏ</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Đang lưu...' : 'Lưu danh mục'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">{error}</div>}

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">ℹ</span>
              <h3 className="font-semibold text-gray-800">Thông tin cơ bản</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Tên danh mục</label>
                <input value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="VD: Nước hoa Nam cao cấp" className="input w-full" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Slug (Đường dẫn tĩnh)</label>
                <div className="relative">
                  <input value={form.slug} onChange={e => update('slug', e.target.value)}
                    placeholder="nước-hoa-nam-cao-cap" className="input w-full pr-10" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔒</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Được tạo tự động dựa trên tên danh mục</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Mô tả danh mục</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)}
                  rows={4} placeholder="Mô tả ngắn gọn về danh mục này..."
                  className="input w-full resize-none" />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500">🖼</span>
              <h3 className="font-semibold text-gray-800">Hình ảnh &amp; Banner</h3>
            </div>
            <label className="cursor-pointer block">
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              {imagePreview ? (
                <div className="relative group rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                  <FiUpload size={28} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">Nhấp để tải lên hoặc kéo thả</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 2MB (Kích thước khuyến dùng: 1200×400px)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Config */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500">⚙</span>
              <h3 className="font-semibold text-gray-800">Cấu hình</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Danh mục cha</label>
                <select className="input w-full">
                  <option>Không có (Danh mục gốc)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Trạng thái hiển thị</p>
                  <p className="text-xs text-gray-400">Hiển thị trên website</p>
                </div>
                <button type="button" onClick={() => update('status', !form.status)}
                  className={`toggle ${form.status ? 'bg-primary' : 'bg-gray-200'}`}>
                  <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${form.status ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nổi bật</p>
                  <p className="text-xs text-gray-400">Đưa lên đầu trang chủ</p>
                </div>
                <button type="button" onClick={() => update('featured', !form.featured)}
                  className={`toggle ${form.featured ? 'bg-primary' : 'bg-gray-200'}`}>
                  <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${form.featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* SEO Preview */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500">🔍</span>
              <h3 className="font-semibold text-gray-800">Xem trước SEO</h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-3">
              <p className="text-sm text-blue-600 font-medium truncate">
                {form.name || 'Tên danh mục'} — NGOCVI
              </p>
              <p className="text-[11px] text-green-700 mt-0.5">
                ngocvi.vn › danh-muc › {form.slug || 'duong-dan'}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {form.description || `Khám phá bộ sưu tập ${form.name || 'danh mục'} cao cấp nhất tại NGOCVI. Những hương thơm...`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
