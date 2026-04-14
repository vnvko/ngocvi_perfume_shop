// Trang viết đánh giá — backend: đơn hoàn tất + đã mua; có thể mở từ đơn (?orderId) hoặc từ sản phẩm
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { productAPI, reviewAPI, orderAPI } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function ReviewProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [product, setProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gate, setGate] = useState('loading'); // loading | ok | blocked | already
  const [blockMessage, setBlockMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const REVIEW_MEDIA_MAX = 30 * 1024 * 1024;
  const REVIEW_MEDIA_LIMIT = 5;

  const onPickMedia = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (!picked.length) return;
    const next = [...mediaFiles];
    for (const f of picked) {
      if (next.length >= REVIEW_MEDIA_LIMIT) break;
      if (f.size > REVIEW_MEDIA_MAX) {
        setError(`File "${f.name}" vượt quá 30MB.`);
        continue;
      }
      const ext = f.name.split('.').pop()?.toLowerCase();
      const img = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      const vid = ['mp4', 'webm', 'mov'].includes(ext);
      if (!img && !vid) {
        setError(`Định dạng không hỗ trợ: ${f.name}`);
        continue;
      }
      next.push(f);
    }
    setMediaFiles(next);
    setError('');
  };

  const removeMediaAt = (idx) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    let mounted = true;
    if (!slug) return undefined;

    setLoading(true);
    setError('');
    setGate('loading');
    setBlockMessage('');

    productAPI.getBySlug(slug)
      .then((prodRes) => {
        if (!mounted) return;
        const product = prodRes.data.product || prodRes.data;
        setProduct(product);
        return product;
      })
      .then((product) => {
        if (!product?.id) {
          if (mounted) { setGate('blocked'); setBlockMessage('Không tìm thấy sản phẩm.'); }
          return;
        }
        const eligibilityPromise = reviewAPI.getEligibility(product.id).then((r) => r.data || {});

        if (orderId) {
          return orderAPI.getDetail(orderId)
            .then((orderRes) => {
              if (!mounted) return;
              const order = orderRes.data?.order;
              if (!order) {
                setGate('blocked');
                setBlockMessage('Không tìm thấy đơn hàng. Vui lòng mở từ chi tiết đơn hàng.');
                return;
              }
              if (order.status !== 'completed') {
                setGate('blocked');
                setBlockMessage('Chỉ khi đơn hàng đã hoàn tất bạn mới có thể đánh giá sản phẩm từ đơn đó.');
                return;
              }
              const hasProduct = order.items?.some((item) => item.product_id === product.id);
              if (!hasProduct) {
                setGate('blocked');
                setBlockMessage('Sản phẩm này không có trong đơn hàng bạn chọn.');
                return;
              }
              setOrder(order);
              return eligibilityPromise;
            })
            .then((el) => {
              if (!mounted || !el) return;
              if (el.alreadyReviewed) {
                setGate('already');
              } else if (!el.hasPurchased) {
                setGate('blocked');
                setBlockMessage('Bạn chưa đủ điều kiện đánh giá sản phẩm này.');
              } else {
                setGate('ok');
              }
            });
        }

        return eligibilityPromise.then((el) => {
          if (!mounted) return;
          if (el.alreadyReviewed) {
            setGate('already');
          } else if (!el.hasPurchased) {
            setGate('blocked');
            setBlockMessage('Bạn cần mua và hoàn tất đơn hàng chứa sản phẩm này trước khi đánh giá.');
          } else {
            setGate('ok');
          }
        });
      })
      .catch(() => {
        if (mounted) {
          setProduct(null);
          setGate('blocked');
          setBlockMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [slug, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id || gate !== 'ok') return;
    if (!comment.trim()) {
      setError('Vui lòng nhập nhận xét để gửi đánh giá.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('product_id', String(product.id));
      fd.append('rating', String(rating));
      fd.append('comment', comment.trim());
      mediaFiles.forEach((f) => fd.append('media', f));
      await reviewAPI.create(fd);
      setSuccess('Cảm ơn bạn đã gửi đánh giá!');
      setComment('');
      setRating(5);
      setMediaFiles([]);
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

  if (gate === 'blocked') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-lg font-semibold text-red-700 mb-2">Không thể viết đánh giá</p>
          <p className="text-sm text-red-600 mb-4">{blockMessage || 'Bạn không đủ điều kiện để viết đánh giá sản phẩm này.'}</p>
          <Link to="/profile/orders" className="text-xs text-primary hover:underline">← Quay lại đơn hàng của tôi</Link>
        </div>
      </div>
    );
  }

  if (gate === 'already') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-semibold text-dark mb-2">Bạn đã đánh giá sản phẩm này</p>
        <p className="text-sm text-muted mb-6">Mỗi tài khoản chỉ gửi một đánh giá cho mỗi sản phẩm.</p>
        <Link to={`/products/${slug}`} className="btn-primary">Xem sản phẩm</Link>
      </div>
    );
  }

  if (gate !== 'ok') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-muted text-sm">Đang kiểm tra...</div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <Link to={`/products/${slug}`} className="text-xs text-primary hover:underline underline mb-3 inline-block">← Quay lại sản phẩm</Link>
      <div className="flex gap-6 mb-8">
        <div className="w-24 h-24 bg-light-secondary rounded overflow-hidden">
          {product.thumbnail ? <img src={mediaUrl(product.thumbnail)} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-dark">{product.name}</h1>
          <p className="text-sm text-muted mt-1">{product.brand_name || ''} • {product.category_name || ''}</p>
          <p className="text-lg font-bold text-primary mt-2">{fmtPrice(product.price)}</p>
          {order && (
            <p className="text-[11px] text-muted mt-2">Đơn hàng: <span className="text-primary font-medium">{order.order_code}</span></p>
          )}
        </div>
      </div>

      <div className="border border-light-secondary rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Viết đánh giá</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              return (
                <button key={value} type="button" onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)} onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl">
                  <FiStar className={value <= (hoverRating || rating) ? 'fill-primary text-primary' : 'text-gray-300'} />
                </button>
              );
            })}
            <span className="text-sm text-muted">{rating} sao</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            className="w-full border border-light-secondary rounded p-3 mb-3 outline-none focus:border-primary transition-colors"
          />
          <div className="mb-4">
            <p className="text-xs text-muted mb-2">Ảnh hoặc video đính kèm (tối đa {REVIEW_MEDIA_LIMIT} file, mỗi file ≤ 30MB — jpg, png, webp, gif, mp4, webm, mov)</p>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,.mov" multiple
              onChange={onPickMedia}
              className="text-xs w-full font-sans file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary" />
            {mediaFiles.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-dark">
                {mediaFiles.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} className="flex items-center justify-between gap-2 bg-light-secondary/40 rounded px-2 py-1">
                    <span className="truncate">{f.name} ({(f.size / (1024 * 1024)).toFixed(1)} MB)</span>
                    <button type="button" onClick={() => removeMediaAt(idx)} className="text-red-600 shrink-0 hover:underline">Xóa</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mb-2">{success}</p>}
          <button type="submit" disabled={submitting || !comment.trim()}
            className="btn-primary w-full text-center">
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      </div>
    </div>
  );
}
