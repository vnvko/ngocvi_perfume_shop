// Admin: Quản lý sản phẩm — danh sách, filter, toggle active, thêm/sửa/xóa
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchProducts = () => {
    setLoading(true);
    adminAPI.getProducts({ search, category: categoryFilter, brand: brandFilter, status: statusFilter, page, limit })
      .then(res => { setProducts(res.data || []); setTotal(res.pagination?.total || 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search, categoryFilter, brandFilter, statusFilter, page]);

  const toggleActive = async (id, currentStatus) => {
    try {
      await adminAPI.updateProduct(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
      fetchProducts();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Ẩn sản phẩm "${name}"?`)) return;
    try { await adminAPI.deleteProduct(id); fetchProducts(); } catch (err) { alert(err.message); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý sản phẩm' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-xs text-gray-400 mt-1">Danh sách tất cả sản phẩm trong cửa hàng</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-1.5">
          <FiPlus size={13} /> Thêm sản phẩm
        </Link>
      </div>

      <div className="card mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm tên, SKU, thương hiệu..." className="input w-full pl-8" />
          </div>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="input">
            <option value="">Tất cả danh mục</option>
            <option value="1">Nước hoa Nam</option>
            <option value="2">Nước hoa Nữ</option>
            <option value="3">Unisex</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input">
            <option value="">Trạng thái</option>
            <option value="active">Đang hiển thị</option>
            <option value="inactive">Đã ẩn</option>
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Ảnh', 'Tên sản phẩm', 'SKU', 'Giá', 'Tồn kho', 'Danh mục', 'Trạng thái', 'Hành động'].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:5}).map((_,i) => (
                <tr key={i}><td colSpan={8} className="py-3"><div className="h-11 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : products.map(p => (
              <tr key={p.id} className="table-row">
                <td className="py-3 pr-4">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {p.thumbnail
                      ? <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-[10px]">no img</div>
                    }
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-xs font-medium text-gray-800">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.brand_name}</p>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-500">{p.sku || `NGV-${p.id}`}</td>
                <td className="py-3 pr-4 text-xs font-medium text-gray-800">{fmtPrice(p.price)}</td>
                <td className="py-3 pr-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    (p.total_stock || 0) === 0 ? 'bg-red-50 text-red-600' :
                    (p.total_stock || 0) <= 5 ? 'bg-amber-50 text-amber-600' :
                    'bg-green-50 text-green-600'
                  }`}>{p.total_stock || 0}</span>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-500">{p.category_name}</td>
                <td className="py-3 pr-4">
                  <button onClick={() => toggleActive(p.id, p.status)}
                    className={`toggle ${p.status === 'active' ? 'bg-primary' : 'bg-gray-200'}`}>
                    <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${p.status === 'active' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/products/${p.slug}`} target="_blank" className="text-blue-500 hover:text-blue-700" title="Xem trên store">
                      <FiEye size={14} />
                    </Link>
                    <Link to={`/admin/products/${p.id}/edit`} className="text-gray-400 hover:text-gray-700" title="Chỉnh sửa">
                      <FiEdit2 size={14} />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-400 hover:text-red-600" title="Xóa">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !products.length && (
              <tr><td colSpan={8} className="py-10 text-center text-xs text-gray-400">Không có sản phẩm</td></tr>
            )}
          </tbody>
        </table>
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Hiển thị <strong className="text-gray-700">{products.length}</strong> / {total} sản phẩm</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">‹</button>
            {Array.from({length: Math.min(totalPages,5)}, (_,i) => (
              <button key={i+1} onClick={() => setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-primary text-white':'hover:bg-gray-100 text-gray-600'}`}>{i+1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages||totalPages===0} className="w-7 h-7 rounded hover:bg-gray-100 disabled:opacity-30">›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
