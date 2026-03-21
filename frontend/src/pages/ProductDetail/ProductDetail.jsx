// Trang chi tiết sản phẩm — ảnh, variants, add to cart, đánh giá, sản phẩm liên quan
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingBag, FiHeart, FiCheck, FiChevronRight, FiPlus, FiMinus } from 'react-icons/fi';
import { productAPI, reviewAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/Product/ProductCard';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(null);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('desc');

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    productAPI.getBySlug(slug)
      .then(res => {
        const p = res.data.product;
        setProduct(p);
        setMainImg(p.images?.find(i => i.is_main)?.image_url || p.images?.[0]?.image_url || p.thumbnail);
        setSelectedVariant(p.variants?.[0] || null);
        // Load reviews
        return reviewAPI.getByProduct(p.id, { limit: 20 });
      })
      .then(res => {
        setReviews(res.data.reviews || []);
        setLoading(false);
        // Load related
        return productAPI.getAll({ category: '', limit: 4, sort: 'rating' });
      })
      .then(res => setRelated((res.data || []).filter(p => p.slug !== slug).slice(0, 4)))
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedVariant) return;
    await addToCart(product, `${selectedVariant.volume_ml}ml`, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleSubmitReview = async () => {
    if (!user) { navigate('/login'); return; }
    if (!reviewComment.trim()) return;
    setReviewSending(true);
    try {
      await reviewAPI.create({ product_id: product.id, rating: reviewRating, comment: reviewComment });
      const res = await reviewAPI.getByProduct(product.id, { limit: 20 });
      setReviews(res.data.reviews || []);
      setReviewDone(true);
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
    } catch {}
    finally { setReviewSending(false); }
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 animate-pulse">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-light-secondary" />
        <div className="space-y-4">
          <div className="h-5 bg-light-secondary rounded w-1/3" />
          <div className="h-8 bg-light-secondary rounded w-2/3" />
          <div className="h-6 bg-light-secondary rounded w-1/4" />
          <div className="h-20 bg-light-secondary rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-muted font-sans">Không tìm thấy sản phẩm.</p>
      <Link to="/products" className="btn-primary mt-4">Quay lại</Link>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs font-sans text-muted flex items-center gap-1.5 mb-6">
        <Link to="/" className="hover:text-dark">Trang chủ</Link>
        <FiChevronRight size={11}/>
        <Link to="/products" className="hover:text-dark">Sản phẩm</Link>
        <FiChevronRight size={11}/>
        <span className="text-dark truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-square bg-light-secondary overflow-hidden mb-4">
            {mainImg
              ? <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted text-sm font-sans">Chưa có ảnh</div>
            }
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map(img => (
                <button key={img.id} onClick={() => setMainImg(img.image_url)}
                  className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${mainImg === img.image_url ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="label-tag mb-2">{product.brand_name}</p>
          <h1 className="font-display text-3xl md:text-4xl text-dark mb-2 leading-tight">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center gap-3 mb-4">
            {avgRating ? (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FiStar key={i} size={14} className={i < Math.round(Number(avgRating)) ? 'fill-primary text-primary' : 'text-muted'} />
                  ))}
                </div>
                <span className="font-sans text-sm font-medium text-dark">{avgRating}</span>
                <span className="text-muted text-sm font-sans">({reviews.length} đánh giá)</span>
              </div>
            ) : (
              <span className="text-muted text-sm font-sans">Chưa có đánh giá</span>
            )}
            {product.total_sold > 0 && (
              <span className="text-xs text-muted font-sans border-l border-light-secondary pl-3">{product.total_sold} đã bán</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-sans text-3xl font-semibold text-primary">
              {fmtPrice(selectedVariant?.price || product.price)}
            </span>
            {product.sale_price && product.sale_price > product.price && (
              <span className="font-sans text-lg text-muted line-through">{fmtPrice(product.sale_price)}</span>
            )}
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase font-sans text-muted mb-3">Dung Tích</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button key={v.id} onClick={() => setSelectedVariant(v)}
                    className={`border-2 px-4 py-2 text-xs font-sans font-medium transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-light-secondary text-dark hover:border-primary/50'
                    } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={v.stock === 0}>
                    {v.volume_ml}ml
                    {v.stock === 0 && <span className="text-[9px] ml-1">(hết)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Cart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border-2 border-light-secondary">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-10 h-11 flex items-center justify-center hover:bg-light-secondary transition-colors">
                <FiMinus size={13} />
              </button>
              <span className="w-12 text-center font-sans text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="w-10 h-11 flex items-center justify-center hover:bg-light-secondary transition-colors">
                <FiPlus size={13} />
              </button>
            </div>
            <button onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm tracking-widest uppercase font-sans font-medium transition-colors ${
                added ? 'bg-green-600 text-white' : 'bg-dark text-white hover:bg-primary'
              }`}>
              {added ? <><FiCheck size={15} /> Đã Thêm Vào Giỏ</> : <><FiShoppingBag size={15} /> Thêm Vào Giỏ</>}
            </button>
            <button onClick={() => { if (!user) { navigate('/login'); return; } toggleWishlist(product.id); }}
              className={`w-12 h-12 border-2 flex items-center justify-center transition-colors ${
                isWishlisted ? 'border-primary bg-primary/5' : 'border-light-secondary hover:border-primary'
              }`}>
              <FiHeart size={18} className={isWishlisted ? 'fill-primary text-primary' : ''} />
            </button>
          </div>

          {/* Guarantee badges */}
          <div className="flex flex-wrap gap-4 py-4 border-t border-light-secondary text-xs font-sans text-muted">
            {["100% Hàng Chính Hãng", "7 Ngày Đổi Trả", "Giao Hàng Toàn Quốc"].map(g => (
              <span key={g} className="flex items-center gap-1.5">
                <FiCheck size={12} className="text-primary" />{g}
              </span>
            ))}
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-sans">
            {[
              ['Thương hiệu', product.brand_name],
              ['Nồng độ', product.concentration],
              ['Giới tính', product.gender === 'male' ? 'Nam' : product.gender === 'female' ? 'Nữ' : 'Unisex'],
              ['Danh mục', product.category_name],
            ].map(([k, v]) => v && (
              <div key={k} className="flex gap-2">
                <span className="text-muted">{k}:</span>
                <span className="text-dark font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Mô tả / Đánh giá */}
      <div className="border-b border-light-secondary mb-8">
        <div className="flex gap-8">
          {[
            { id: 'desc', label: "Mô Tả Sản Phẩm" },
            { id: 'reviews', label: "Đánh Giá" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs tracking-widest uppercase font-sans font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-dark'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'desc' && (
        <div className="max-w-2xl font-sans text-dark/80 text-sm leading-relaxed whitespace-pre-line mb-16">
          {product.description || 'Chưa có mô tả sản phẩm.'}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="max-w-3xl mb-16">
          {/* Avg rating bar */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-6 mb-8 p-5 bg-light-secondary/50">
              <div className="text-center">
                <p className="font-display text-5xl text-dark font-medium">{avgRating}</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {Array.from({length:5}, (_,i) => <FiStar key={i} size={13} className={i < Math.round(Number(avgRating)) ? 'fill-primary text-primary' : 'text-muted'} />)}
                </div>
                <p className="text-xs text-muted font-sans">{reviews.length} đánh giá</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs font-sans">
                      <span className="text-muted w-3">{star}</span>
                      <FiStar size={10} className="text-muted" />
                      <div className="flex-1 h-1.5 bg-light-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: reviews.length ? `${(count/reviews.length)*100}%` : '0%' }} />
                      </div>
                      <span className="text-muted w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Write review button */}
          {user && !reviewDone && (
            <div className="mb-6">
              {!showReviewForm ? (
                <button onClick={() => setShowReviewForm(true)}
                  className="btn-outline text-sm">
                  Viết Đánh Giá
                </button>
              ) : (
                <div className="border border-light-secondary p-5 mb-6">
                  <h4 className="font-serif text-base text-dark mb-4">Đánh giá của bạn</h4>
                  <div className="flex gap-1 mb-4">
                    {Array.from({length:5}, (_,i) => (
                      <button key={i}
                        onMouseEnter={() => setHoverRating(i+1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(i+1)}>
                        <FiStar size={24} className={i < (hoverRating || reviewRating) ? 'fill-primary text-primary' : 'text-muted'} />
                      </button>
                    ))}
                    <span className="text-xs text-muted font-sans ml-2 self-center">{reviewRating}/5 sao</span>
                  </div>
                  <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                    rows={4} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors resize-none mb-3" />
                  <div className="flex gap-3">
                    <button onClick={handleSubmitReview} disabled={reviewSending || !reviewComment.trim()}
                      className="btn-primary text-xs disabled:opacity-50">
                      {reviewSending ? 'Đang gửi...' : "Gửi Đánh Giá"}
                    </button>
                    <button onClick={() => setShowReviewForm(false)} className="text-xs text-muted hover:text-dark font-sans">Hủy</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {reviewDone && <p className="text-green-600 text-sm font-sans mb-4">✓ Cảm ơn bạn đã đánh giá sản phẩm!</p>}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="py-10 text-center text-muted font-sans text-sm">
              <p>Chưa có đánh giá nào.</p>
              {user && <p className="mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(r => (
                <div key={r.id} className="pb-6 border-b border-light-secondary last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-sans text-sm font-medium text-dark">{r.user_name}</span>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({length:5}, (_,i) => (
                          <FiStar key={i} size={11} className={i < r.rating ? 'fill-primary text-primary' : 'text-muted'} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted font-sans">{new Date(r.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p className="text-sm font-sans text-dark/80 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-light-secondary pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl text-dark">Bạn Cũng Có Thể Thích</h2>
            <Link to="/products" className="text-xs tracking-widest uppercase font-sans text-primary">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
