// Trang trắc nghiệm — 5 câu hỏi tìm mùi phù hợp, kết quả gợi ý sản phẩm
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

const priceRanges = {
  budget:  { maxPrice: 1500000 },
  mid:     { minPrice: 1500000, maxPrice: 3000000 },
  premium: { minPrice: 3000000 },
};

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function Quiz() {

  const quizQuestions = [
    { id: 1, key: 'q1', options: [
      { id:'a', icon:'♂', textKey:'opt_male',  tag:'male' },
      { id:'b', icon:'♀', textKey:'opt_female',tag:'female' },
      { id:'c', icon:'⚧', textKey:'opt_unisex',tag:'unisex' },
    ]},
    { id: 2, key: 'q2', options: [
      { id:'a', icon:'🌸', textKey:'opt_floral',   tag:'floral' },
      { id:'b', icon:'🌲', textKey:'opt_woody',    tag:'woody' },
      { id:'c', icon:'🍋', textKey:'opt_citrus',   tag:'citrus' },
      { id:'d', icon:'🌙', textKey:'opt_oriental', tag:'oriental' },
    ]},
    { id: 3, key: 'q3', options: [
      { id:'a', icon:'☀️', textKey:'opt_daily',   tag:'daily' },
      { id:'b', icon:'🌙', textKey:'opt_evening', tag:'evening' },
      { id:'c', icon:'🏃', textKey:'opt_sport',   tag:'sport' },
      { id:'d', icon:'🎉', textKey:'opt_special', tag:'special' },
    ]},
    { id: 4, key: 'q4', options: [
      { id:'a', icon:'🌊', textKey:'opt_light',    tag:'light' },
      { id:'b', icon:'💧', textKey:'opt_moderate', tag:'moderate' },
      { id:'c', icon:'🔥', textKey:'opt_long',     tag:'longlasting' },
    ]},
    { id: 5, key: 'q5', options: [
      { id:'a', icon:'💚', textKey:'opt_budget',  tag:'budget' },
      { id:'b', icon:'💛', textKey:'opt_mid',     tag:'mid' },
      { id:'c', icon:'💎', textKey:'opt_premium', tag:'premium' },
    ]},
  ];

  const [screen, setScreen] = useState('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnswer = async (option) => {
    const newAnswers = { ...answers, [quizQuestions[currentQ].id]: option };
    setAnswers(newAnswers);
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setScreen('result');
      setLoading(true);
      try {
        const genderAns = Object.values(newAnswers).find(a => ['male','female','unisex'].includes(a.tag));
        const priceAns  = Object.values(newAnswers).find(a => ['budget','mid','premium'].includes(a.tag));
        const params = { limit: 4, sort: 'rating' };
        if (genderAns) params.gender = genderAns.tag;
        if (priceAns && priceRanges[priceAns.tag]) Object.assign(params, priceRanges[priceAns.tag]);
        const res = await productAPI.getAll(params);
        setResults(res.data || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }
  };

  const restart = () => { setScreen('start'); setCurrentQ(0); setAnswers({}); setResults([]); };
  const progress = (currentQ / quizQuestions.length) * 100;

  if (screen === 'start') return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg text-center">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="font-display text-4xl md:text-5xl text-dark mb-4 leading-tight">
          {"Yêu Thích"} <em className="text-primary">{"titleHighlight"}</em>
        </h1>
        <p className="font-sans text-muted text-sm leading-relaxed mb-8 max-w-sm mx-auto">{"subtitle"}</p>
        <button onClick={() => setScreen('quiz')} className="btn-primary text-sm px-10 py-3.5">{"Bắt Đầu Ngay"}</button>
        <p className="text-muted text-xs font-sans mt-4">{"Chỉ mất khoảng 1 phút"}</p>
      </div>
    </div>
  );

  if (screen === 'quiz') {
    const q = quizQuestions[currentQ];
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-sans text-muted mb-2">
            <span>{"question"}</span>
            <span>{Math.round(progress)}{"progress"}</span>
          </div>
          <div className="h-1.5 bg-light-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-dark text-center mb-10">{t(`quiz.${q.key}`)}</h2>
        <div className={`grid gap-4 ${q.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {q.options.map(opt => (
            <button key={opt.id} onClick={() => handleAnswer(opt)}
              className="group flex flex-col items-center gap-3 p-6 border-2 border-light-secondary hover:border-primary hover:bg-primary/5 transition-all text-center">
              <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
              <span className="font-sans text-sm text-dark font-medium">{t(`quiz.${opt.textKey}`)}</span>
            </button>
          ))}
        </div>
        {currentQ > 0 && (
          <button onClick={() => setCurrentQ(q => q-1)} className="mt-8 text-xs text-muted hover:text-dark font-sans flex items-center gap-1 mx-auto">
            ← {"prev"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-3xl md:text-4xl text-dark mb-3">{"Gợi Ý Dành Riêng Cho Bạn"}</h2>
        <p className="text-muted font-sans text-sm">{"Dựa trên câu trả lời của bạn"}</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse"><div className="aspect-square bg-light-secondary mb-3" /><div className="h-3 bg-light-secondary rounded w-2/3 mb-2" /></div>)}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {results.map(p => (
            <Link key={p.id} to={`/products/${p.slug}`} className="group">
              <div className="aspect-square bg-light-secondary overflow-hidden mb-3">
                {p.thumbnail
                  ? <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-muted text-xs">No image</div>
                }
              </div>
              <p className="label-tag mb-0.5">{p.brand_name}</p>
              <p className="font-serif text-dark text-sm group-hover:text-primary transition-colors">{p.name}</p>
              <p className="text-primary font-sans font-medium text-sm mt-1">{fmtPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted font-sans py-8">{"Chưa tìm được kết quả phù hợp."}</div>
      )}
      <div className="flex gap-4 justify-center">
        <button onClick={restart} className="btn-outline">{"Làm Lại Quiz"}</button>
        <Link to="/products" className="btn-primary">{"Xem tất cả"}</Link>
      </div>
    </div>
  );
}
