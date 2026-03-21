// Admin: Quản lý voucher — danh sách, thêm, sửa, xóa mã giảm giá
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import api from '../../../services/api';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';
const emptyForm = {
  code: '', discount_type: 'percent', discount_value: '',
  max_discount: '', min_order_value: '', quantity: '',
  start_date: '', end_date: '',
};

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchVouchers = () => {
    setLoading(true);
    api.get('/admin/vouchers')
      .then(r => setVouchers(r.data.vouchers || r.data || []))
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVouchers(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEdit = (v) => {
    setEditing(v.id);
    setForm({
      code: v.code || '', discount_type: v.discount_type || 'percent',
      discount_value: v.discount_value || '', max_discount: v.max_discount || '',
      min_order_value: v.min_order_value || '', quantity: v.quantity || '',
      start_date: v.start_date?.slice(0,10) || '', end_date: v.end_date?.slice(0,10) || '',
    });
    setError(''); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.discount_value) { setError('Vui lòng nhập đầy đủ thông tin bắt buộc'); return; }
    setSaving(true); setError('');
    try {
      if (editing) {
        await api.put(`/admin/vouchers/${editing}`, form);
      } else {
        await api.post('/admin/vouchers', form);
      }
      setShowForm(false); fetchVouchers();
    } catch (e) { setError(e.message || 'Lỗi lưu voucher'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Xóa voucher "${code}"?`)) return;
    try { await api.delete(`/admin/vouchers/${id}`); fetchVouchers(); } catch (e) { alert(e.message); }
  };

  const upd = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const isExpired = (end) => end && new Date(end) < new Date();
  const usageRate = (v) => v.quantity > 0 ? Math.round((v.used_count / v.quantity) * 100) : 0;

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý voucher' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Quản lý Voucher</h1>
          <p className="text-xs text-gray-400 mt-1">{vouchers.length} mã giảm giá</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1.5">
          <FiPlus size={13} /> Tạo mã giảm giá
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Tổng voucher', value: vouchers.length, color: 'text-gray-800' },
          { label: 'Đang hoạt động', value: vouchers.filter(v => !isExpired(v.end_date)).length, color: 'text-green-600' },
          { label: 'Đã hết hạn', value: vouchers.filter(v => isExpired(v.end_date)).length, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Mã Code', 'Loại', 'Giá trị', 'Đơn tối thiểu', 'Đã dùng', 'Hạn dùng', 'Trạng thái', ''].map(h => (
                <th key={h} className="table-head text-left pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:4}).map((_,i) => <tr key={i}><td colSpan={8} className="py-3"><div className="h-10 bg-gray-50 rounded animate-pulse" /></td></tr>)
            ) : vouchers.map(v => {
              const expired = isExpired(v.end_date);
              const rate = usageRate(v);
              return (
                <tr key={v.id} className="table-row">
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">{v.code}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${v.discount_type === 'percent' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                      {v.discount_type === 'percent' ? 'Phần trăm' : 'Cố định'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs font-semibold text-gray-800">
                    {v.discount_type === 'percent' ? `${v.discount_value}%` : fmtPrice(v.discount_value)}
                    {v.max_discount && v.discount_type === 'percent' && (
                      <span className="text-[10px] text-gray-400 block">Tối đa {fmtPrice(v.max_discount)}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-600">{fmtPrice(v.min_order_value)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-16">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-500">{v.used_count || 0}/{v.quantity}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-400">
                    {v.end_date ? new Date(v.end_date).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${expired ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                      {expired ? 'Hết hạn' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(v)} className="text-gray-400 hover:text-gray-700"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(v.id, v.code)} className="text-red-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && !vouchers.length && <tr><td colSpan={8} className="py-10 text-center text-xs text-gray-400">Chưa có voucher nào</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">{editing ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><FiX size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Mã Code * <span className="text-gray-400 font-normal">(viết hoa, không dấu)</span></label>
                <input value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())}
                  placeholder="VD: WELCOME10" className="input w-full font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Loại giảm giá</label>
                  <select value={form.discount_type} onChange={e => upd('discount_type', e.target.value)} className="input w-full">
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Giá trị giảm *</label>
                  <input type="number" value={form.discount_value} onChange={e => upd('discount_value', e.target.value)}
                    placeholder={form.discount_type === 'percent' ? '10' : '50000'} className="input w-full" />
                </div>
              </div>
              {form.discount_type === 'percent' && (
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Giảm tối đa (đ)</label>
                  <input type="number" value={form.max_discount} onChange={e => upd('max_discount', e.target.value)}
                    placeholder="200000" className="input w-full" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Đơn tối thiểu (đ)</label>
                  <input type="number" value={form.min_order_value} onChange={e => upd('min_order_value', e.target.value)}
                    placeholder="500000" className="input w-full" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Số lượng</label>
                  <input type="number" value={form.quantity} onChange={e => upd('quantity', e.target.value)}
                    placeholder="100" className="input w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Ngày bắt đầu</label>
                  <input type="date" value={form.start_date} onChange={e => upd('start_date', e.target.value)} className="input w-full" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Ngày hết hạn</label>
                  <input type="date" value={form.end_date} onChange={e => upd('end_date', e.target.value)} className="input w-full" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo Voucher'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
