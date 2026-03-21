// Layout trang tài khoản — sidebar điều hướng các mục profile
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiUser, FiShoppingBag, FiMapPin, FiLock, FiLogOut, FiChevronRight } from 'react-icons/fi';

const menuItems = [
  { to: '/profile', label: 'Tổng quan', icon: FiGrid, end: true },
  { to: '/profile/info', label: 'Thông tin cá nhân', icon: FiUser },
  { to: '/profile/orders', label: 'Đơn hàng của tôi', icon: FiShoppingBag },
  { to: '/profile/addresses', label: 'Địa chỉ giao hàng', icon: FiMapPin },
  { to: '/profile/password', label: 'Đổi mật khẩu', icon: FiLock },
];

export default function ProfileLayout() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">
        <nav className="text-xs font-sans text-muted flex items-center gap-1.5">
          <Link to="/" className="hover:text-dark">Trang chủ</Link>
          <FiChevronRight size={11} />
          <span className="text-dark">Tài khoản</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="font-display text-3xl md:text-4xl text-dark text-center mb-10">Tài Khoản Của Tôi</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <nav className="border border-light-secondary">
              {menuItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3.5 text-sm font-sans border-b border-light-secondary last:border-0 transition-all ${
                      isActive
                        ? 'bg-light-secondary text-dark font-medium border-l-2 border-l-primary'
                        : 'text-muted hover:text-dark hover:bg-light-secondary/50'
                    }`
                  }
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              ))}
              <button className="flex items-center gap-3 px-5 py-3.5 text-sm font-sans text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                <FiLogOut size={15} />
                Đăng xuất
              </button>
            </nav>
          </aside>

          {/* Mobile menu */}
          <div className="md:hidden mb-6 overflow-x-auto w-full">
            <div className="flex gap-2 pb-2">
              {menuItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 text-xs font-sans whitespace-nowrap border transition-all flex-shrink-0 ${
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : 'border-light-secondary text-muted'
                    }`
                  }
                >
                  <Icon size={12} /> {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
