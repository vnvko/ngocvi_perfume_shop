// Admin: Dashboard — KPI, biểu đồ doanh thu Recharts, top sản phẩm, đơn gần đây
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiDollarSign, FiUsers, FiDownload } from 'react-icons/fi';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{fmtPrice(payload[0].value)}</p>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getRevenue(period),
      adminAPI.getTopProducts(5),
      adminAPI.getRecentOrders(10),
    ])
      .then(([dashRes, revRes, topRes, ordRes]) => {
        setStats(dashRes.data.stats);
        setRevenue(revRes.data.revenue || []);
        setTopProducts(topRes.data.top_products || []);
        setRecentOrders(ordRes.data.orders || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const statusBadge = (s) => {
    const m = { shipping: 'badge-blue', pending: 'badge-yellow', completed: 'badge-green', cancelled: 'badge-red' };
    const l = { shipping: 'Đang giao', pending: 'Chờ xử lý', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
    return [m[s] || 'badge-gray', l[s] || s];
  };

  const statCards = stats ? [
    { label: 'Tổng sản phẩm', value: stats.total_products?.toLocaleString(), sub: 'Available in stock', icon: FiPackage, color: 'bg-amber-50 text-amber-600' },
    { label: 'Đơn hàng hôm nay', value: stats.orders_today, sub: 'Đơn mới trong ngày', icon: FiShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Doanh thu hôm nay', value: fmtPrice(stats.revenue_today), sub: 'Gross volume', icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Người dùng mới', value: stats.new_users_today, sub: 'Registered today', icon: FiUsers, color: 'bg-purple-50 text-purple-600' },
  ] : [];

  return (
    <AdminLayout breadcrumb={{ current: 'Dashboard' }}>
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse"><div className="h-16 bg-gray-100 rounded" /></div>
        )) : statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-500">{s.label}</p>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}><Icon size={15} /></span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Top Selling */}
      <div className="grid xl:grid-cols-3 gap-4 mb-6">
        <div className="card xl:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Biểu đồ doanh thu</h3>
              <p className="text-xs text-gray-400 mt-0.5">Tổng quan doanh thu theo thời gian</p>
            </div>
            <div className="flex gap-1">
              {[7, 30].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${period === p ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {p} ngày
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => new Date(v).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => (v / 1000000).toFixed(0) + 'M'} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} fill="url(#revGrad)"
                dot={{ r: 3, fill: '#C9A96E', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Top Selling</h3>
            <Link to="/admin/products" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {topProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  {p.thumbnail ? <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.brand_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-700">{p.total_sold}</p>
                  <p className="text-[10px] text-gray-400">Sales</p>
                </div>
              </div>
            ))}
            {!topProducts.length && !loading && <p className="text-xs text-gray-400 text-center py-4">Chưa có dữ liệu</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
          <div className="flex gap-2">
            <Link to="/admin/orders" className="btn-outline text-xs">Xem tất cả</Link>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Order ID', 'Customer', 'Date', 'Status', 'Total'].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4 last:text-right">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o => {
              const [cls, label] = statusBadge(o.status);
              return (
                <tr key={o.id} className="table-row">
                  <td className="py-3 pr-4">
                    <Link to={`/admin/orders/${o.id}`} className="text-primary font-medium text-xs hover:underline">{o.order_code}</Link>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-700">{o.customer_name}</td>
                  <td className="py-3 pr-4 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="py-3 pr-4"><span className={cls}>{label}</span></td>
                  <td className="py-3 text-xs font-semibold text-gray-800 text-right">{fmtPrice(o.total_price)}</td>
                </tr>
              );
            })}
            {!recentOrders.length && !loading && (
              <tr><td colSpan={5} className="py-8 text-center text-xs text-gray-400">Chưa có đơn hàng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
