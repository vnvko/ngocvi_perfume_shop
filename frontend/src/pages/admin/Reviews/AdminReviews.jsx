// Admin: Quản lý đánh giá sản phẩm — ẩn/hiện/xóa review
import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { mediaUrl } from '../../../utils/mediaUrl';
import { adminAPI } from '../../../services/api';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5-n);

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const limit = 10;

  const fetchReviews = useCallback(() => {
    setLoading(true);
    adminAPI.getReviews({ search, page, limit })
      .then(res => { setReviews(res.data || []); setTotal(res.pagination?.total || 0); })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [search, page, limit]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const toggleStatus = async (id, current) => {
    try { await adminAPI.updateReviewStatus(id, current === 'visible' ? 'hidden' : 'visible'); fetchReviews(); } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa đánh giá này?')) return;
    try { await adminAPI.deleteReview(id); fetchReviews(); } catch {}
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý đánh giá' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý đánh giá</h1>
          <p className="text-xs text-gray-400 mt-1">Tổng: {total} đánh giá</p>
        </div>
      </div>

      <div className="card mb-4 flex gap-3">
        <div className="relative flex-1">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm theo sản phẩm, khách hàng..." className="input w-full pl-8" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Sản phẩm', 'Khách hàng', 'Sao', 'Nội dung', 'Đính kèm', 'Trạng thái', 'Ngày', ''].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:5}).map((_,i) => <tr key={i}><td colSpan={8} className="py-3"><div className="h-10 bg-gray-50 rounded animate-pulse" /></td></tr>)
            ) : reviews.map(r => (
              <tr key={r.id} className="table-row">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    {r.product_thumbnail && <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0"><img src={mediaUrl(r.product_thumbnail)} alt="" className="w-full h-full object-cover" /></div>}
                    <p className="text-xs font-medium text-gray-800 max-w-[120px] truncate">{r.product_name}</p>
                  </div>
                </td>
                <td className="py-3 pr-4 text-xs font-medium text-gray-700">{r.user_name}</td>
                <td className="py-3 pr-4">
                  <span className={`text-sm ${r.rating >= 4 ? 'text-amber-400' : r.rating <= 2 ? 'text-red-400' : 'text-yellow-400'}`}>{stars(r.rating)}</span>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-500 max-w-[180px] truncate">{r.comment}</td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1 max-w-[120px]">
                    {(r.media || []).slice(0, 3).map((m) => (
                      m.media_type === 'video' ? (
                        <a key={m.id} href={mediaUrl(m.file_url)} target="_blank" rel="noreferrer" className="text-[10px] text-primary underline">video</a>
                      ) : (
                        <a key={m.id} href={mediaUrl(m.file_url)} target="_blank" rel="noreferrer" className="block w-8 h-8 rounded overflow-hidden border border-gray-100">
                          <img src={mediaUrl(m.file_url)} alt="" className="w-full h-full object-cover" />
                        </a>
                      )
                    ))}
                    {(r.media || []).length > 3 && <span className="text-[10px] text-gray-400">+{r.media.length - 3}</span>}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <button onClick={() => toggleStatus(r.id, r.status)}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full cursor-pointer ${r.status === 'visible' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {r.status === 'visible' ? 'Hiển thị' : 'Ẩn'}
                  </button>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="py-3">
                  <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {!loading && !reviews.length && <tr><td colSpan={8} className="py-10 text-center text-xs text-gray-400">Không có đánh giá</td></tr>}
          </tbody>
        </table>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{reviews.length} / {total}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">‹</button>
            {Array.from({length:Math.min(totalPages,5)},(_,i)=>(
              <button key={i+1} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-primary text-white':'hover:bg-gray-100 text-gray-600'}`}>{i+1}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
