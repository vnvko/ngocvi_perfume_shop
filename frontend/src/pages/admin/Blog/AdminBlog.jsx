// Admin: Quản lý bài viết blog — danh sách, trạng thái, thêm/sửa/xóa
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import { mediaUrl } from '../../../utils/mediaUrl';

const STATUS_STYLE = {
  published: 'bg-green-50 text-green-700',
  draft:     'bg-gray-100 text-gray-600',
  hidden:    'bg-red-50 text-red-600',
};
const STATUS_LABEL = { published: 'Hiển thị', draft: 'Nháp', hidden: 'Ẩn' };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchBlogs = useCallback(() => {
    setLoading(true);
    adminAPI.getBlogs({ search, status: statusFilter, category: categoryFilter, page, limit })
      .then(res => { setPosts(res.data || []); setTotal(res.pagination?.total || 0); })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, categoryFilter, page, limit]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bài viết "${title}"?`)) return;
    try { await adminAPI.deleteBlog(id); fetchBlogs(); } catch (err) { alert(err.message); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý bài viết' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý bài viết</h1>
          <p className="text-xs text-gray-400 mt-1">Quản lý tất cả nội dung bài viết và tin tức</p>
        </div>
        <Link to="/admin/blog/new" className="btn-primary flex items-center gap-1.5">
          <FiPlus size={13} /> Thêm bài viết
        </Link>
      </div>

      <div className="card mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm bài viết theo tiêu đề, tác giả..." className="input w-full pl-8" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input">
            <option value="">Trạng thái: Tất cả</option>
            <option value="published">Hiển thị</option>
            <option value="draft">Nháp</option>
            <option value="hidden">Ẩn</option>
          </select>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="input">
            <option value="">Danh mục: Tất cả</option>
            <option value="1">Kiến thức</option>
            <option value="2">Review</option>
            <option value="3">Xu hướng</option>
            <option value="4">Thương hiệu</option>
            <option value="5">Tips</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID', 'Ảnh', 'Tiêu đề', 'Danh mục', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:5}).map((_,i) => (
                <tr key={i}><td colSpan={7} className="py-3"><div className="h-11 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : posts.map((p, idx) => (
              <tr key={p.id} className="table-row">
                <td className="py-3 pr-4 text-xs text-gray-400">#{String(idx + 1 + (page-1)*limit).padStart(3,'0')}</td>
                <td className="py-3 pr-4">
                  <div className="w-16 h-11 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {p.thumbnail
                      ? <img src={mediaUrl(p.thumbnail)} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gray-100" />
                    }
                  </div>
                </td>
                <td className="py-3 pr-4 max-w-[200px]">
                  <p className="text-xs font-medium text-gray-800 truncate">{p.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tác giả: {p.author_name}</p>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[11px] font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{p.category_name}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[p.status] || STATUS_STYLE.draft}`}>
                    {STATUS_LABEL[p.status] || p.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/blog/${p.slug}`} target="_blank" className="text-blue-500 hover:text-blue-700" title="Xem trên store">
                      <FiEye size={14} />
                    </Link>
                    <Link to={`/admin/blog/${p.id}/edit`} className="text-gray-400 hover:text-gray-700" title="Chỉnh sửa">
                      <FiEdit2 size={14} />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.title)} className="text-red-400 hover:text-red-600" title="Xóa">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !posts.length && (
              <tr><td colSpan={7} className="py-10 text-center text-xs text-gray-400">Không có bài viết</td></tr>
            )}
          </tbody>
        </table>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{posts.length} / {total} bài viết</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">‹</button>
            {Array.from({length:Math.min(totalPages,5)},(_,i)=>(
              <button key={i+1} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-primary text-white':'hover:bg-gray-100 text-gray-600'}`}>{i+1}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
