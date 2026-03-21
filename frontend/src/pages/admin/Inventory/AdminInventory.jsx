// Admin: Quản lý kho — tồn kho theo variant, chỉnh sửa stock trực tiếp
import { useState, useEffect } from 'react';
import { FiUpload, FiEdit2, FiSearch } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total_value: 0, low_stock: 0, out_of_stock: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');

  const fetchInventory = () => {
    setLoading(true);
    adminAPI.getInventory({ search })
      .then(res => {
        const items = res.data.inventory || [];
        setInventory(items);
        setStats({
          low_stock: items.filter(i => i.stock > 0 && i.stock <= 5).length,
          out_of_stock: items.filter(i => i.stock === 0).length,
        });
      })
      .catch(() => setInventory([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInventory(); }, [search]);

  const handleUpdateStock = async (variantId) => {
    const newStock = parseInt(editStock);
    if (isNaN(newStock) || newStock < 0) return;
    try {
      await adminAPI.updateStock(variantId, { stock: newStock, change_type: 'adjust' });
      setEditingId(null);
      setEditStock('');
      fetchInventory();
    } catch {}
  };

  const statusInfo = (item) => {
    if (item.stock === 0) return { label: 'Hết hàng', cls: 'badge-red' };
    if (item.stock <= 5) return { label: 'Sắp hết hàng', cls: 'badge-yellow' };
    return { label: 'Còn hàng', cls: 'badge-green' };
  };

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý kho' }}>
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Quản lý kho hàng</h1>
        <button className="btn-primary flex items-center gap-1.5"><FiUpload size={13} /> Nhập kho</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Sắp hết hàng', value: stats.low_stock, sub: 'Threshold: ≤ 5', color: 'text-amber-600' },
          { label: 'Hết hàng', value: stats.out_of_stock, sub: 'Cần nhập thêm', color: 'text-red-600' },
          { label: 'Tổng variants', value: inventory.length, sub: 'Đang theo dõi', color: 'text-gray-700' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs text-gray-500 mb-2">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-4 flex gap-3">
        <div className="relative flex-1">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); }} placeholder="Tìm sản phẩm, SKU..." className="input w-full pl-8" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['SKU', 'Ảnh', 'Tên sản phẩm', 'Dung tích', 'Tồn kho', 'Đang giao', 'Tồn khả dụng', 'Trạng thái', 'Hành động'].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={9} className="py-3"><div className="h-10 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : inventory.map(item => {
              const { label, cls } = statusInfo(item);
              const available = item.stock - (item.shipping_qty || 0);
              return (
                <tr key={item.variant_id} className="table-row">
                  <td className="py-3 pr-3 text-[11px] text-gray-500">#{item.variant_id}</td>
                  <td className="py-3 pr-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50">
                      {item.thumbnail ? <img src={item.thumbnail} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-xs font-medium text-gray-800 max-w-[140px] truncate">{item.name}</td>
                  <td className="py-3 pr-3 text-xs text-gray-500">{item.volume_ml}ml</td>
                  <td className="py-3 pr-3 text-xs font-semibold text-gray-800">{item.stock}</td>
                  <td className={`py-3 pr-3 text-xs font-semibold ${(item.shipping_qty||0) > 0 ? 'text-amber-600' : 'text-gray-400'}`}>{item.shipping_qty || 0}</td>
                  <td className={`py-3 pr-3 text-xs font-semibold ${available <= 0 ? 'text-red-500' : available <= 5 ? 'text-orange-500' : 'text-gray-800'}`}>{available}</td>
                  <td className="py-3 pr-3"><span className={cls}>{label}</span></td>
                  <td className="py-3">
                    {editingId === item.variant_id ? (
                      <div className="flex gap-1">
                        <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                          className="w-16 border border-gray-200 px-2 py-1 text-xs rounded outline-none focus:border-primary" min="0" />
                        <button onClick={() => handleUpdateStock(item.variant_id)} className="text-[10px] bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark">Lưu</button>
                        <button onClick={() => setEditingId(null)} className="text-[10px] text-gray-500 px-1 py-1">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(item.variant_id); setEditStock(String(item.stock)); }}
                        className="text-gray-400 hover:text-gray-700">
                        <FiEdit2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && !inventory.length && (
              <tr><td colSpan={9} className="py-10 text-center text-xs text-gray-400">Không có dữ liệu kho</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
