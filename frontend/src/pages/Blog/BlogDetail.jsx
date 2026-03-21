// Trang chi tiết bài viết blog — nội dung, tác giả, ngày đăng
import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { FiShare2 } from 'react-icons/fi';
import { blogAPI } from '../../services/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    blogAPI.getBySlug(slug)
      .then(res => setBlog(res.data.blog))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-8 bg-light-secondary rounded mb-4 w-3/4" />
      <div className="aspect-video bg-light-secondary mb-8" />
      <div className="space-y-3">
        {[1,2,3,4].map(i => <div key={i} className="h-4 bg-light-secondary rounded" />)}
      </div>
    </div>
  );
  if (notFound) return <Navigate to="/blog" replace />;
  if (!blog) return null;

  return (
    <div>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4">
        <nav className="text-xs font-sans text-muted flex items-center gap-1.5">
          <Link to="/" className="hover:text-dark">Trang chủ</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-dark">Journal</Link>
          <span>/</span>
          <span className="text-dark truncate max-w-xs">{blog.title}</span>
        </nav>
      </div>

      <article className="max-w-screen-xl mx-auto px-4 md:px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {blog.category_name && <span className="label-tag text-primary">{blog.category_name}</span>}
              <span className="text-muted">·</span>
              <span className="label-tag">{new Date(blog.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-dark leading-tight mb-4">{blog.title}</h1>
          </div>

          {blog.thumbnail && (
            <div className="aspect-video overflow-hidden mb-8">
              <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none font-sans text-dark/80 text-[15px] leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>

          {/* Author */}
          <div className="mt-10 pt-6 border-t border-light-secondary flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-widest uppercase font-sans text-muted">Written by</p>
              <p className="font-sans text-sm font-medium text-dark">{blog.author_name}</p>
            </div>
            <button className="flex items-center gap-2 text-xs tracking-widest uppercase font-sans text-muted hover:text-dark transition-colors">
              <FiShare2 size={13} /> Share
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
