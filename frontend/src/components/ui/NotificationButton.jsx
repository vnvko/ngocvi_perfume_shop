// Nút thông báo cho khách — đồng bộ từ đơn hàng; đơn hoàn tất → link thẳng /products/{slug}/review?orderId=
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiBell, FiX, FiPackage, FiTruck, FiCheck, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../services/api';

const readStorageKey = (userId) => `ngocvi_read_notifs_u${userId}`;

/** Chuỗi từ API: "id:slug||id2:slug2" */
function parseReviewTargets(csv) {
  if (!csv || typeof csv !== 'string') return [];
  return csv
    .split('||')
    .map((chunk) => {
      const i = chunk.indexOf(':');
      if (i <= 0) return null;
      const productId = parseInt(chunk.slice(0, i), 10);
      const slug = chunk.slice(i + 1).trim();
      if (!slug || Number.isNaN(productId)) return null;
      return { productId, slug };
    })
    .filter(Boolean);
}

export default function NotificationButton() {
  const STATUS_NOTIF = {
    pending:   { icon: FiPackage, color: 'text-amber-600', bg: 'bg-amber-50',  text: 'Đơn hàng đang chờ xử lý' },
    confirmed: { icon: FiCheck,   color: 'text-blue-600',  bg: 'bg-blue-50',   text: 'Đơn hàng đã được xác nhận' },
    shipping:  { icon: FiTruck,   color: 'text-blue-600',  bg: 'bg-blue-50',   text: 'Đơn hàng đang được giao' },
    completed: { icon: FiCheck,   color: 'text-green-600', bg: 'bg-green-50',  text: 'Đơn hàng đã hoàn thành — bạn có thể đánh giá sản phẩm đã mua' },
    cancelled: { icon: FiX,       color: 'text-red-600',   bg: 'bg-red-50',    text: 'Đơn hàng đã hủy' },
  };
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const loadNotifs = useCallback(() => {
    if (!user?.id) return;
    orderAPI.getMyOrders({ limit: 15 })
      .then((res) => {
        const orders = Array.isArray(res.data) ? res.data : [];
        const readIds = JSON.parse(localStorage.getItem(readStorageKey(user.id)) || '[]');
        const notifs = orders.map((o) => {
          const reviewTargets = o.status === 'completed' ? parseReviewTargets(o.review_products) : [];
          return {
            id: `order-${o.id}-${o.status}`,
            orderId: o.id,
            orderCode: o.order_code,
            status: o.status,
            time: new Date(o.status_updated_at || o.created_at).toLocaleString('vi-VN'),
            read: readIds.includes(`order-${o.id}-${o.status}`),
            canReview: o.status === 'completed',
            reviewTargets,
          };
        });
        setNotifications(notifs);
        setUnread(notifs.filter((n) => !n.read).length);
      })
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, [user?.id, loadNotifs]);

  useEffect(() => {
    if (open) loadNotifs();
  }, [open, loadNotifs]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markRead = (id) => {
    if (!user?.id) return;
    const key = readStorageKey(user.id);
    const readIds = JSON.parse(localStorage.getItem(key) || '[]');
    if (!readIds.includes(id)) {
      localStorage.setItem(key, JSON.stringify([...readIds, id]));
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = () => {
    if (!user?.id) return;
    const ids = notifications.map((n) => n.id);
    localStorage.setItem(readStorageKey(user.id), JSON.stringify(ids));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
                  <button type="button" onClick={() => markRead(n.id)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${info.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={info.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.read ? 'font-medium text-dark' : 'text-dark/70'}`}>{info.text}</p>
                      <p className="text-[11px] text-primary font-sans">Mã: {n.orderCode}</p>
                      <p className="text-[10px] text-muted font-sans mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                  </button>
                  {n.canReview && (
                    <div className="px-4 pb-3 -mt-1 space-y-1.5">
                      {n.reviewTargets?.length ? (
                        n.reviewTargets.map((t) => {
                          const label = t.slug
                            .split('-')
                            .filter(Boolean)
                            .slice(0, 5)
                            .join(' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                          return (
                          <Link
                            key={`${n.orderId}-${t.productId}`}
                            to={`/products/${t.slug}/review?orderId=${n.orderId}`}
                            onClick={() => { markRead(n.id); setOpen(false); }}
                            className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-white bg-primary px-3 py-1.5 rounded hover:bg-primary-dark transition-colors w-full justify-center text-center leading-tight">
                            <FiStar size={11} className="flex-shrink-0" /> Viết đánh giá{label ? `: ${label}` : ''}
                          </Link>
                          );
                        })
                      ) : (
                        <Link
                          to={`/profile/orders/${n.orderId}`}
                          onClick={() => { markRead(n.id); setOpen(false); }}
                          className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-primary border border-primary px-3 py-1.5 rounded hover:bg-primary/5 transition-colors w-full justify-center">
                          Xem đơn hàng để đánh giá
                        </Link>
                      )}
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
