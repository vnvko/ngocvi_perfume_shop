// Trang liên hệ — thông tin cửa hàng, form liên hệ, bản đồ
import { useState } from 'react';
import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const stores = [
  {
    name: 'NGOCVI Boutique – Quận 1',
    address: '123 Lê Lợi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    phone: '1900-xxxx',
    hours: '09:00 – 21:00 (Mỗi ngày)',
  },
  {
    name: 'NGOCVI Boutique – Hoàn Kiếm',
    address: '45 Lý Thái Tổ, Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '024-XXXX-XXXX',
    hours: '09:00 – 21:30 (Mỗi ngày)',
  },
];

const channels = [
  { icon: '💬', title: 'Hỗ trợ Zalo', desc: 'Chat ngay với tư vấn viên' },
  { icon: '📱', title: 'Messenger', desc: 'Hỗ trợ trực tuyến 24/7' },
  { icon: '📞', title: 'Hotline', desc: '1900-xxxx (9:00 – 21:00)' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-52 md:h-64 overflow-hidden bg-dark">
        <img
          src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1400&q=80"
          alt="Liên hệ"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-2">Liên Hệ & Hệ Thống Cửa Hàng</h1>
          <p className="text-[11px] tracking-[0.3em] text-white/60 uppercase font-sans">Liên hệ & hệ thống cửa hàng</p>
          <div className="w-10 h-px bg-primary mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Stores */}
          <div>
            <h2 className="font-serif text-2xl text-dark mb-2">Hệ thống cửa hàng</h2>
            <p className="text-muted text-sm font-sans mb-6 italic">
              Ghé thăm chúng tôi để trải nghiệm mùi hương
            </p>
            <div className="space-y-4">
              {stores.map(store => (
                <div key={store.name} className="border-l-2 border-primary pl-5 py-1">
                  <h3 className="font-sans font-semibold text-dark mb-3">{store.name}</h3>
                  <div className="space-y-1.5 text-sm font-sans text-muted">
                    <div className="flex items-start gap-2">
                      <FiMapPin size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone size={13} className="text-primary flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={13} className="text-primary flex-shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                  <button className="mt-3 text-[11px] tracking-widest uppercase font-sans text-primary hover:text-primary-dark transition-colors flex items-center gap-1">
                    Chỉ Đường →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="border border-light-secondary p-7">
            <div className="mb-1">
              <p className="label-tag text-primary mb-1">Liên Hệ</p>
              <h2 className="font-serif text-2xl text-dark mb-1">Gửi lời nhắn cho chúng tôi</h2>
              <p className="text-muted text-sm font-sans leading-relaxed">
                Đội ngũ chuyên gia mùi hương của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm hương thơm hoàn hảo hoặc giải đáp mọi thắc mắc về đơn hàng.
              </p>
            </div>
            <hr className="border-light-secondary my-5" />

            {sent ? (
              <div className="py-8 text-center">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="font-serif text-xl text-dark mb-2">Đã gửi thành công!</h3>
                <p className="text-muted font-sans text-sm">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-tag block mb-1.5">Họ Và Tên</label>
                    <input
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="label-tag block mb-1.5">Số Điện Thoại</label>
                    <input
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="0909 xxx xxx"
                      className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-tag block mb-1.5">Email</label>
                  <input
                    type="Email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="label-tag block mb-1.5">Nội Dung Tin Nhắn</label>
                  <textarea
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    rows={4}
                    placeholder="Tôi cần tư vấn về..."
                    className="w-full border border-light-secondary px-4 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button type="submit" className="btn-primary w-full text-center">
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 relative h-64 md:h-80 bg-light-secondary overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-muted/30" />
            ))}
          </div>
          {/* Store pins */}
          <div className="absolute" style={{ left: '30%', top: '60%' }}>
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
              <FiMapPin size={12} className="text-white" />
            </div>
            <p className="text-[10px] font-sans text-dark mt-1 whitespace-nowrap bg-white px-1.5 py-0.5 shadow-sm">TP.HCM</p>
          </div>
          <div className="absolute" style={{ left: '60%', top: '30%' }}>
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
              <FiMapPin size={12} className="text-white" />
            </div>
            <p className="text-[10px] font-sans text-dark mt-1 whitespace-nowrap bg-white px-1.5 py-0.5 shadow-sm">Hà Nội</p>
          </div>
          <div className="absolute bottom-3 right-4">
            <span className="text-[10px] text-muted font-sans bg-white px-2 py-1 border border-light-secondary">Bản đồ cửa hàng</span>
          </div>
        </div>

        {/* Contact channels */}
        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-light-secondary pt-10">
          {channels.map(ch => (
            <div key={ch.title} className="text-center">
              <span className="text-3xl block mb-3">{ch.icon}</span>
              <h4 className="font-sans text-sm font-medium text-dark mb-1">{ch.title}</h4>
              <p className="text-xs text-muted font-sans">{ch.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
