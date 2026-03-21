// Header chính — logo, menu, tìm kiếm, giỏ hàng, dropdown tài khoản, chuyển ngôn ngữ
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiUser, FiHeart, FiX, FiMenu, FiLogOut } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import NotificationButton from '../ui/NotificationButton';

export default function Header() {
  const navLinks = [
    { label: "NAM",    to: '/products?category=nuoc-hoa-nam' },
    { label: "NỮ",  to: '/products?category=nuoc-hoa-nu' },
    { label: "UNISEX", to: '/products?category=unisex' },
    { label: "THƯƠNG HIỆU", to: '/products' },
    { label: "BLOG",   to: '/blog' },
    { label: "QUIZ",   to: '/quiz' },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 bg-light border-b border-light-secondary transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex items-center h-16 md:h-20">
            {/* Desktop left nav */}
            <nav className="hidden md:flex items-center gap-6 flex-1">
              {navLinks.slice(0, 4).map(link => (
                <NavLink key={link.label} to={link.to}
                  className={({ isActive }) => `text-[11px] tracking-widest font-sans font-medium transition-colors duration-200 pb-0.5 border-b-[1.5px] ${isActive ? 'text-primary border-primary' : 'text-dark border-transparent hover:text-primary hover:border-primary'}`}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden mr-3 text-dark" onClick={() => setMobileOpen(true)}>
              <FiMenu size={22} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-1 md:flex-none text-center md:mx-12">
              <div className="font-serif text-2xl md:text-3xl tracking-[0.15em] text-dark leading-none">NGOCVI</div>
              <div className="text-[9px] tracking-[0.35em] text-muted font-sans mt-0.5">PERFUME BOUTIQUE</div>
            </Link>

            {/* Desktop right nav */}
            <div className="hidden md:flex items-center gap-5 flex-1 justify-end">
              {navLinks.slice(4).map(link => (
                <NavLink key={link.label} to={link.to}
                  className={({ isActive }) => `text-[11px] tracking-widest font-sans font-medium transition-colors duration-200 pb-0.5 border-b-[1.5px] ${isActive ? 'text-primary border-primary' : 'text-dark border-transparent hover:text-primary hover:border-primary'}`}>
                  {link.label}
                </NavLink>
              ))}
              {/* Language switcher desktop */}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4 ml-auto md:ml-8">
              <button onClick={() => setSearchOpen(true)} className="text-dark hover:text-primary transition-colors">
                <FiSearch size={19} />
              </button>
              <NotificationButton />
              <Link to="/wishlist" className="relative text-dark hover:text-primary transition-colors hidden md:block">
                <FiHeart size={19} />
                {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans">{wishlistCount}</span>}
              </Link>

              {/* User dropdown */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-dark hover:text-primary transition-colors">
                    <FiUser size={19} />
                  </button>
                  <div className="absolute right-0 top-8 w-48 bg-white border border-light-secondary shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="px-4 py-3 border-b border-light-secondary">
                      <p className="text-xs font-sans font-medium text-dark truncate">{user.name}</p>
                      <p className="text-[10px] text-muted font-sans truncate">{user.email}</p>
                    </div>
                    {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-xs font-sans text-dark hover:bg-primary hover:text-white transition-colors">{"Dashboard Admin"}</Link>}
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-xs font-sans text-dark hover:bg-light-secondary transition-colors">{"Tài khoản"}</Link>
                    <Link to="/profile/orders" className="flex items-center gap-2 px-4 py-2.5 text-xs font-sans text-dark hover:bg-light-secondary transition-colors">{"Đơn hàng"}</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-xs font-sans text-red-500 hover:bg-red-50 transition-colors w-full text-left border-t border-light-secondary">
                      <FiLogOut size={13} /> {"Đăng xuất"}
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-dark hover:text-primary transition-colors"><FiUser size={19} /></Link>
              )}

              <Link to="/cart" className="relative text-dark hover:text-primary transition-colors">
                <FiShoppingBag size={19} />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-dark/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={"Tìm kiếm nước hoa..."}
                className="w-full bg-white text-dark text-lg font-sans px-6 py-5 pr-16 outline-none border-b-2 border-primary" />
              <button type="submit" className="absolute right-12 top-1/2 -translate-y-1/2 text-primary"><FiSearch size={22} /></button>
              <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark"><FiX size={22} /></button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-light flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-light-secondary">
            <Link to="/" className="font-serif text-2xl tracking-[0.15em]" onClick={() => setMobileOpen(false)}>NGOCVI</Link>
            <button onClick={() => setMobileOpen(false)}><FiX size={24} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-8">
            {navLinks.map(link => (
              <NavLink key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                className="block py-4 text-sm tracking-widest font-sans font-medium border-b border-light-secondary text-dark hover:text-primary transition-colors">
                {link.label}
              </NavLink>
            ))}
            {user && <button onClick={handleLogout} className="block w-full text-left py-4 text-sm tracking-widest font-sans font-medium border-b border-light-secondary text-red-500">{"Đăng xuất"}</button>}
          </nav>
          <div className="px-6 py-5 border-t border-light-secondary flex items-center justify-between">
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-muted font-sans">
                  <FiUser size={16} /> {user.name}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-muted font-sans">
                  <FiUser size={16} /> {"Đăng nhập"}
                </Link>
              )}
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm text-muted font-sans">
                <FiShoppingBag size={16} /> {"Giỏ hàng"} {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
            {/* Language switcher mobile */}
          </div>
        </div>
      )}
    </>
  );
}
