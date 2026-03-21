// Trang chi tiết đơn hàng của user — timeline trạng thái, sản phẩm, địa chỉ
import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight, FiCheck, FiTruck, FiPackage, FiFlag } from 'react-icons/fi';
import { orderAPI } from '../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

const stepOrder = ['pending', 'confirmed', 'shipping', 'completed'];
const steps = [
  { id: 'pending',   label: "Đã đặt hàng",  icon: FiPackage },
  { id: 'confirmed', label: "Đã xác nhận",   icon: FiCheck },
  { id: 'shipping',  label: "Đang giao hàng", icon: FiTruck },
  { id: 'completed', label: "Hoàn thành",     icon: FiFlag },
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    orderAPI.getDetail(orderId)
      .then(res => setOrder(res.data.order))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16 animate-pulse space-y-6">
      <div className="h-8 bg-light-secondary rounded w-1/3" />
      <div className="h-24 bg-light-secondary rounded" />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-48 bg-light-secondary rounded" />
        <div className="h-48 bg-light-secondary rounded" />
      </div>
    </div>
  );

  if (notFound) return <Navigate to="/profile/orders" replace />;
  if (!order) return null;

  const currentStep = stepOrder.indexOf(order.status);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <nav className="text-xs font-sans text-muted flex items-center gap-1.5 mb-6">
        <Link to="/" className="hover:text-dark">Trang chủ</Link>
        <FiChevronRight size={11} />
        <Link to="/profile" className="hover:text-dark">Tài khoản</Link>
        <FiChevronRight size={11} />
        <Link to="/profile/orders" className="hover:text-dark">Đơn hàng</Link>
        <FiChevronRight size={11} />
        <span className="text-dark">{order.order_code}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-dark">
            Chi Tiết Đơn Hàng <span className="text-primary">{order.order_code}</span>
          </h1>
          <p className="text-muted text-sm font-sans mt-1">
            Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <Link to="/profile/orders" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-muted hover:text-dark transition-colors">
          <FiArrowLeft size={13} /> Quay lại
        </Link>
      </div>

      {/* Status timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-light-secondary/50 border border-light-secondary p-6 mb-8">
          <div className="flex items-start justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-px border-t border-dashed border-muted/30 mx-12 hidden md:block" />
            {steps.map((step, i) => {
              const Icon = step.icon;
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center text-center flex-1 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all mb-2 ${
                    active ? 'border-primary bg-primary text-white' :
                    done  ? 'border-primary/50 bg-white text-primary' :
                            'border-light-secondary bg-white text-muted'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <p className={`text-xs font-sans font-medium ${active ? 'text-primary' : done ? 'text-dark' : 'text-muted'}`}>{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 px-5 py-3 mb-8 text-sm font-sans text-red-600">
          Đơn hàng này đã bị hủy.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: items + summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-light-secondary">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-[10px] tracking-widest uppercase font-sans text-muted bg-light-secondary/50">
              <div className="col-span-5">Sản Phẩm</div>
              <div className="col-span-2 text-center">Dung Tích</div>
              <div className="col-span-2 text-right">Đơn Giá</div>
              <div className="col-span-1 text-center">SL</div>
              <div className="col-span-2 text-right">Thành Tiền</div>
            </div>
            {(order.items || []).map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-t border-light-secondary first:border-0">
                <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                  <div className="w-14 h-14 bg-light-secondary flex-shrink-0 overflow-hidden">
                    {item.thumbnail ? <img src={item.thumbnail} alt={item.product_name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-light-secondary" />}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-dark">{item.product_name}</p>
                    <p className="text-xs text-muted font-sans md:hidden">{item.volume_ml}ml · {fmtPrice(item.price)}</p>                      {order.status === 'completed' && (
                        <Link to={`/products/${item.product_slug || ''}`} className="text-xs text-primary hover:underline">Viết đánh giá</Link>
                      )}                  </div>
                </div>
                <div className="hidden md:block col-span-2 text-sm font-sans text-muted text-center">{item.volume_ml}ml</div>
                <div className="hidden md:block col-span-2 text-sm font-sans text-dark text-right">{fmtPrice(item.price)}</div>
                <div className="hidden md:block col-span-1 text-sm font-sans text-dark text-center">{item.quantity}</div>
                <div className="hidden md:block col-span-2 text-sm font-sans font-semibold text-primary text-right">{fmtPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border border-light-secondary p-5">
            <div className="flex justify-end">
              <div className="w-full md:w-72 space-y-2.5">
                {[
                  ["Tạm tính", fmtPrice(order.total_price - (order.shipping_fee || 0) + (order.discount || 0))],
                  ["Phí vận chuyển", (order.shipping_fee || 0) === 0 ? 'Miễn phí' : fmtPrice(order.shipping_fee)],
                  order.discount > 0 ? ["Giảm giá", `-${fmtPrice(order.discount)}`] : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm font-sans">
                    <span className="text-muted">{k}</span>
                    <span className={v === 'Miễn phí' ? 'text-primary font-medium' : 'text-dark'}>{v}</span>
                  </div>
                ))}
                <div className="border-t border-light-secondary pt-3 flex justify-between">
                  <span className="font-sans font-semibold text-dark">Tổng cộng</span>
                  <span className="font-sans text-lg font-semibold text-primary">{fmtPrice(order.total_price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: shipping + payment */}
        <div className="space-y-4">
          <div className="border border-light-secondary p-5">
            <h3 className="font-serif text-base text-dark mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary inline-block" /> Thông tin giao hàng
            </h3>
            <div className="space-y-1 text-sm font-sans">
              <p className="font-medium text-dark">{order.customer_name}</p>
              <p className="text-muted">{order.customer_phone}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-light-secondary">
              <p className="text-xs tracking-widest uppercase font-sans text-muted mb-1">Phương thức thanh toán</p>
              <p className="text-sm font-sans text-dark">{order.payment_method === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán Online'}</p>
            </div>
          </div>

          {order.history?.length > 0 && (
            <div className="border border-light-secondary p-5">
              <h3 className="font-serif text-base text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary inline-block" /> Lịch sử trạng thái
              </h3>
              <div className="space-y-2.5">
                {order.history.map((h, i) => (
                  <div key={i} className="flex gap-2 text-xs font-sans">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-dark font-medium capitalize">{h.status}</span>
                      <span className="text-muted ml-2">{new Date(h.updated_at).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
