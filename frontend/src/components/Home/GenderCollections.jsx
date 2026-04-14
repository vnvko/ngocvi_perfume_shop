// Banner For Him / For Her — chia đôi màn hình
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/mediaUrl';

export default function GenderCollections() {
  return (
    <section className="grid md:grid-cols-2 gap-0">
      {[
        { gender: 'male',   label: "Dành cho nam", img: '/uploads/1775898412755-124335.jpg', route: '/products?category=nuoc-hoa-nam' },
        { gender: 'female', label: "Dành cho nữ", img: '/uploads/products/1775902581803-570817.jpg', route: '/products?category=nuoc-hoa-nu' },
      ].map(item => (
        <Link key={item.gender} to={item.route} className="relative group h-[clamp(280px,45vh,520px)] overflow-hidden block">
          <img src={mediaUrl(item.img)} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/55 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h3 className="font-display text-4xl md:text-5xl tracking-wider mb-4">{item.label}</h3>
            <span className="text-xs tracking-widest uppercase font-sans border border-white/60 px-6 py-2 hover:bg-white hover:text-dark transition-colors">
              {"Khám Phá Bộ Sưu Tập"}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
