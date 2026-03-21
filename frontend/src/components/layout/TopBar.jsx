// Thanh thông báo trên cùng — hotline, chính sách, mạng xã hội
import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <div className="bg-dark text-white py-2 px-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <p className="text-[10px] tracking-widest font-sans uppercase text-white/70 hidden md:block">
          {"Miễn phí vận chuyển cho đơn từ 500K"}
        </p>
        <p className="text-[10px] tracking-widest font-sans uppercase text-white/70 md:hidden">
          {"100% Hàng Chính Hãng"}
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-sans text-white/70 tracking-wide">{"Hotline: 1900-xxxx"}</span>
          <Link to="/contact" className="text-[10px] font-sans text-primary/90 tracking-widest uppercase hover:text-primary transition-colors">
            {"100% Hàng Chính Hãng"}
          </Link>
        </div>
      </div>
    </div>
  );
}
