// Admin: Quản lý banner — thêm, sửa, xóa banners
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import { mediaUrl } from '../../../utils/mediaUrl';

const emptyForm = { title: '', link: '', status: 1 };
const statusOptions = [
  { value: 1, label: 'Hoạt động', color: 'text-green-600' },
  { value: 0, label: 'Tạm dừng', color: 'text-red-600' }
];

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBanners = () => {
    setLoading(true);
    adminAPI.getBanners()
      .then(r => setBanners(r.data.banners || r.data || []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImage(null); setImagePreview(null); setError(''); setShowForm(true); };
  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ title: b.title || '', link: b.link || '', status: b.status });
    setImage(null); setImagePreview(b.image_url ? mediaUrl(b.image_url) : null); setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Vui lòng nhập tiêu đề banner'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (editing) {
        await adminAPI.updateBanner(editing, fd);
      } else {
        await adminAPI.createBanner(fd);
      }
      setShowForm(false); fetchBanners();
    } catch (e) {
      setError(e.message || 'Lỗi lưu banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
    try {
      await adminAPI.deleteBanner(id);
      fetchBanners();
    } catch (e) {
      alert(e.message || 'Lỗi xóa banner');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getStatusLabel = (status) => statusOptions.find(o => o.value === status)?.label || 'Không xác định';
  const getStatusColor = (status) => statusOptions.find(o => o.value === status)?.color || 'text-gray-600';

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-dark">Quản lý Banner</h1>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <FiPlus size={18} /> Thêm Banner
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hình ảnh</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tiêu đề</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Liên kết</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {banners.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {b.image_url && (
                          <img src={mediaUrl(b.image_url)} alt={b.title} className="w-16 h-10 object-cover rounded" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{b.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{b.link || 'Không có'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${getStatusColor(b.status)}`}>
                          {getStatusLabel(b.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(b)} className="text-blue-600 hover:text-blue-800">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {banners.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        Chưa có banner nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editing ? 'Sửa Banner' : 'Thêm Banner'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập tiêu đề banner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liên kết</label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={e => setForm({...form, link: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({...form, status: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded border" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}