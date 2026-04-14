// Trang thanh toán — form giao hàng, voucher, chọn phương thức, đặt hàng
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiLock, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI, voucherAPI } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

const STEPS = ['Giỏ hàng', 'Thanh toán', 'Hoàn tất'];
const PROVINCES = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Bình Dương'];
const DISTRICTS = {
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 7', 'Bình Thạnh'],
  'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Cầu Giấy'],
};

const paymentMethods = [
  { id: 'COD', icon: '🚚', title: "Thanh toán khi nhận hàng (COD)", desc: "Thanh toán tiền mặt cho shipper" },
  { id: 'ONLINE', icon: '💳', title: "Online", desc: "Thẻ ATM / Visa / Master / QR Code" },
];

const shippingMethods = [
  { id: 'standard', title: "Tiêu chuẩn", desc: "Giao hàng 3-5 ngày làm việc", price: 0 },
  { id: 'express', title: "Hỏa tốc", desc: "Giao hàng trong 24h (Nội thành)", price: 30000 },
];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', email: user?.email || '',
    address: '', province: '', district: '',
  });
  const [payment, setPayment] = useState('COD');
  const [shipping, setShipping] = useState('standard');
  const [note, setNote] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [done, setDone] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  // Đồng bộ với backend: COD +35k; hỏa tốc +30k thêm
  const shippingCost = (payment === 'COD' ? 35000 : 0) + (shipping === 'express' ? 30000 : 0);
  const discount = voucherData?.discountAmount || 0;
  const total = cartTotal + shippingCost - discount;

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const checkVoucher = async () => {
    setVoucherError('');
    try {
      const res = await voucherAPI.check({ code: voucherCode, order_value: cartTotal });
      setVoucherData(res.data);
    } catch (err) {
      setVoucherError(err.message);
      setVoucherData(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || !form.province) {
      setOrderError('Vui lòng điền đầy đủ thông tin giao hàng'); return;
    }
    if (!cartItems.length) { setOrderError('Giỏ hàng trống'); return; }
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); return; }

    setLoading(true);
    setOrderError('');
    try {
      const items = cartItems.map(item => ({
        product_id: item.product_id || item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await orderAPI.create({
        items,
        shipping_address: `${form.address}, ${form.district}, ${form.province}`,
        payment_method: payment,
        shipping_method: shipping,
        voucher_id: voucherData?.voucher?.id || null,
      });

      setOrderCode(res.data.order_code);
      setDone(true);
      await clearCart();
    } catch (err) {
      setOrderError(err.message || 'Đặt hàng thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (done) return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck size={36} className="text-green-600" />
        </div>
        <h1 className="font-display text-3xl text-dark mb-3">{"Đặt Hàng Thành Công!"}</h1>
        <p className="text-muted font-sans text-sm mb-2">Mã đơn hàng của bạn:</p>
        <p className="font-sans text-xl font-semibold text-primary mb-6">{orderCode}</p>
        <p className="text-muted font-sans text-sm mb-8">Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/profile/orders" className="btn-primary">{"Xem tất cả đơn hàng"}</Link>
          <Link to="/" className="btn-outline">{"Về Trang Chủ"}</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="border-b border-light-secondary py-4 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-serif text-xl tracking-[0.2em]">NGOCVI</Link>
          <div className="hidden md:flex items-center text-[10px] tracking-widest uppercase font-sans text-muted gap-2">
            <FiLock size={11} /> Thanh toán bảo mật
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="border-b border-light-secondary py-4 px-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-sans font-medium transition-all ${
                i === 0 ? 'border-muted bg-muted text-white' :
                i === 1 ? 'border-primary bg-primary text-white' :
                'border-light-secondary text-muted'
              }`}>
                {i === 0 ? <FiCheck size={12} /> : i + 1}
              </div>
              <span className={`text-[11px] tracking-widest uppercase font-sans font-medium hidden sm:block ${i === 1 ? 'text-primary' : 'text-muted'}`}>{step}</span>
              {i < STEPS.length - 1 && <FiChevronRight size={14} className="text-muted ml-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 space-y-8">

            {/* Shipping info */}
            <section>
              <h2 className="font-serif text-xl text-dark mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary inline-block" /> Thông Tin Giao Hàng
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label-tag block mb-1.5">Họ và Tên *</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nguyễn Văn A"
                    className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-tag block mb-1.5">Số Điện Thoại *</label>
                    <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0901234567"
                      className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="label-tag block mb-1.5">Email</label>
                    <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="example@email.com"
                      className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="label-tag block mb-1.5">Địa Chỉ *</label>
                  <input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Số nhà, tên đường"
                    className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-tag block mb-1.5">Tỉnh / Thành Phố *</label>
                    <select value={form.province} onChange={e => update('province', e.target.value)}
                      className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors cursor-pointer">
                      <option value="">Chọn tỉnh / thành phố</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-tag block mb-1.5">Quận / Huyện</label>
                    <select value={form.district} onChange={e => update('district', e.target.value)}
                      className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors cursor-pointer">
                      <option value="">Chọn quận / huyện</option>
                      {(DISTRICTS[form.province] || []).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="font-serif text-xl text-dark mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary inline-block" /> Phương Thức Vận Chuyển
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shippingMethods.map(m => (
                  <label key={m.id} className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-all ${shipping === m.id ? 'border-primary bg-primary/5' : 'border-light-secondary hover:border-primary/40'}`}>
                    <input type="radio" name="Giao Hàng Toàn Quốc" value={m.id} checked={shipping === m.id} onChange={() => setShipping(m.id)} className="mt-0.5 accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-sans font-medium text-dark">{m.title}</span>
                        <span className={`text-sm font-sans font-medium ${m.price === 0 ? 'text-primary' : 'text-dark'}`}>
                          {m.price === 0 ? 'Miễn phí' : fmtPrice(m.price)}
                        </span>
                      </div>
                      <p className="text-xs text-muted font-sans mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-serif text-xl text-dark mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary inline-block" /> Phương Thức Thanh Toán
              </h2>
              <div className="space-y-3">
                {paymentMethods.map(m => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${payment === m.id ? 'border-primary bg-primary/5' : 'border-light-secondary hover:border-primary/40'}`}>
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-sans font-medium text-dark">{m.title}</p>
                      <p className="text-xs text-muted font-sans">{m.desc}</p>
                    </div>
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="accent-primary" />
                  </label>
                ))}
              </div>
            </section>

            {/* Note */}
            <section>
              <h2 className="font-serif text-xl text-dark mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary inline-block" /> Ghi Chú Đơn Hàng
              </h2>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                placeholder="Ví dụ: Giao hàng trong giờ hành chính..."
                className="w-full border border-light-secondary px-4 py-3 text-sm font-sans outline-none focus:border-primary transition-colors resize-none" />
            </section>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-light-secondary p-6 sticky top-24">
              <h3 className="font-serif text-xl text-dark mb-5">Đơn Hàng ({cartItems.length})</h3>

              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-white overflow-hidden">
                      {item.thumbnail ? <img src={mediaUrl(item.thumbnail)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-dark text-white text-[9px] rounded-full flex items-center justify-center font-sans">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-dark font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-muted font-sans">{item.volume_ml ? `${item.volume_ml}ml` : item.size}</p>
                    </div>
                    <span className="text-sm font-sans font-medium text-dark flex-shrink-0">{fmtPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Voucher */}
              <div className="flex gap-2 mb-4">
                <input type="text" value={voucherCode} onChange={e => setVoucherCode(e.target.value)}
                  placeholder="Mã giảm giá"
                  className="flex-1 border border-light-secondary bg-white px-3 py-2 text-sm font-sans outline-none focus:border-primary transition-colors" />
                <button onClick={checkVoucher} className="bg-dark text-white text-xs tracking-widest uppercase font-sans px-4 hover:bg-primary transition-colors">
                  Áp Dụng
                </button>
              </div>
              {voucherData && <p className="text-xs text-green-600 font-sans mb-2">✓ Giảm {fmtPrice(voucherData.discountAmount)}</p>}
              {voucherError && <p className="text-xs text-red-500 font-sans mb-2">{voucherError}</p>}

              <div className="border-t border-light-secondary pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted">Tạm tính</span>
                  <span>{fmtPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-muted">Phí giao hàng (COD / hỏa tốc)</span>
                  <span className={shippingCost === 0 ? 'text-primary font-medium' : ''}>{shippingCost === 0 ? 'Miễn phí' : fmtPrice(shippingCost)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-muted">Giảm giá</span>
                    <span className="text-primary">-{fmtPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-light-secondary pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-sans font-semibold text-dark">Tổng cộng</span>
                  <span className="font-sans text-xl font-semibold text-primary">{fmtPrice(total)}</span>
                </div>
              </div>

              {orderError && <p className="text-xs text-red-500 font-sans mb-3">{orderError}</p>}

              <button onClick={handleSubmit} disabled={loading || !cartItems.length}
                className="btn-primary w-full text-center disabled:opacity-60">
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
              <p className="text-[10px] text-muted font-sans text-center mt-3">
                Bằng cách đặt hàng, bạn đồng ý với <a href="#" className="underline">Điều khoản</a> của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
