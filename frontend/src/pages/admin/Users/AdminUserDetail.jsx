// Admin: Chi tiết người dùng — thông tin, đơn hàng gần đây, phân quyền role
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiLock, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';
const statusMap = { shipping: ['badge-blue','Đang giao'], pending: ['badge-yellow','Chờ xử lý'], completed: ['badge-green','Hoàn thành'], cancelled: ['badge-red','Đã hủy'] };

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total_orders: 0, total_spent: 0 });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    Promise.all([adminAPI.getUser(id), adminAPI.getRoles()])
      .then(([userRes, rolesRes]) => {
        setUser(userRes.data.user);
        setOrders(userRes.data.recent_orders || []);
        setStats(userRes.data.stats || {});
        setRoles(rolesRes.data.roles || []);
        setSelectedRole(String(userRes.data.user.role_id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (status) => {
    try { await adminAPI.updateUserStatus(id, status); setUser(u => ({ ...u, status })); } catch {}
  };

  const handleUpdateRole = async () => {
    try { await adminAPI.updateUserRole(id, selectedRole); setUser(u => ({ ...u, role_id: selectedRole })); } catch {}
  };

  if (loading) return (
    <AdminLayout breadcrumb={{ parent: 'Người dùng', parentLink: '/admin/users', current: 'Chi tiết' }}>
      <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded" />)}</div>
    </AdminLayout>
  );
  if (!user) return (
    <AdminLayout breadcrumb={{ parent: 'Người dùng', parentLink: '/admin/users', current: 'Không tìm thấy' }}>
      <div className="text-center py-20 text-gray-400">Không tìm thấy người dùng</div>
    </AdminLayout>
  );

  return (
    <AdminLayout breadcrumb={{ parent: 'Người dùng', parentLink: '/admin/users', current: user.name }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Chi tiết: <span className="text-primary">{user.name}</span>
        </h1>
        <div className="flex gap-2">
          {user.status === 'active' ? (
            <button onClick={() => handleUpdateStatus('banned')} className="btn-outline flex items-center gap-1.5 text-xs text-red-500 border-red-200 hover:bg-red-50">
              <FiLock size={13} /> Khóa tài khoản
            </button>
          ) : (
            <button onClick={() => handleUpdateStatus('active')} className="btn-primary text-xs">Mở khóa</button>
          )}
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <div className="space-y-5">
          {/* Profile */}
          <div className="card text-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-serif mx-auto mb-3">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <h2 className="font-semibold text-gray-800">{user.name}</h2>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full mt-1 inline-block ${user.status === 'active' ? 'badge-green' : 'badge-red'}`}>
              {user.status === 'active' ? 'Active' : 'Bị khóa'}
            </span>
            <div className="mt-4 space-y-2 text-left">
              {[[FiMail, 'Email', user.email], [FiPhone, 'SĐT', user.phone], [FiCalendar, 'Ngày tạo', new Date(user.created_at).toLocaleDateString('vi-VN')]].map(([Icon, label, val]) => val ? (
                <div key={label} className="flex items-start gap-2.5">
                  <Icon size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">{label}</p>
                    <p className="text-xs text-gray-700">{val}</p>
                  </div>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Role */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">🛡 Phân quyền</h3>
            <p className="text-xs text-gray-500 mb-2">Vai trò hiện tại</p>
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="input w-full mb-3">
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <button onClick={handleUpdateRole} className="btn-primary text-xs">Cập nhật quyền</button>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-700 leading-relaxed mt-3">
              ⚠️ Thay đổi quyền Admin cần thận trọng.
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card text-center">
              <p className="text-xs text-gray-400 mb-1">Tổng chi tiêu</p>
              <p className="text-lg font-bold text-primary">{fmtPrice(stats.total_spent)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-gray-400 mb-1">Tổng đơn hàng</p>
              <p className="text-lg font-bold text-gray-800">{stats.total_orders}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Lịch sử đơn hàng gần đây</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Chưa có đơn hàng</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Mã đơn', 'Ngày', 'Tổng', 'Trạng thái'].map(h => (
                    <th key={h} className="table-head text-left pb-2 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const [cls, label] = statusMap[o.status] || ['badge-gray', o.status];
                  return (
                    <tr key={o.id} className="table-row">
                      <td className="py-2.5 pr-3 text-xs text-primary font-medium">{o.order_code}</td>
                      <td className="py-2.5 pr-3 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="py-2.5 pr-3 text-xs font-semibold text-gray-700">{fmtPrice(o.total_price)}</td>
                      <td className="py-2.5"><span className={cls}>{label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
