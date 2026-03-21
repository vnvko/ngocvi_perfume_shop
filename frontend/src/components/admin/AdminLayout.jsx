// Layout admin — sidebar menu + topbar + user dropdown + notifications + global search + link về store
import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiTag, FiLayers, FiShoppingCart, FiArchive,
  FiUsers, FiStar, FiFileText, FiMessageSquare, FiBarChart2,
  FiBell, FiSearch, FiLogOut, FiUser, FiExternalLink, FiPercent,
  FiChevronDown, FiX, FiPackage, FiDollarSign
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const navItems = [
  { to: '/admin',            label: 'Dashboard',         icon: FiGrid,        end: true },
  { to: '/admin/products',   label: 'Quản lý sản phẩm',  icon: FiTag },
  { to: '/admin/categories', label: 'Quản lý danh mục',  icon: FiLayers },
  { to: '/admin/orders',     label: 'Quản lý đơn hàng',  icon: FiShoppingCart },
  { to: '/admin/inventory',  label: 'Quản lý kho',        icon: FiArchive },
  { to: '/admin/users',      label: 'Người dùng',         icon: FiUsers },
  { to: '/admin/reviews',    label: 'Đánh giá',           icon: FiStar },
  { to: '/admin/blog',       label: 'Blog',               icon: FiFileText },
  { to: '/admin/vouchers',   label: 'Voucher',             icon: FiPercent },
  { to: '/admin/chatbox',    label: 'Chatbox',            icon: FiMessageSquare },
  { to: '/admin/stats',      label: 'Thống kê',           icon: FiBarChart2 },
];

const NOTIF_TYPES = { order: '🛒', review: '⭐', user: '👤', system: '⚙️' };

export function AdminLayout({ children, breadcrumb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser]   = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ]     = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order',  text: 'Đơn hàng #NGV-001 mới vừa được đặt',    time: '2 phút trước',   read: false },
    { id: 2, type: 'review', text: 'Đánh giá mới cho Dior Sauvage EDP',      time: '15 phút trước',  read: false },
    { id: 3, type: 'user',   text: 'Khách hàng mới đăng ký tài khoản',       time: '1 giờ trước',    read: false },
    { id: 4, type: 'order',  text: 'Đơn hàng #NGV-002 đã hoàn thành',        time: '2 giờ trước',    read: true  },
    { id: 5, type: 'system', text: 'Cập nhật hệ thống thành công',            time: '1 ngày trước',   read: true  },
  ]);

  const notifRef = useRef(null);
  const userRef  = useRef(null);
  const searchRef = useRef(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setShowUser(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Global search with debounce
  useEffect(() => {
    if (!searchQ.trim() || searchQ.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const [prods, orders, users] = await Promise.all([
          adminAPI.getProducts({ search: searchQ, limit: 3 }),
          adminAPI.getOrders({ search: searchQ, limit: 3 }),
          adminAPI.getUsers({ search: searchQ, limit: 3 }),
        ]);
        const results = [];
        (prods.data || []).forEach(p => results.push({ type: 'product', label: p.name, sub: p.brand_name, link: `/admin/products/${p.id}/edit`, icon: '📦' }));
        (orders.data || []).forEach(o => results.push({ type: 'order', label: o.order_code, sub: o.customer_name, link: `/admin/orders/${o.id}`, icon: '🛒' }));
        (users.data || []).forEach(u => results.push({ type: 'user', label: u.name, sub: u.email, link: `/admin/users/${u.id}`, icon: '👤' }));
        setSearchResults(results);
      } catch {}
      setSearchLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQ]);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const markRead    = (id) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[230px] flex-shrink-0 bg-sidebar flex flex-col">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">N</div>
            <div>
              <p className="text-white text-xs font-semibold">NGOCVI Admin</p>
              <p className="text-gray-400 text-[10px]">Perfume Boutique</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-md transition-all mb-0.5 ${
                  isActive ? 'bg-sidebar-active text-primary' : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                }`}>
              <Icon size={15} />{label}
            </NavLink>
          ))}
          <div className="border-t border-white/10 mt-3 pt-3">
            <Link to="/" target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-md text-gray-400 hover:text-white hover:bg-sidebar-hover transition-all">
              <FiExternalLink size={15} /> Về trang Store
            </Link>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              : <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} title="Đăng xuất" className="text-gray-500 hover:text-red-400 transition-colors">
              <FiLogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-14 flex items-center px-6 gap-4 flex-shrink-0">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-1 min-w-0">
            <Link to="/admin" className="hover:text-gray-700 flex-shrink-0">Admin</Link>
            {breadcrumb && <>
              <span className="flex-shrink-0">›</span>
              {breadcrumb.parent && <>
                <Link to={breadcrumb.parentLink || '#'} className="hover:text-gray-700 flex-shrink-0">{breadcrumb.parent}</Link>
                <span className="flex-shrink-0">›</span>
              </>}
              <span className="text-primary font-medium truncate">{breadcrumb.current}</span>
            </>}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Global Search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQ}
                onChange={e => { setSearchQ(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                placeholder="Tìm sản phẩm, đơn, user..."
                className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-md outline-none focus:border-primary w-52 transition-colors" />
              {showSearch && searchQ.length >= 2 && (
                <div className="absolute right-0 top-9 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  {searchLoading ? (
                    <div className="px-4 py-3 text-xs text-gray-400">Đang tìm...</div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {['product','order','user'].map(type => {
                        const items = searchResults.filter(r => r.type === type);
                        if (!items.length) return null;
                        const typeLabel = type === 'product' ? 'Sản phẩm' : type === 'order' ? 'Đơn hàng' : 'Người dùng';
                        return (
                          <div key={type}>
                            <p className="px-4 pt-3 pb-1 text-[10px] tracking-widest uppercase text-gray-400 font-medium">{typeLabel}</p>
                            {items.map((r, i) => (
                              <Link key={i} to={r.link} onClick={() => { setShowSearch(false); setSearchQ(''); }}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                <span className="text-base">{r.icon}</span>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-800 truncate">{r.label}</p>
                                  <p className="text-[11px] text-gray-400 truncate">{r.sub}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-400">Không tìm thấy kết quả cho "{searchQ}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotif(s => !s); setShowUser(false); }}
                className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <FiBell size={17} />
                {unread > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                      {unread > 0 && <span className="text-[10px] font-medium bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unread} mới</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {unread > 0 && <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">Đọc tất cả</button>}
                      <button onClick={() => setShowNotif(false)} className="text-gray-400 hover:text-gray-600 p-0.5"><FiX size={14} /></button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <button key={n.id} onClick={() => markRead(n.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <span className="text-base flex-shrink-0 mt-0.5">{NOTIF_TYPES[n.type] || '📌'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={userRef}>
              <button onClick={() => { setShowUser(s => !s); setShowNotif(false); }}
                className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  : <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                }
                <FiChevronDown size={12} className="text-gray-400" />
              </button>

              {showUser && (
                <div className="absolute right-0 top-11 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-800 truncate">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full mt-1.5 inline-block capitalize">
                      {user?.role_name || 'admin'}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link to="/" target="_blank" onClick={() => setShowUser(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      <FiExternalLink size={13} /> Xem trang Store
                    </Link>
                    <Link to="/profile" onClick={() => setShowUser(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                      <FiUser size={13} /> Hồ sơ cá nhân
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100 mt-1">
                      <FiLogOut size={13} /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
