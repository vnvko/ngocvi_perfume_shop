// Banner For Him / For Her — chia đôi màn hình
import { Link } from 'react-router-dom';

export default function GenderCollections() {
  return (
    <section className="grid md:grid-cols-2 gap-0">
      {[
        { gender: 'male',   label: "For Him", img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80', route: '/products?category=nuoc-hoa-nam' },
        { gender: 'female', label: "For Her", img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80', route: '/products?category=nuoc-hoa-nu' },
      ].map(item => (
        <Link key={item.gender} to={item.route} className="relative group h-72 md:h-96 overflow-hidden block">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
