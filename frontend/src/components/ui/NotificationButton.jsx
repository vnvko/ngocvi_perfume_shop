// Nút thông báo đẩy cho khách hàng — xuất hiện ở Header
import { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiPackage, FiTruck, FiCheck, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';



export default function NotificationButton() {
  const STATUS_NOTIF = {
    pending:   { icon: FiPackage, color: 'text-amber-600', bg: 'bg-amber-50',  text: "Chờ xử lý" },
    confirmed: { icon: FiCheck,   color: 'text-blue-600',  bg: 'bg-blue-50',   text: "Đã xác nhận" },
    shipping:  { icon: FiTruck,   color: 'text-blue-600',  bg: 'bg-blue-50',   text: "Giao Hàng Toàn Quốc" },
    completed: { icon: FiCheck,   color: 'text-green-600', bg: 'bg-green-50',  text: "Hoàn thành" },
    cancelled: { icon: FiX,       color: 'text-red-600',   bg: 'bg-red-50',    text: "Đã hủy" },
  };
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  // Poll orders để tạo notifications từ trạng thái đơn
  useEffect(() => {
    if (!user) return;
    const loadNotifs = () => {
      orderAPI.getMyOrders({ limit: 10 })
        .then(res => {
          const orders = res.data?.orders || res.data || [];
          // Lấy từ localStorage những gì đã đọc
          const readIds = JSON.parse(localStorage.getItem('ngocvi_read_notifs') || '[]');
          const notifs = orders.map(o => ({
            id: `order-${o.id}-${o.status}`,
            orderId: o.id,
            orderCode: o.order_code,
            status: o.status,
            time: new Date(o.updated_at || o.created_at).toLocaleString('vi-VN'),
            read: readIds.includes(`order-${o.id}-${o.status}`),
            canReview: o.status === 'completed',
          }));
          setNotifications(notifs);
          setUnread(notifs.filter(n => !n.read).length);
        })
        .catch(() => {});
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markRead = (id) => {
    const readIds = JSON.parse(localStorage.getItem('ngocvi_read_notifs') || '[]');
    if (!readIds.includes(id)) {
      localStorage.setItem('ngocvi_read_notifs', JSON.stringify([...readIds, id]));
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    localStorage.setItem('ngocvi_read_notifs', JSON.stringify(ids));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(s => !s)}
        className="relative text-dark hover:text-primary transition-colors p-1">
        <FiBell size={19} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-sans font-medium">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white border border-light-secondary rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-light-secondary">
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-medium text-dark">Thông báo</h3>
              {unread > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-sans">{unread} mới</span>}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && <button onClick={markAllRead} className="text-[11px] text-primary hover:underline font-sans">Đọc tất cả</button>}
              <button onClick={() => setOpen(false)} className="text-muted hover:text-dark"><FiX size={14} /></button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-light-secondary/50">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-muted font-sans text-xs">
                <FiBell size={24} className="mx-auto mb-2 opacity-30" />
                Chưa có thông báo nào
              </div>
            ) : notifications.map(n => {
              const info = STATUS_NOTIF[n.status] || STATUS_NOTIF.pending;
              const Icon = info.icon;
              return (
                <div key={n.id} className={`${!n.read ? 'bg-primary/5' : ''}`}>
                  <button onClick={() => markRead(n.id)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${info.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={info.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.read ? 'font-medium text-dark' : 'text-dark/70'}`}>{info.text}</p>
                      <p className="text-[11px] text-primary font-sans">{n.orderCode}</p>
                      <p className="text-[10px] text-muted font-sans mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                  </button>
                  {/* CTA: review nếu completed */}
                  {n.canReview && (
                    <div className="px-4 pb-3 -mt-1">
                      <Link to={`/profile/orders/${n.orderId}`} onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-white bg-primary px-3 py-1.5 rounded hover:bg-primary-dark transition-colors">
                        <FiStar size={11} /> Đánh giá sản phẩm
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2.5 border-t border-light-secondary text-center">
            <Link to="/profile/orders" onClick={() => setOpen(false)}
              className="text-[11px] text-primary hover:underline font-sans">
              Xem tất cả đơn hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
