// Trang giỏ hàng — cập nhật số lượng, xóa, tổng tiền, gợi ý sản phẩm
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import ProductCard from '../../components/Product/ProductCard';
import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartLoading } = useCart();
  const [suggested, setSuggested] = useState([]);
  const shipping = cartTotal >= 500000 ? 0 : 35000;

  useEffect(() => {
    productAPI.getAll({ limit: 4, sort: 'newest' })
      .then((res) => {
        const raw = res.data;
        setSuggested(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {});
  }, []);

  if (cartLoading) return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 animate-pulse">
      <div className="h-8 bg-light-secondary rounded w-48 mb-8" />
      {[1,2].map(i => <div key={i} className="h-20 bg-light-secondary rounded mb-4" />)}
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <nav className="text-xs font-sans text-muted flex items-center gap-2 mb-6">
        <Link to="/" className="hover:text-dark">Trang chủ</Link>
        <span>/</span>
        <span className="text-dark">Giỏ hàng</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl text-dark mb-2">Giỏ Hàng Của Bạn</h1>
      <p className="text-muted text-sm font-sans mb-8">
        Bạn có <strong className="text-dark">{cartItems.length}</strong> sản phẩm trong giỏ
      </p>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="font-serif text-2xl text-dark mb-3">{"Danh sách trống"}</h2>
          <p className="text-muted font-sans text-sm mb-8">Hãy khám phá bộ sưu tập nước hoa của chúng tôi</p>
          <Link to="/products" className="btn-primary">Khám Phá Ngay</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-light-secondary text-[10px] tracking-widest uppercase font-sans text-muted">
              <div className="col-span-5">Sản Phẩm</div>
              <div className="col-span-2 text-center">Dung Tích</div>
              <div className="col-span-2 text-right">Đơn Giá</div>
              <div className="col-span-2 text-center">Số Lượng</div>
              <div className="col-span-1 text-right">Tổng</div>
            </div>

            <div className="divide-y divide-light-secondary">
              {cartItems.map(item => {
                // Support both real API format and local format
                const itemId = item.id;
                const name = item.name || item.product_name;
                const brand = item.brand_name || item.brand;
                const size = item.volume_ml ? `${item.volume_ml}ml` : item.size;
                const price = item.price;
                const thumbnail = item.thumbnail;
                const slug = item.slug || item.product_slug;

                return (
                  <div key={itemId} className="py-5 grid grid-cols-12 gap-4 items-start md:items-center">
                    <div className="col-span-12 md:col-span-5 flex items-center gap-4 min-w-0">
                      <Link to={`/products/${slug}`} className="w-18 h-18 md:w-20 md:h-20 flex-shrink-0 bg-light-secondary overflow-hidden rounded-lg">
                        {thumbnail ? <img src={mediaUrl(thumbnail)} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-light-secondary" />}
                      </Link>
                      <div className="min-w-0">
                        <p className="label-tag mb-0.5">{brand}</p>
                        <Link to={`/products/${slug}`} className="font-serif text-dark text-base hover:text-primary transition-colors break-words">{name}</Link>
                        <p className="text-xs text-muted font-sans mt-0.5 md:hidden">{size} · {fmtPrice(price)}</p>
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-2 text-center text-sm font-sans text-muted">{size}</div>
                    <div className="hidden md:block md:col-span-2 text-right text-sm font-sans text-dark">{fmtPrice(price)}</div>
                    <div className="col-span-8 md:col-span-2 flex items-center justify-start md:justify-center gap-0">
                      <button onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        className="w-8 h-8 border border-light-secondary flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                        <FiMinus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-sans">{item.quantity}</span>
                      <button onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="w-8 h-8 border border-light-secondary flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <div className="col-span-4 md:col-span-1 flex items-center justify-end gap-3">
                      <span className="text-sm font-sans font-medium text-dark hidden md:block">{fmtPrice(price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(itemId)} className="text-muted hover:text-red-500 transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Link to="/products" className="flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-muted hover:text-dark transition-colors">
                <FiArrowLeft size={13} /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-light-secondary p-6">
              <h3 className="font-serif text-xl text-dark mb-5">{"Tóm tắt đơn hàng"}</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted">Tạm tính</span>
                  <span className="text-dark">{fmtPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted">Phí vận chuyển</span>
                  <span className={shipping === 0 ? 'text-primary font-medium' : 'text-dark'}>
                    {shipping === 0 ? 'Miễn phí' : fmtPrice(shipping)}
                  </span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-xs font-sans text-muted bg-white px-3 py-2 mb-4">
                  Mua thêm <strong className="text-primary">{fmtPrice(500000 - cartTotal)}</strong> để được miễn phí vận chuyển
                </p>
              )}
              <div className="border-t border-light-secondary pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-sans font-medium text-dark">Tổng Cộng</span>
                  <span className="font-sans text-xl font-semibold text-primary">{fmtPrice(cartTotal + shipping)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary w-full text-center block">{"Thanh toán"}</Link>
            </div>
          </div>
        </div>
      )}

      {suggested.length > 0 && (
        <div className="mt-20 border-t border-light-secondary pt-12">
          <h2 className="font-display text-2xl text-dark mb-8 text-center">{"Có thể bạn sẽ thích"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {suggested.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
