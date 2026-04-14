// Sản phẩm nổi bật — tabs Best Seller / New Arrival / Trending, lấy từ API
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import { productAPI } from '../../services/api';

const FEATURED_TABS = [
  { id: 'bestseller', label: 'Bán chạy', sort: 'popular' },
  { id: 'new', label: 'Mới về', sort: 'newest' },
  { id: 'trending', label: 'Xu hướng', sort: 'rating' },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('bestseller');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const tab = FEATURED_TABS.find((t) => t.id === activeTab);
    productAPI.getAll({ limit: 4, sort: tab?.sort || 'newest' })
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : raw?.data;
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section className="section-space site-container">
      <div className="text-center mb-10">
        <h2 className="section-title">{"Bộ Sưu Tập Nổi Bật"}</h2>
        <div className="w-12 h-px bg-primary mx-auto mt-3 mb-6" />
        <div className="flex items-center justify-center gap-6">
          {FEATURED_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-xs tracking-widest uppercase font-sans font-medium pb-1 border-b-[1.5px] transition-all duration-200 ${activeTab === tab.id ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-dark'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-light-secondary mb-3" />
              <div className="h-3 bg-light-secondary rounded mb-2 w-2/3" />
              <div className="h-3 bg-light-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
          {(Array.isArray(products) ? products : []).map(p => (
            <ProductCard key={p.id} product={p} allProducts={Array.isArray(products) ? products : []} />
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/products" className="btn-outline">{"Xem tất cả"}</Link>
      </div>
    </section>
  );
}
