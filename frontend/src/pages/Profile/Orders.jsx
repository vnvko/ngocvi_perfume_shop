// Lịch sử đơn hàng — filter theo trạng thái, link sang chi tiết đơn
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';

const statusStyles = { shipping: 'bg-primary/10 text-primary', completed: 'bg-light-secondary text-muted', cancelled: 'bg-red-50 text-red-500', pending: 'bg-amber-50 text-amber-600', confirmed: 'bg-blue-50 text-blue-600' };

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export default function Orders() {
  const statusLabels = { shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy", pending: "Chờ xử lý", confirmed: "Đã xác nhận" };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const params = filter !== 'all' ? { status: filter } : {};
    orderAPI.getMyOrders(params)
      .then(res => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="border border-light-secondary">
      <div className="p-6 border-b border-light-secondary">
        <h2 className="font-serif text-xl text-dark mb-1">Đơn Hàng Của Tôi</h2>
        <p className="text-muted text-sm font-sans">Theo dõi lịch sử đơn hàng của bạn</p>
      </div>

      <div className="px-6 border-b border-light-secondary flex gap-5 overflow-x-auto">
        {[{ id: 'all', label: "Tất cả" }, { id: 'pending', label: "Chờ xử lý" }, { id: 'shipping', label: "Đang giao" }, { id: 'completed', label: "Hoàn thành" }, { id: 'cancelled', label: "Đã hủy" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`py-3 text-xs tracking-widest uppercase font-sans font-medium border-b-2 transition-all whitespace-nowrap ${filter === f.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-dark'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] tracking-widest uppercase font-sans text-muted bg-light-secondary/50">
        {['Mã đơn hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái', 'Hành động'].map(h => (
          <div key={h} className={h === 'Tổng tiền' ? 'col-span-2 text-right' : h === 'Hành động' ? 'col-span-2 text-right' : 'col-span-2'}>{h}</div>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted font-sans text-sm">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-muted font-sans text-sm">{"Chưa có đơn hàng nào"}</div>
      ) : (
        <div className="divide-y divide-light-secondary">
          {orders.map(order => (
            <div key={order.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-light-secondary/30 transition-colors">
              <div className="col-span-6 md:col-span-2">
                <Link to={`/profile/orders/${order.id}`} className="text-primary font-sans text-sm font-medium hover:underline">
                  {order.order_code}
                </Link>
              </div>
              <div className="hidden md:block col-span-2 text-sm font-sans text-muted">
                {new Date(order.created_at).toLocaleDateString('vi-VN')}
              </div>
              <div className="hidden md:block col-span-2 text-sm font-sans font-medium text-dark text-right">
                {fmtPrice(order.total_price)}
              </div>
              <div className="col-span-4 md:col-span-4 flex md:justify-center">
                <span className={`text-[11px] tracking-wider font-sans px-3 py-1 rounded-full ${statusStyles[order.status] || 'badge-gray'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="col-span-2 md:col-span-2 flex justify-end">
                <Link to={`/profile/orders/${order.id}`} className="text-[11px] tracking-widest uppercase font-sans text-dark hover:text-primary transition-colors">
                  Xem Chi Tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
