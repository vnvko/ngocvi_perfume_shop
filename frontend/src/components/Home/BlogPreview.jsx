// Preview 3 bài blog mới nhất từ API
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { blogAPI } from '../../services/api';
import { mediaUrl } from '../../utils/mediaUrl';

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getAll({ limit: 3 })
      .then(res => setPosts(res.data.blogs?.slice(0, 3) || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="section-space site-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[1,2,3].map(i => <div key={i} className="animate-pulse"><div className="aspect-[4/3] bg-light-secondary mb-4" /><div className="h-3 bg-light-secondary rounded mb-2 w-1/3" /><div className="h-5 bg-light-secondary rounded w-3/4" /></div>)}
      </div>
    </section>
  );

  if (!posts.length) return null;

  return (
    <section className="section-space site-container">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="section-title text-left">Nhật ký nước hoa</h2>
          <p className="text-muted text-sm font-sans mt-2">Kiến thức & xu hướng nước hoa mới nhất</p>
        </div>
        <Link to="/blog" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-primary hover:text-primary-dark transition-colors">
          Xem tất cả <FiArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {posts.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group">
            <div className="overflow-hidden aspect-[4/3] mb-4">
              {post.thumbnail ? (
                <img src={mediaUrl(post.thumbnail)} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-light-secondary flex items-center justify-center text-muted text-xs font-sans">Bài viết</div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                {post.category_name && <span className="label-tag text-primary">{post.category_name}</span>}
                <span className="text-muted text-[10px]">·</span>
                <span className="label-tag">{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
              <h3 className="font-serif text-dark text-[17px] leading-snug mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
              <span className="mt-3 text-[11px] tracking-widest uppercase font-sans text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Xem thêm <FiArrowRight size={11} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8 md:hidden">
        <Link to="/blog" className="btn-outline">Xem Tất Cả Bài Viết</Link>
      </div>
    </section>
  );
}
