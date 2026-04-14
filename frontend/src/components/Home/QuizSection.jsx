// Section CTA dẫn vào trang Quiz tìm mùi hương phù hợp
import { Link } from 'react-router-dom';

export default function QuizSection() {
  return (
    <section className="section-space bg-dark text-white">
      <div className="site-container text-center">
        <h2 className="font-display text-3xl md:text-4xl mb-4">{"Bạn chưa biết mùi hương phù hợp?"}</h2>
        <p className="text-white/60 font-sans text-sm mb-8 max-w-md mx-auto">{"Thử ngay bài trắc nghiệm để chúng tôi tư vấn riêng cho bạn"}</p>
        <Link to="/quiz" className="inline-block bg-primary text-white font-sans text-xs tracking-widest uppercase px-10 py-4 hover:bg-primary-dark transition-colors">
          {"Bắt Đầu Quiz"}
        </Link>
      </div>
    </section>
  );
}
