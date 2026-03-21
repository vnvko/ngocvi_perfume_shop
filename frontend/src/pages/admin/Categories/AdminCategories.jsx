// Admin: Quản lý danh mục sản phẩm — CRUD với real API
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    adminAPI.getCategories()
      .then(r => setCategories(r.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa danh mục "${name}"?`)) return;
    try { await adminAPI.deleteCategory(id); fetchCategories(); } catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý danh mục' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý danh mục</h1>
          <p className="text-xs text-gray-400 mt-1">{categories.length} danh mục</p>
        </div>
        <Link to="/admin/categories/new" className="btn-primary flex items-center gap-1.5">
          <FiPlus size={13} /> Thêm danh mục
        </Link>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID', 'Tên danh mục', 'Slug', 'Số sản phẩm', 'Hành động'].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:4}).map((_,i) => (
                <tr key={i}><td colSpan={5} className="py-3"><div className="h-10 bg-gray-50 rounded animate-pulse" /></td></tr>
              ))
            ) : categories.map(c => (
              <tr key={c.id} className="table-row">
                <td className="py-3 pr-4 text-xs text-gray-500">#{c.id}</td>
                <td className="py-3 pr-4 text-xs font-medium text-gray-800">{c.name}</td>
                <td className="py-3 pr-4 text-xs text-gray-400 font-mono">{c.slug}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{c.product_count || 0}</span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/categories/${c.id}/edit`} className="text-gray-400 hover:text-gray-700">
                      <FiEdit2 size={14} />
                    </Link>
                    <button onClick={() => handleDelete(c.id, c.name)} className="text-red-400 hover:text-red-600">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !categories.length && (
              <tr><td colSpan={5} className="py-10 text-center text-xs text-gray-400">Chưa có danh mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
