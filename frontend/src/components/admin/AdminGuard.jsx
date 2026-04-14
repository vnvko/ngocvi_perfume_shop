// Bảo vệ route admin — chỉ cho phép role admin/staff, redirect nếu chưa login
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminGuard({ children }) {
  const auth = useAuth();
  const { user, loading } = auth || {};
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500 font-sans">Đang kiểm tra quyền...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (user.role_name !== 'admin' && user.role_name !== 'staff') {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-6xl mb-4">🔒</p>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Không có quyền truy cập</h1>
          <p className="text-sm text-gray-500 mb-6">Tài khoản của bạn không có quyền vào trang quản trị.</p>
          <a href="/" className="inline-block bg-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-amber-700 transition-colors">
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return children;
}
