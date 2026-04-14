// Trang đăng nhập / đăng ký — xác thực JWT với backend, redirect theo role
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const openRegister =
    location.pathname === '/register' || Boolean(location.state?.register);
  const [tab, setTab] = useState(openRegister ? 'register' : 'login');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from || '/';

  useEffect(() => {
    if (location.state?.register) setTab('register');
  }, [location.state?.register]);

  useEffect(() => {
    if (user) {
      navigate(user.role_name === 'admin' || user.role_name === 'staff' ? '/admin' : from, { replace: true });
    }
  }, [user, from, navigate]);

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login({ email: form.email, password: form.password }); }
    catch (err) { setError(err.message || "Email hoặc mật khẩu không đúng"); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(''); 
    if (form.password.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự"); return; }
    if (form.password !== form.confirm) { setError("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true);
    try { await register({ name: form.name, email: form.email, phone: form.phone, password: form.password }); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-light-secondary">
        <Link to="/" className="font-serif text-2xl tracking-[0.15em] text-dark">NGOCVI</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-dark mb-1">
              {tab === 'login' ? "Đăng nhập" : "Đăng ký tài khoản"}
            </h1>
            <p className="text-muted font-sans text-sm">
              {tab === 'login' ? "Chào mừng trở lại NGOCVI" : "Tạo tài khoản để trải nghiệm mua sắm tốt hơn"}
            </p>
          </div>
          <div className="flex mb-6 border-b border-light-secondary">
            {['login','register'].map(tp => (
              <button key={tp} onClick={() => { setTab(tp); setError(''); }}
                className={`flex-1 pb-3 text-xs tracking-widest uppercase font-sans font-medium border-b-2 transition-all -mb-px ${
                  tab === tp ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-dark'
                }`}>
                {tp === 'login' ? "Đăng Nhập" : "Tạo Tài Khoản"}
              </button>
            ))}
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-sans rounded">{error}</div>}
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {[
                { key:'email', label: "Email", ph: "email@example.com", type:'email' },
                { key:'password', label: "Mật khẩu", ph: "passwordPh", type:'password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs tracking-widest uppercase font-sans text-muted block mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => up(f.key, e.target.value)}
                    placeholder={f.ph} required
                    className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors bg-white" />
                </div>
              ))}
              <div className="flex justify-end">
                <a href="#" className="text-xs text-muted font-sans hover:text-primary">{"Quên mật khẩu?"}</a>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {[
                { key:'name', label: "Họ và Tên", ph: "Nguyễn Văn A", type:'text' },
                { key:'email', label: "Email", ph: "email@example.com", type:'email' },
                { key:'phone', label: "Số điện thoại", ph: "0901234567", type:'tel' },
                { key:'password', label: "Mật khẩu", ph: "passwordPh", type:'password' },
                { key:'confirm', label: "Xác nhận mật khẩu", ph: "Nhập lại mật khẩu", type:'password' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs tracking-widest uppercase font-sans text-muted block mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => up(f.key, e.target.value)}
                    placeholder={f.ph} required={f.key !== 'phone'}
                    className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors bg-white" />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Đang đăng ký..." : "Tạo Tài Khoản"}
              </button>
            </form>
          )}
          <p className="text-center text-xs font-sans text-muted mt-6">
            {tab === 'login' ? (
              <>{"Chưa có tài khoản?"} <button onClick={() => setTab('register')} className="text-primary hover:underline">{"Đăng ký ngay"}</button></>
            ) : (
              <>{"Đã có tài khoản?"} <button onClick={() => setTab('login')} className="text-primary hover:underline">{"Đăng nhập"}</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
