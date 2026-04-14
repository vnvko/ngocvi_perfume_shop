// Cập nhật thông tin cá nhân — tên, SĐT; gọi authAPI.updateProfile()
import { useState } from 'react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function PersonalInfo() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name: form.name, phone: form.phone });
      updateUser(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Lỗi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-light-secondary p-6">
      <h2 className="font-serif text-xl text-dark mb-1">Thông Tin Cá Nhân</h2>
      <p className="text-muted text-sm font-sans mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <hr className="border-light-secondary mb-6" />

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-sans">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-tag block mb-1.5">Họ và tên</label>
            <input value={form.name} onChange={e => update('name', e.target.value)}
              className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="label-tag block mb-1.5">Email</label>
            <input value={form.email} disabled
              className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans bg-light-secondary text-muted" />
          </div>
        </div>
        <div>
          <label className="label-tag block mb-1.5">Số điện thoại</label>
          <input value={form.phone} onChange={e => update('phone', e.target.value)}
            className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
        </div>

        <button type="submit" disabled={loading}
          className={`btn-primary transition-all disabled:opacity-60 ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}>
          {loading ? 'Đang lưu...' : saved ? '✓ Đã Lưu' : 'Cập Nhật Thông Tin'}
        </button>
      </form>
    </div>
  );
}
