// Trang viết đánh giá sản phẩm sau khi mua hàng
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { productAPI, reviewAPI, orderAPI } from '../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function ReviewProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [product, setProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load product & verify purchase
  useEffect(() => {
    let mounted = true;
    if (!slug) return;
    setLoading(true);
    setError('');

    Promise.all([
      productAPI.getBySlug(slug),
      orderId ? orderAPI.getDetail(orderId) : Promise.resolve(null)
    ])
      .then(([prodRes, orderRes]) => {
        if (!mounted) return;
        const product = prodRes.data.product || prodRes.data;
        setProduct(product);

        // Verify purchase if orderId provided
        if (orderId && orderRes?.data?.order) {
          const order = orderRes.data.order;
          // Check: order must be completed & contain this product
          if (order.status !== 'completed') {
            setError('Chỉ có thể đánh giá sản phẩm khi đơn hàng đã hoàn tất.');
            setVerified(false);
          } else {
            const hasProduct = order.items?.some(item => item.product_id === product.id);
            if (!hasProduct) {
              setError('Sản phẩm này không có trong đơn hàng của bạn.');
              setVerified(false);
            } else {
              setOrder(order);
              setVerified(true);
              setError('');
            }
          }
        } else if (orderId) {
          setError('Không tìm thấy đơn hàng. Vui lòng quay lại từ chi tiết đơn hàng.');
          setVerified(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setProduct(null);
          setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [slug, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) return;
    if (!comment.trim()) {
      setError('Vui lòng nhập nhận xét để gửi đánh giá.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await reviewAPI.create({ product_id: product.id, rating, comment });
      setSuccess('Cảm ơn bạn đã gửi đánh giá!');
      setComment('');
      setRating(5);
      setTimeout(() => navigate(`/products/${slug}`), 1400);
    } catch (err) {
      setError(err?.message || 'Không thể gửi đánh giá, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">Đang tải...</div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold">Không tìm thấy sản phẩm để đánh giá.</p>
        <Link to="/products" className="btn-primary mt-4">Quay lại cửa hàng</Link>
      </div>
    );
  }

  // Show error if verification failed
  if (orderId && !verified) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-lg font-semibold text-red-700 mb-2">Không thể viết đánh giá</p>
          <p className="text-sm text-red-600 mb-4">{error || 'Bạn không đủ điều kiện để viết đánh giá sản phẩm này.'}</p>
          <Link to="/profile/orders" className="text-xs text-primary hover:underline">← Quay lại đơn hàng của tôi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <Link to={`/products/${slug}`} className="text-xs text-primary hover:underline underline mb-3 inline-block">← Quay lại sản phẩm</Link>
      <div className="flex gap-6 mb-8">
        <div className="w-24 h-24 bg-light-secondary rounded overflow-hidden">
          {product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-dark">{product.name}</h1>
          <p className="text-sm text-muted mt-1">{product.brand_name || ''} • {product.category_name || ''}</p>
          <p className="text-lg font-bold text-primary mt-2">{fmtPrice(product.price)}</p>
        </div>
      </div>

      <div className="border border-light-secondary rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Viết đánh giá</h2>
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button key={value} type="button" onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)} onMouseLeave={() => setHoverRating(0)}
                className={"text-2xl"}>
                <FiStar className={value <= (hoverRating || rating) ? 'fill-primary text-primary' : 'text-gray-300'} />
              </button>
            );
          })}
          <span className="text-sm text-muted">{rating} sao</span>
        </div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={5}
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
          className="w-full border border-light-secondary rounded p-3 mb-3 outline-none focus:border-primary transition-colors"
        />
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-2">{success}</p>}
        <button onClick={handleSubmit} disabled={submitting || !comment.trim()}
          className="btn-primary w-full text-center">
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>
    </div>
  );
}
