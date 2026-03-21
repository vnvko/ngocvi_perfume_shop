// Footer — liên kết nhanh, chính sách, đăng ký nhận tin
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-xl tracking-[0.2em] block mb-4">NGOCVI</Link>
            <p className="text-muted text-sm font-sans leading-relaxed mb-6">
              Nơi tôn vinh nghệ thuật hương thơm. Chúng tôi mang đến những bộ sưu tập nước hoa cao cấp, chính hãng.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-muted/40 rounded-sm flex items-center justify-center text-muted hover:text-white hover:border-white transition-colors">
                <FiFacebook size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-muted/40 rounded-sm flex items-center justify-center text-muted hover:text-white hover:border-white transition-colors">
                <FiInstagram size={14} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 border border-muted/40 rounded-sm flex items-center justify-center text-muted hover:text-white hover:border-white transition-colors text-[10px] font-serif">TT</a>
            </div>
          </div>

          {/* Khám phá */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-sans font-medium mb-5 text-light-secondary">{"Khám Phá Sản Phẩm"}</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=nuoc-hoa-nam" className="text-muted text-sm font-sans hover:text-white transition-colors">{"Nước Hoa Nam"}</Link></li>
              <li><Link to="/products?category=nuoc-hoa-nu" className="text-muted text-sm font-sans hover:text-white transition-colors">{"Nước Hoa Nữ"}</Link></li>
              <li><Link to="/products?category=unisex" className="text-muted text-sm font-sans hover:text-white transition-colors">{"UNISEX"}</Link></li>
              <li><Link to="/products" className="text-muted text-sm font-sans hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/blog" className="text-muted text-sm font-sans hover:text-white transition-colors">{"BLOG"}</Link></li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-sans font-medium mb-5 text-light-secondary">{"Chính Sách"}</h4>
            <ul className="space-y-3">
              <li><Link to="/policy" className="text-muted text-sm font-sans hover:text-white transition-colors">{"Giao Hàng Toàn Quốc"}</Link></li>
              <li><Link to="/policy" className="text-muted text-sm font-sans hover:text-white transition-colors">{"return"}</Link></li>
              <li><Link to="/policy" className="text-muted text-sm font-sans hover:text-white transition-colors">{"privacy"}</Link></li>
              <li><Link to="/policy" className="text-muted text-sm font-sans hover:text-white transition-colors">{"terms"}</Link></li>
              <li><Link to="/contact" className="text-muted text-sm font-sans hover:text-white transition-colors">{"Yêu Thích"}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-sans font-medium mb-5 text-light-secondary">{"Đăng Ký Nhận Tin"}</h4>
            <p className="text-muted text-sm font-sans mb-4 leading-relaxed">{"Nhận thông tin ưu đãi và xu hướng mới nhất."}</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-2">
              <input type="Email" placeholder={"emailPlaceholder"}
                className="bg-transparent border border-muted/30 text-white px-4 py-2.5 text-sm font-sans outline-none placeholder:text-muted focus:border-primary transition-colors" />
              <button type="submit" className="bg-primary text-white text-xs tracking-widest uppercase font-sans py-2.5 hover:bg-primary-dark transition-colors">
                {"Đăng Ký"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <p className="text-muted text-xs font-sans">{"© 2024 NGOCVI Perfume. Đã đăng ký bản quyền."}</p>
          <div className="flex items-center gap-4 text-muted text-xs font-sans">
            <Link to="/contact" className="hover:text-white transition-colors">{"Hotline: 1900-xxxx"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
