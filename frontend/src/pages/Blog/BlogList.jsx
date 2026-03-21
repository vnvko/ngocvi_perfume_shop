// Trang danh sách blog — filter danh mục, tìm kiếm, pagination
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { blogAPI } from '../../services/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    setLoading(true);
    const params = { page, limit };
    if (search) params.search = search;
    if (activeCategory) params.category = activeCategory;

    blogAPI.getAll(params)
      .then(res => {
        setBlogs(res.data.blogs || []);
        setCategories(res.data.categories || []);
        setTotal(res.data.pagination?.total || 0);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [page, search, activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-52 md:h-72 overflow-hidden bg-dark">
        <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=80"
          alt="Perfume Journal" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="font-display text-3xl md:text-5xl tracking-wider mb-2">Perfume Journal</h1>
          <p className="font-display italic text-primary/90 text-lg">The Art of Fragrance</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-light-secondary pb-6">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-1">
            <button onClick={() => { setActiveCategory(''); setPage(1); }}
              className={`text-[11px] tracking-widest uppercase font-sans font-medium whitespace-nowrap pb-0.5 border-b-[1.5px] transition-all ${!activeCategory ? 'text-dark border-dark' : 'text-muted border-transparent hover:text-dark'}`}>
              ALL
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
                className={`text-[11px] tracking-widest uppercase font-sans font-medium whitespace-nowrap pb-0.5 border-b-[1.5px] transition-all ${activeCategory === cat.slug ? 'text-dark border-dark' : 'text-muted border-transparent hover:text-dark'}`}>
                {cat.name}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="relative flex-shrink-0">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="border border-light-secondary bg-light pl-9 pr-4 py-2 text-sm font-sans outline-none focus:border-primary transition-colors w-48" />
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-light-secondary mb-4" />
                <div className="h-3 bg-light-secondary rounded mb-2 w-1/3" />
                <div className="h-4 bg-light-secondary rounded mb-2 w-3/4" />
                <div className="h-3 bg-light-secondary rounded w-full" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {blogs.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <div className="overflow-hidden aspect-[4/3] mb-4">
                  {post.thumbnail ? (
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-light-secondary flex items-center justify-center text-muted text-sm font-sans">Chưa có ảnh</div>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="label-tag text-primary">{post.category_name}</span>
                  <span className="text-muted text-[10px]">·</span>
                  <span className="label-tag">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <h3 className="font-serif text-dark text-[17px] leading-snug mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <span className="text-[11px] tracking-widest uppercase font-sans text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <FiArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted font-sans">
            <p>Không tìm thấy bài viết nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 border text-xs font-sans transition-colors ${p === page ? 'border-primary bg-primary text-white' : 'border-light-secondary text-dark hover:border-primary'}`}>
                {p}
              </button>
            ))}
            {page < totalPages && (
              <button onClick={() => setPage(p => p + 1)} className="w-9 h-9 border border-light-secondary text-xs text-muted font-sans hover:border-primary">→</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
