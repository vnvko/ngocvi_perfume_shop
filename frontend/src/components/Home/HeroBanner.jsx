// Hero Banner — slideshow tự động, lấy banner từ API, fallback nếu chưa có data
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../utils/mediaUrl';
import { bannerAPI } from '../../services/api';

const fallbackSlides = [
  { id: 1, title: 'Khám phá nghệ thuật\nhương thơm', subtitle: 'TINH TẾ – ĐẲNG CẤP – CÁ NHÂN HÓA', cta: 'Khám Phá Ngay', link: '/products', image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=90' },
  { id: 2, title: 'Bộ Sưu Tập\nMùa Mới', subtitle: 'HƯƠNG THƠM – CẢM XÚC – KỶ NIỆM', cta: 'Xem Bộ Sưu Tập', link: '/products', image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&q=90' },
];

export default function HeroBanner() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    bannerAPI.getActive()
      .then(res => { if (res.data.banners?.length) setSlides(res.data.banners); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative h-[clamp(420px,72vh,860px)] overflow-hidden">
      {slides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={mediaUrl(s.image_url)} alt={s.title || 'Banner'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-dark/30 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="site-container w-full">
          <div className="max-w-lg">
            {slide.subtitle && <p className="text-primary text-[11px] tracking-[0.4em] uppercase font-sans mb-4 opacity-0 animate-[fadeInUp_0.8s_0.2s_forwards]">{slide.subtitle}</p>}
            <h1 className="text-white font-display text-4xl md:text-6xl leading-tight mb-8 whitespace-pre-line opacity-0 animate-[fadeInUp_0.8s_0.4s_forwards]">
              {slide.title}
            </h1>
            <div className="opacity-0 animate-[fadeInUp_0.8s_0.6s_forwards]">
              <Link to={slide.link || '/products'} className="btn-primary">{slide.cta || 'Khám Phá Ngay'}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/50'}`} />
        ))}
      </div>

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}
