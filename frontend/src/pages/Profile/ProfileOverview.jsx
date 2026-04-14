// Tổng quan tài khoản — thống kê đơn hàng, wishlist, liên kết nhanh
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiMapPin, FiHeart, FiChevronRight, FiPackage, FiTruck, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { orderAPI } from '../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

const statusInfo = {
  pending:   { label: 'Chờ xử lý', cls: 'bg-amber-100 text-amber-700', icon: FiPackage },
  confirmed: { label: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700', icon: FiCheck },
  shipping:  { label: "Giao Hàng Toàn Quốc", cls: 'bg-blue-100 text-blue-700', icon: FiTruck },
  completed: { label: "Hoàn thành", cls: 'bg-green-100 text-green-700', icon: FiCheck },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-600', icon: FiPackage },
};

export default function ProfileOverview() {
  const { user } = useAuth();
  const { wishlistCount } = useCart();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, shipping: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders({ limit: 5 })
      .then(res => {
        const orders = res.data?.orders || res.data || [];
        setRecentOrders(orders.slice(0, 3));
        setStats({
          total:     orders.length,
          completed: orders.filter(o => o.status === 'completed').length,
          pending:   orders.filter(o => o.status === 'pending').length,
          shipping:  orders.filter(o => o.status === 'shipping').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-dark">Xin chào, {user?.name || 'bạn'} 👋</h2>
        <p className="text-muted text-sm font-sans mt-1">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Tổng đơn hàng", value: stats.total, color: 'text-dark' },
          { label: "Hoàn thành", value: stats.completed, color: 'text-green-600' },
          { label: "Giao Hàng Toàn Quốc", value: stats.shipping, color: 'text-blue-600' },
          { label: "Yêu thích", value: wishlistCount, color: 'text-primary' },
        ].map(s => (
          <div key={s.label} className="bg-light-secondary/60 rounded p-4 text-center">
            <p className={`font-display text-3xl font-medium ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-dark">Đơn hàng gần đây</h3>
          <Link to="/profile/orders" className="text-xs text-primary font-sans hover:underline flex items-center gap-1">
            Xem tất cả <FiChevronRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="h-16 bg-light-secondary animate-pulse rounded" />)}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map(order => {
              const info = statusInfo[order.status] || statusInfo.pending;
              const Icon = info.icon;
              return (
                <Link key={order.id} to={`/profile/orders/${order.id}`}
                  className="flex items-center justify-between p-4 border border-light-secondary hover:border-primary/40 transition-colors rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-light-secondary rounded-full flex items-center justify-center">
                      <Icon size={15} className="text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-sans font-medium text-dark">{order.order_code}</p>
                      <p className="text-xs text-muted font-sans">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium ${info.cls}`}>{info.label}</span>
                    <span className="text-sm font-sans font-semibold text-primary">{fmtPrice(order.total_price)}</span>
                    <FiChevronRight size={14} className="text-muted" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted font-sans text-sm">
            <FiShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
            <p>Chưa có đơn hàng nào</p>
            <Link to="/products" className="btn-primary text-xs mt-4">Mua sắm ngay</Link>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/profile/info', icon: FiUser, label: "Thông Tin Cá Nhân" },
          { to: '/profile/orders', icon: FiShoppingBag, label: "Đơn Hàng" },
          { to: '/profile/addresses', icon: FiMapPin, label: "Địa Chỉ" },
          { to: '/wishlist', icon: FiHeart, label: "Yêu thích" },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}
              className="flex flex-col items-center gap-2 p-4 border border-light-secondary hover:border-primary hover:bg-primary/5 transition-all text-center rounded group">
              <Icon size={20} className="text-muted group-hover:text-primary transition-colors" />
              <span className="text-xs font-sans text-dark">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
