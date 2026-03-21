// Admin: Quản lý người dùng — danh sách, filter role/status, khóa/mở tài khoản
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const roleBadge = { customer: 'badge-gray', staff: 'badge-blue', admin: 'badge-yellow' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = () => {
    setLoading(true);
    adminAPI.getUsers({ search, role: roleFilter, page, limit })
      .then(res => { setUsers(res.data || []); setTotal(res.pagination?.total || 0); })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, page]);

  const toggleStatus = async (id, current) => {
    try {
      await adminAPI.updateUserStatus(id, current === 'active' ? 'banned' : 'active');
      fetchUsers();
    } catch {}
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý người dùng' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý người dùng</h1>
          <p className="text-xs text-gray-400 mt-1">Total: <strong>{total}</strong> tài khoản</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên, email, SĐT..." className="input w-full pl-8" />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="input">
            <option value="">Tất cả vai trò</option>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID', 'Người dùng', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Ngày tạo', ''].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="py-3"><div className="h-10 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : users.map(u => (
              <tr key={u.id} className="table-row">
                <td className="py-3 pr-4 text-xs text-gray-500">#{u.id}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-800">{u.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-500">{u.email}</td>
                <td className="py-3 pr-4 text-xs text-gray-500">{u.phone}</td>
                <td className="py-3 pr-4"><span className={roleBadge[u.role_name] || 'badge-gray'}>{u.role_name}</span></td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(u.id, u.status)} className={`toggle ${u.status === 'active' ? 'bg-primary' : 'bg-gray-200'}`}>
                      <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${u.status === 'active' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                    <span className={`text-[11px] font-medium ${u.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                      {u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="py-3"><Link to={`/admin/users/${u.id}`} className="text-blue-500 hover:text-blue-700"><FiEye size={14} /></Link></td>
              </tr>
            ))}
            {!loading && !users.length && (
              <tr><td colSpan={8} className="py-10 text-center text-xs text-gray-400">Không có người dùng</td></tr>
            )}
          </tbody>
        </table>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{users.length} / {total} kết quả</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">‹</button>
            {Array.from({ length: Math.min(totalPages,5) }, (_,i) => (
              <button key={i+1} onClick={() => setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-primary text-white':'hover:bg-gray-100 text-gray-600'}`}>{i+1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
