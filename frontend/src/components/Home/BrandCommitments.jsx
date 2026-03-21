// 4 cam kết thương hiệu — Chính hãng, Đổi trả, Giao hàng, Tư vấn

export default function BrandCommitments() {
  const items = [
    { icon: '✓', title: "100% Hàng Chính Hãng", desc: "Cam kết hàng thật, có tem chống giả" },
    { icon: '↩', title: "7 Ngày Đổi Trả",  desc: "Đổi trả trong 7 ngày nếu sản phẩm lỗi" },
    { icon: '🚚', title: "Giao Hàng Toàn Quốc", desc: "Giao hàng nhanh toàn quốc 3-5 ngày" },
    { icon: '💬', title: "Tư Vấn Miễn Phí",  desc: "Đội ngũ tư vấn 9:00–21:00 mỗi ngày" },
  ];
  
  return (
    <section className="border-t border-light-secondary">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-light-secondary">
          {items.map(item => (
            <div key={item.title} className="py-8 px-6 text-center">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-sans text-xs tracking-widest uppercase font-medium text-dark mb-1.5">{item.title}</h3>
              <p className="text-muted text-xs font-sans leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
