// Admin: Thống kê tổng quan — KPI, biểu đồ doanh thu, Doughnut trạng thái đơn, top sản phẩm
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FiDownload, FiCalendar } from 'react-icons/fi';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n||0)+'đ';
const fmtM   = (n) => n >= 1e9 ? (n/1e9).toFixed(1)+'T' : n >= 1e6 ? (n/1e6).toFixed(0)+'M' : n >= 1e3 ? (n/1e3).toFixed(0)+'K' : n;

const STATUS_COLORS = {
  completed: '#22c55e', shipping: '#3b82f6', confirmed: '#f59e0b',
  pending: '#f97316', cancelled: '#ef4444',
};
const STATUS_LABELS = {
  completed: 'Hoàn thành', shipping: 'Đang giao', confirmed: 'Đã xác nhận',
  pending: 'Chờ xử lý', cancelled: 'Đã hủy',
};

const PERIODS = [
  { id: 'today', label: 'Hôm nay', days: 1 },
  { id: '7d',    label: '7 ngày qua', days: 7 },
  { id: '30d',   label: 'Tháng này', days: 30 },
  { id: '365d',  label: 'Năm nay',   days: 365 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value > 1000 ? fmtPrice(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const CustomLabel = ({ cx, cy, value }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" fill="#1f2937" className="text-lg font-bold" style={{fontSize:28, fontWeight:700}}>{value}</text>
    <text x={cx} y={cy + 16} textAnchor="middle" fill="#9ca3af" style={{fontSize:11}}>Orders</text>
  </>
);

export default function AdminStats() {
  const [period, setPeriod]           = useState('30d');
  const [stats, setStats]             = useState(null);
  const [revenue, setRevenue]         = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStats, setOrderStats]   = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const days = PERIODS.find(p => p.id === period)?.days || 30;
    setLoading(true);
    Promise.all([
      adminAPI.getDashboard(),
      adminAPI.getRevenue(days),
      adminAPI.getTopProducts(5),
      adminAPI.getOrderStats(days),
    ])
      .then(([dashRes, revRes, topRes, statusRes]) => {
        const s = dashRes.data.stats;
        setStats(s);
        setRevenue(revRes.data.revenue || []);
        setTopProducts(topRes.data.top_products || []);

        const statuses = statusRes.data.stats || [];
        const total = statuses.reduce((sum, item) => sum + (item.count || 0), 0) || 1;
        setOrderStats(statuses.map((item) => ({
          name: STATUS_LABELS[item.status] || item.status || 'Unknown',
          value: Math.round(((item.count || 0) / total) * 100),
          count: item.count || 0,
          color: STATUS_COLORS[item.status] || '#6b7280',
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const totalOrders = orderStats.reduce((s, i) => s + i.value, 0);

  const exportCSV = () => {
    if (!stats) return;
    const periodLabel = PERIODS.find(p => p.id === period)?.label || 'Tùy chọn';
    const now = new Date().toLocaleString('vi-VN');
    const rows = [];
    rows.push(['NGOCVI Perfume - Báo cáo Thống kê']);
    rows.push(['Ngày xuất', now]);
    rows.push(['Khoảng thời gian', periodLabel]);
    rows.push([]);
    rows.push(['KPI', 'Giá trị']);
    rows.push(['Tổng doanh thu', stats.total_revenue || 0]);
    rows.push(['Tổng đơn hàng', stats.total_orders || 0]);
    rows.push(['Đơn hàng hôm nay', stats.orders_today || 0]);
    rows.push(['Khách hàng mới hôm nay', stats.new_users_today || 0]);
    rows.push([]);
    rows.push(['Trạng thái đơn', 'Tỉ lệ %']);
    orderStats.forEach((s) => rows.push([s.name, s.value]));
    rows.push([]);
    rows.push(['Doanh thu theo ngày', 'Doanh thu', 'Số đơn']);
    revenue.forEach((r) => rows.push([r.date, r.revenue || 0, r.orders || 0]));
    rows.push([]);
    rows.push(['Top sản phẩm', 'Số lượng bán', 'Doanh thu']);
    topProducts.forEach((p) => rows.push([p.name || '-', p.total_sold || 0, p.total_revenue || 0]));

    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admin_stats_report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const kpiCards = stats ? [
    { label: 'Tổng doanh thu',     value: fmtPrice(stats.total_revenue),  change: '+15% vs last month', up: true,  color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Tổng đơn hàng',      value: stats.total_orders?.toLocaleString(), change: 'Orders this month', up: null, color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Khách hàng mới',      value: stats.new_users_today,          change: 'Users registered',    up: null, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Sản phẩm đã bán',     value: '780',                          change: 'Items shipped',       up: null, color: 'text-amber-600',  bg: 'bg-amber-50' },
  ] : [];

  return (
    <AdminLayout breadcrumb={{ current: 'Thống kê & Báo cáo' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Thống kê &amp; Báo cáo</h1>
          <p className="text-xs text-gray-400 mt-1">Tổng quan hiệu suất kinh doanh NGOCVI Perfume Boutique.</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${period===p.id ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
              {p.label}
            </button>
          ))}
          <button onClick={exportCSV} className="btn-outline flex items-center gap-1.5 text-xs">
            <FiDownload size={12} /> Xuất báo cáo (CSV)
          </button>
        </div>
      </div>

      {/* KPI */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="card h-24 animate-pulse bg-gray-50" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {kpiCards.map(k => (
            <div key={k.label} className="card">
              <p className="text-xs text-gray-400 mb-2">{k.label}</p>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${k.up === true ? 'text-green-600' : 'text-gray-400'}`}>
                {k.up === true && '↑ '}{k.change}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Revenue chart + Order status pie */}
      <div className="grid xl:grid-cols-3 gap-5 mb-5">
        {/* Revenue area chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Biểu đồ doanh thu</h3>
              <p className="text-xs text-gray-400 mt-0.5">Chi tiết doanh thu theo ngày</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 text-lg leading-none">···</button>
          </div>
          {loading ? <div className="h-52 bg-gray-50 animate-pulse rounded" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenue} margin={{top:0,right:0,left:-15,bottom:0}}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false}/>
                <XAxis dataKey="date" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}
                  tickFormatter={v => new Date(v).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})}/>
                <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={fmtM}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#C9A96E" strokeWidth={2}
                  fill="url(#rg)" dot={false} activeDot={{r:4}}/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status doughnut */}
        <div className="card flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-1">Trạng thái đơn hàng</h3>
          {loading ? <div className="flex-1 bg-gray-50 animate-pulse rounded" /> : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={orderStats} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={85}
                    paddingAngle={2} dataKey="value"
                    labelLine={false}
                  >
                    {orderStats.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0}/>
                    ))}
                  </Pie>
                  <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle"
                    className="text-2xl font-bold" style={{fontSize:28,fontWeight:700,fill:'#1f2937'}}>
                    {totalOrders}
                  </text>
                  <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle"
                    style={{fontSize:11,fill:'#9ca3af'}}>
                    Orders
                  </text>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-auto">
                {orderStats.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:s.color}} />
                      <span className="text-gray-600">{s.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">({s.value}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top products + Loyal customers */}
      <div className="grid xl:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Sản phẩm bán chạy</h3>
            <Link to="/admin/products" className="text-xs text-primary hover:underline">Xem tất cả</Link>
          </div>
          {loading ? <div className="h-40 bg-gray-50 animate-pulse rounded" /> : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{p.brand_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-700">{p.total_sold || 0}</p>
                    <p className="text-[10px] text-gray-400">đã bán</p>
                  </div>
                </div>
              ))}
              {!topProducts.length && <p className="text-xs text-gray-400 text-center py-4">Chưa có dữ liệu</p>}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Khách hàng thân thiết</h3>
            <Link to="/admin/users" className="text-xs text-primary hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Võ Ngọc Vĩ',    spent: '15.000.000đ', orders: 5,  badge: 'VIP' },
              { name: 'Lê Hoàng Nam',   spent: '12.500.000đ', orders: 3,  badge: 'VIP' },
              { name: 'Phạm Thị Mai',   spent: '9.800.000đ',  orders: 4,  badge: '' },
              { name: 'Trần Minh Tuấn', spent: '6.500.000đ',  orders: 2,  badge: '' },
              { name: 'Hoàng Thúy Linh','spent': '5.200.000đ', orders: 3, badge: '' },
            ].map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                    {c.badge && <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-full">{c.badge}</span>}
                  </div>
                  <p className="text-[11px] text-gray-400">{c.orders} đơn hàng</p>
                </div>
                <p className="text-xs font-semibold text-gray-700 flex-shrink-0">{c.spent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
