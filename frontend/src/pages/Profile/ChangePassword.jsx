// Đổi mật khẩu — xác thực mật khẩu cũ rồi đổi qua authAPI
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../../services/api';

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="label-tag block mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors pr-10" />
        <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (next !== confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (next.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    setLoading(true);
    try {
      await authAPI.changePassword({ current_password: current, new_password: next });
      setSaved(true);
      setCurrent(''); setNext(''); setConfirm('');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Lỗi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-light-secondary p-6">
      <h2 className="font-serif text-xl text-dark mb-1">Đổi Mật Khẩu</h2>
      <p className="text-muted text-sm font-sans mb-6">Quản lý mật khẩu để bảo mật tài khoản</p>
      <hr className="border-light-secondary mb-6" />
      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        <PasswordField label="Mật Khẩu Hiện Tại" value={current} onChange={setCurrent} placeholder="Nhập mật khẩu hiện tại" />
        <PasswordField label="Mật Khẩu Mới" value={next} onChange={setNext} placeholder="Nhập mật khẩu mới" />
        <PasswordField label="Xác Nhận Mật Khẩu Mới" value={confirm} onChange={setConfirm} placeholder="Nhập lại mật khẩu mới" />
        {error && <p className="text-red-500 text-sm font-sans">{error}</p>}
        {saved && <p className="text-green-600 text-sm font-sans">✓ Đổi mật khẩu thành công!</p>}
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
        </button>
      </form>
    </div>
  );
}
