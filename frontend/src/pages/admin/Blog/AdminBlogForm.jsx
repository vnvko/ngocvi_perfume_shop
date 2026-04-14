// Admin: Thêm / Sửa bài viết blog — form đầy đủ kết nối API
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiArrowLeft } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import { mediaUrl } from '../../../utils/mediaUrl';

const slugify = (str) =>
  str.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,'a').replace(/[èéẹẻẽêềếệểễ]/g,'e')
    .replace(/[ìíịỉĩ]/g,'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,'o')
    .replace(/[ùúụủũưừứựửữ]/g,'u').replace(/[ỳýỵỷỹ]/g,'y').replace(/đ/g,'d')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');

const BLOG_CATEGORIES = [
  { id: 1, name: 'Kiến thức', slug: 'kien-thuc' },
  { id: 2, name: 'Review',    slug: 'review' },
  { id: 3, name: 'Xu hướng',  slug: 'xu-huong' },
  { id: 4, name: 'Thương hiệu', slug: 'thuong-hieu' },
  { id: 5, name: 'Tips & Tricks', slug: 'tips' },
];

const STATUS_OPTIONS = [
  { value: 'published', label: 'Hiển thị' },
  { value: 'draft',     label: 'Nháp' },
  { value: 'hidden',    label: 'Ẩn' },
];

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', slug: '', content: '',
    category_id: '1', status: 'published',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminAPI.getBlog(id)
      .then(res => {
        const b = res.data?.blog || res.data;
        if (b) {
          setForm({
            title:       b.title || '',
            slug:        b.slug  || '',
            content:     b.content || '',
            category_id: String(b.category_id || 1),
            status:      b.status || 'published',
          });
          if (b.thumbnail) setThumbnailPreview(mediaUrl(b.thumbnail));
        }
      })
      .catch(() => {});
  }, [id, isEdit]);

  const update = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !isEdit) next.slug = slugify(value);
      return next;
    });
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title.trim())   { setError('Vui lòng nhập tiêu đề bài viết'); return; }
    if (!form.content.trim()) { setError('Vui lòng nhập nội dung bài viết'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (thumbnail) payload.thumbnail = thumbnail;

      if (isEdit) {
        await adminAPI.updateBlog(id, payload);
      } else {
        await adminAPI.createBlog(payload);
      }
      navigate('/admin/blog');
    } catch (err) {
      setError(err.message || 'Lỗi lưu bài viết');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <AdminLayout breadcrumb={{
      parent: 'Quản lý blog', parentLink: '/admin/blog',
      current: isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isEdit ? `ID: #${id}` : 'Viết và xuất bản bài viết mới cho blog'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/blog" className="btn-outline flex items-center gap-1.5 text-sm">
            <FiArrowLeft size={14} /> Quay lại
          </Link>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-60">
            <FiSave size={14} />
            {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Xuất bản')}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
          {error}
        </div>
      )}

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="xl:col-span-2 space-y-5">
          {/* Title */}
          <div className="card">
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="VD: Cách chọn nước hoa theo mùa"
              className="input w-full text-base font-medium"
            />
          </div>

          {/* Slug */}
          <div className="card">
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              Slug (đường dẫn URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-sans whitespace-nowrap">/blog/</span>
              <input
                value={form.slug}
                onChange={e => update('slug', e.target.value)}
                placeholder="cach-chon-nuoc-hoa-theo-mua"
                className="input flex-1 font-mono text-xs"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Tự động tạo từ tiêu đề. Chỉ dùng chữ thường, số và dấu gạch ngang.</p>
          </div>

          {/* Content */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Nội dung bài viết <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">{wordCount} từ</span>
            </div>
            <textarea
              value={form.content}
              onChange={e => update('content', e.target.value)}
              rows={20}
              placeholder="Nhập nội dung bài viết tại đây...&#10;&#10;Bạn có thể dùng Markdown hoặc văn bản thường."
              className="input w-full resize-none font-sans leading-relaxed text-sm"
            />
          </div>
        </div>

        {/* Right: settings */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 text-sm mb-4">Cài đặt xuất bản</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={e => update('status', e.target.value)}
                  className="input w-full"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Danh mục</label>
                <select
                  value={form.category_id}
                  onChange={e => update('category_id', e.target.value)}
                  className="input w-full"
                >
                  {BLOG_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Ảnh đại diện</h3>
            <label className="cursor-pointer block">
              <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
              {thumbnailPreview ? (
                <div className="relative group">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded">
                      Đổi ảnh
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                  <FiUpload size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-500">Nhấp để tải ảnh lên</p>
                  <p className="text-[11px] text-gray-400 mt-1">PNG, JPG — tối đa 2MB</p>
                  <p className="text-[11px] text-gray-400">Kích thước đề xuất: 1200×630px</p>
                </div>
              )}
            </label>
            {thumbnailPreview && (
              <button
                onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                className="mt-2 text-[11px] text-red-500 hover:text-red-700 font-sans flex items-center gap-1"
              >
                <FiX size={12} /> Xóa ảnh
              </button>
            )}
          </div>

          {/* Preview card */}
          {form.title && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Xem trước</h3>
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                {thumbnailPreview && (
                  <img src={thumbnailPreview} alt="" className="w-full h-28 object-cover" />
                )}
                <div className="p-3">
                  <span className="text-[10px] font-medium text-primary">
                    {BLOG_CATEGORIES.find(c => String(c.id) === form.category_id)?.name}
                  </span>
                  <p className="text-xs font-medium text-gray-800 mt-1 line-clamp-2">{form.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {form.content.slice(0, 100)}{form.content.length > 100 ? '...' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
