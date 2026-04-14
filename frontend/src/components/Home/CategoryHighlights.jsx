// Highlights danh mục — 4 ô ảnh Nam/Nữ/Unisex/Gift Sets
import { Link } from 'react-router-dom';

export default function CategoryHighlights() {
  const cats = [
    { label: "Nước Hoa Nam",    route: '/products?category=nuoc-hoa-nam', img: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&q=80' },
    { label: "Nước Hoa Nữ",  route: '/products?category=nuoc-hoa-nu',  img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80' },
    { label: "Phi giới tính", route: '/products?category=unisex',        img: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500&q=80' },
    { label: "Bộ quà tặng",      route: '/products?category=gift-sets',     img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&q=80' },
  ];
  return (
    <section className="section-space site-container">
      <h2 className="section-title text-center mb-10">{"Danh Mục"}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map(cat => (
          <Link key={cat.label} to={cat.route} className="group relative aspect-square overflow-hidden">
            <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/50 transition-colors" />
            <div className="absolute inset-0 flex items-end p-4">
              <h3 className="text-white font-sans text-sm font-medium tracking-wide">{cat.label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
