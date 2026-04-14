// Trang chính sách — vận chuyển, đổi trả, bảo hành, bảo mật, điều khoản
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Policy() {
  const { section } = useParams();
  const [active, setActive] = useState(section || 'shipping');

  useEffect(() => {
    if (section) setActive(section);
  }, [section]);

  const sections = [
    {
      id: 'shipping', title: "Giao Hàng Toàn Quốc",
      content: [
        { h: 'Thời gian giao hàng', body: 'NGOCVI Perfume hợp tác với các đơn vị vận chuyển cao cấp để đảm bảo mỗi sản phẩm đến tay quý khách đều giữ nguyên vẹn.\n\n• Nội thành TP.HCM & Hà Nội: Giao trong 24h – 48h (không tính Chủ Nhật và ngày Lễ).\n• Các tỉnh thành khác: 3 – 5 ngày làm việc.\n• Giao hàng hỏa tốc: Trong vòng 4h áp dụng cho các quận nội thành (có phụ phí).' },
        { h: 'Chi phí vận chuyển', body: '• Miễn phí vận chuyển cho đơn hàng từ 2.000.000 VNĐ trở lên.\n• Đồng giá 35.000 VNĐ cho các đơn hàng dưới 2.000.000 VNĐ toàn quốc.\n• Phí giao hàng hỏa tốc tính theo khoảng cách thực tế.' },
      ],
    },
    {
      id: 'return', title: "Đổi Trả & Hoàn Tiền",
      content: [
        { h: 'Điều kiện đổi trả', body: '• Đổi trả trong vòng 07 ngày kể từ ngày nhận hàng.\n• Sản phẩm còn nguyên vẹn, chưa qua sử dụng, còn nguyên tem mác và bao bì gốc.\n• Có hóa đơn mua hàng hoặc bằng chứng giao dịch từ NGOCVI.' },
        { h: 'Quy trình hoàn tiền', body: 'Sau khi nhận sản phẩm và kiểm tra đạt yêu cầu, chúng tôi hoàn tiền trong 5-7 ngày làm việc qua phương thức thanh toán ban đầu.' },
      ],
    },
    {
      id: 'warranty', title: "Bảo Hành Sản Phẩm",
      content: [
        { h: 'Bảo hành mùi hương', body: 'NGOCVI cam kết bảo hành mùi hương trọn đời — nếu mùi hương bị thay đổi bất thường trong quá trình sử dụng đúng cách, chúng tôi sẽ hỗ trợ đổi mới.' },
        { h: 'Bảo hành vỏ chai', body: 'Vỏ chai và cơ chế xịt được bảo hành 6 tháng kể từ ngày mua.' },
      ],
    },
    {
      id: 'privacy', title: "Chính Sách Bảo Mật",
      content: [
        { h: 'Thu thập thông tin', body: 'Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng: họ tên, địa chỉ, số điện thoại và email. Thông tin của bạn sẽ không bao giờ được bán hay chia sẻ với bên thứ ba.' },
        { h: 'Bảo mật dữ liệu', body: 'Tất cả thông tin được mã hóa theo tiêu chuẩn SSL/TLS. Mật khẩu được hash bằng bcrypt. Chúng tôi không lưu trữ thông tin thẻ tín dụng.' },
      ],
    },
    {
      id: 'terms', title: "Điều Khoản Sử Dụng",
      content: [
        { h: 'Điều khoản sử dụng', body: 'Khi sử dụng website và dịch vụ của NGOCVI, bạn đồng ý tuân thủ các điều khoản này. NGOCVI có quyền thay đổi điều khoản bất cứ lúc nào và sẽ thông báo trước ít nhất 7 ngày.' },
        { h: 'Giới hạn trách nhiệm', body: 'NGOCVI không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm không đúng hướng dẫn. Mọi khiếu nại cần được gửi trong vòng 30 ngày.' },
      ],
    },
  ];

  const current = sections.find(s => s.id === active) || sections[0];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl text-dark mb-3">Chính Sách & Điều Khoản</h1>
        <p className="text-muted font-sans text-sm max-w-xl mx-auto">
          Các chính sách dưới đây giúp bạn mua sắm minh bạch, an tâm và được bảo vệ đầy đủ quyền lợi.
        </p>
        <div className="w-12 h-px bg-primary mx-auto mt-4" />
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {sections.map(s => (
              <Link
                key={s.id}
                to={`/policy/${s.id}`}
                onClick={() => setActive(s.id)}
                className={`block w-full text-left px-4 py-3 text-sm font-sans transition-colors border-l-2 ${
                  active === s.id
                    ? 'border-primary text-primary bg-primary/5 font-medium'
                    : 'border-transparent text-muted hover:text-dark hover:border-light-secondary'
                }`}
              >
                {s.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <h2 className="font-serif text-2xl text-dark mb-6">{current.title}</h2>
          <div className="space-y-6">
            {current.content.map((item, i) => (
              <div key={i}>
                <h3 className="font-sans text-sm font-semibold text-dark mb-2">{item.h}</h3>
                <p className="font-sans text-sm text-dark/70 leading-relaxed whitespace-pre-line">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted font-sans mt-8 pt-6 border-t border-light-secondary">
            {"Cập nhật lần cuối"}: 01/01/2024
          </p>
        </div>
      </div>
    </div>
  );
}
