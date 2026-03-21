// Admin: Quản lý đơn hàng — danh sách, filter trạng thái, phân trang
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiEye, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';
const statusMap = { shipping: ['badge-blue','Đang giao'], pending: ['badge-yellow','Chờ xử lý'], completed: ['badge-green','Hoàn thành'], cancelled: ['badge-red','Đã hủy'], confirmed: ['badge-blue','Đã xác nhận'] };


const exportCSV = (orders) => {
  const headers = ['Mã đơn','Khách hàng','SĐT','Tổng tiền','Thanh toán','Trạng thái','Ngày đặt'];
  const rows = orders.map(o => [
    o.order_code, o.customer_name, o.customer_phone,
    o.total_price, o.payment_method, o.status,
    new Date(o.created_at).toLocaleDateString('vi-VN'),
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    adminAPI.getOrders({ search, status: statusFilter, page, limit })
      .then(res => { setOrders(res.data || []); setTotal(res.pagination?.total || 0); })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý đơn hàng' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-xs text-gray-400 mt-1">Theo dõi và xử lý các đơn đặt hàng</p>
        </div>
        <button onClick={() => exportCSV(orders)} className="btn-primary flex items-center gap-1.5"><FiDownload size={13} /> Export CSV</button>
      </div>

      <div className="card mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm mã đơn / khách hàng / SĐT..." className="input w-full pl-8" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input">
            <option value="">Trạng thái: Tất cả</option>
            {Object.entries(statusMap).map(([k, [, label]]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Mã đơn', 'Khách hàng', 'SĐT', 'Tổng tiền', 'Trạng thái', 'Ngày đặt', ''].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="py-3"><div className="h-10 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : orders.map(o => {
              const [cls, label] = statusMap[o.status] || ['badge-gray', o.status];
              return (
                <tr key={o.id} className="table-row">
                  <td className="py-3 pr-4">
                    <Link to={`/admin/orders/${o.id}`} className="text-primary font-medium text-xs hover:underline">{o.order_code}</Link>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-700">{o.customer_name}</td>
                  <td className="py-3 pr-4 text-xs text-gray-500">{o.customer_phone}</td>
                  <td className="py-3 pr-4 text-xs font-semibold text-gray-800">{fmtPrice(o.total_price)}</td>
                  <td className="py-3 pr-4"><span className={cls}>{label}</span></td>
                  <td className="py-3 pr-4 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="py-3"><Link to={`/admin/orders/${o.id}`} className="text-blue-500 hover:text-blue-700"><FiEye size={14} /></Link></td>
                </tr>
              );
            })}
            {!loading && !orders.length && (
              <tr><td colSpan={7} className="py-10 text-center text-xs text-gray-400">Không có đơn hàng</td></tr>
            )}
          </tbody>
        </table>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Hiển thị <strong className="text-gray-700">{orders.length}</strong> / {total} đơn</span>
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
