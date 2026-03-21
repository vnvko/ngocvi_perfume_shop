// Card sản phẩm — HOT/NEW badge, add to cart, wishlist toggle
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

// Tính nhãn HOT: total_sold >= 70% so với trung bình toàn bộ
// Nhãn NEW: created_at trong 30 ngày gần đây
function getBadge(product, allProducts = []) {
  const now = new Date();
  const created = new Date(product.created_at);
  const daysSince = (now - created) / (1000 * 60 * 60 * 24);
  if (daysSince <= 30) return { label: 'NEW', color: 'bg-blue-500' };

  if (allProducts.length > 1 && product.total_sold > 0) {
    const avg = allProducts.reduce((s, p) => s + (p.total_sold || 0), 0) / allProducts.length;
    if (avg > 0 && product.total_sold >= avg * 1.7) return { label: 'HOT', color: 'bg-red-500' };
  } else if (product.total_sold >= 10) {
    return { label: 'HOT', color: 'bg-red-500' };
  }
  return null;
}

export default function ProductCard({ product, allProducts = [] }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const thumbnail = product.thumbnail || product.images?.[0]?.image_url || null;
  const price = product.price;
  const salePrice = product.sale_price;
  const brandName = product.brand_name || product.brand;
  const discount = salePrice && salePrice > price ? Math.round((1 - price / salePrice) * 100) : null;
  const inStock = product.min_stock === undefined ? true : product.min_stock > 0;
  const badge = getBadge(product, allProducts);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (added) return;
    const size = product.variants?.[0] ? `${product.variants[0].volume_ml}ml` : '100ml';
    await addToCart(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    toggleWishlist(product.id);
  };

  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden bg-light-secondary aspect-square relative">
        <Link to={`/products/${product.slug}`}>
          {thumbnail ? (
            <img src={thumbnail} alt={product.name} loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-xs font-sans">No Image</div>
          )}
        </Link>

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && (
            <span className={`${badge.color} text-white text-[10px] tracking-wider px-2 py-0.5 font-sans font-semibold`}>
              {badge.label}
            </span>
          )}
          {discount && (
            <span className="bg-primary text-white text-[10px] tracking-wider px-2 py-0.5 font-sans font-medium">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="bg-muted text-white text-[10px] tracking-wider px-2 py-0.5 font-sans font-medium">Hết hàng</span>
          )}
        </div>

        {/* Total sold badge top-right */}
        {(product.total_sold > 0) && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-dark/70 text-white text-[10px] font-sans px-2 py-0.5">
              {product.total_sold} đã bán
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button onClick={handleWishlist}
          className="absolute top-10 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white">
          <FiHeart size={14} className={isWishlisted ? 'fill-primary text-primary' : ''} />
        </button>

        {/* Add to cart button (hover reveal) */}
        {inStock && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart}
              className={`w-full text-white text-[11px] tracking-widest uppercase font-sans py-3 flex items-center justify-center gap-2 transition-colors duration-200 ${
                added ? 'bg-green-600' : 'bg-dark hover:bg-primary'
              }`}>
              {added ? <><FiCheck size={13} /> Đã Thêm</> : <><FiShoppingBag size={13} /> {"Thêm Vào Giỏ"}</>}
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <p className="label-tag mb-1">{brandName}</p>
        <Link to={`/products/${product.slug}`}
          className="font-serif text-dark text-[17px] leading-snug hover:text-primary transition-colors block">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          {salePrice && salePrice > price ? (
            <>
              <span className="font-sans font-semibold text-primary">{fmtPrice(price)}</span>
              <span className="text-muted text-sm line-through font-sans">{fmtPrice(salePrice)}</span>
            </>
          ) : (
            <span className="font-sans font-medium text-dark">{fmtPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
