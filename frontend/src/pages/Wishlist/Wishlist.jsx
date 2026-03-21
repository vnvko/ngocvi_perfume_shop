// Trang yêu thích — đồng bộ với backend khi đã đăng nhập
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../../services/api';
import ProductCard from '../../components/Product/ProductCard';
import { useAuth } from '../../context/AuthContext';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    wishlistAPI.getWishlist()
      .then(res => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Map API format to ProductCard format
  const products = items.map(item => ({
    id: item.product_id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    sale_price: item.sale_price,
    brand_name: item.brand_name,
    thumbnail: item.thumbnail,
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
      <nav className="text-xs font-sans text-muted flex items-center gap-2 mb-6">
        <Link to="/" className="hover:text-dark">Trang chủ</Link>
        <span>/</span>
        <span className="text-dark">Yêu thích</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl text-dark text-center mb-2">{"Yêu Thích"}</h1>
      <div className="w-12 h-px bg-primary mx-auto mb-10" />

      {!user ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-5">🔐</div>
          <h2 className="font-serif text-xl text-dark mb-3">{"Vui lòng đăng nhập"}</h2>
          <Link to="/login" className="btn-primary">{"Đăng Nhập"}</Link>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse"><div className="aspect-square bg-light-secondary mb-3" /><div className="h-3 bg-light-secondary rounded w-3/4" /></div>)}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-5">🤍</div>
          <h2 className="font-serif text-xl text-dark mb-3">{"Danh sách trống"}</h2>
          <p className="text-muted font-sans text-sm mb-6">{"emptyHint"}</p>
          <Link to="/products" className="btn-primary">{"Khám Phá Sản Phẩm"}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
