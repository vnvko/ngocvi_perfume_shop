// Quản lý địa chỉ giao hàng — thêm, sửa, xóa, đặt mặc định — kết nối API thật
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiMapPin } from 'react-icons/fi';
import { addressAPI } from '../../services/api';

const PROVINCES = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
  'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng', 'Bà Rịa - Vũng Tàu',
];

const emptyForm = { receiver_name: '', phone: '', province: '', district: '', ward: '', address_detail: '', is_default: false };

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, id = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = () => {
    setLoading(true);
    addressAPI.getAll()
      .then(r => setAddresses(r.data?.addresses || []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setEditing(addr.id);
    setForm({
      receiver_name: addr.receiver_name || '',
      phone: addr.phone || '',
      province: addr.province || '',
      district: addr.district || '',
      ward: addr.ward || '',
      address_detail: addr.address_detail || '',
      is_default: addr.is_default === 1 || addr.is_default === true,
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.receiver_name || !form.phone || !form.province || !form.address_detail) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc'); return;
    }
    setSaving(true); setError('');
    try {
      if (editing) {
        await addressAPI.update(editing, form);
      } else {
        await addressAPI.create(form);
      }
      setShowForm(false);
      fetch();
    } catch (e) {
      setError(e.message || 'Lỗi lưu địa chỉ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa địa chỉ này?')) return;
    try { await addressAPI.delete(id); fetch(); } catch (e) { alert(e.message); }
  };

  const handleSetDefault = async (id) => {
    try { await addressAPI.setDefault(id); fetch(); } catch {}
  };

  const upd = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-dark">Địa Chỉ Giao Hàng</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-sm">
          <FiPlus size={14} /> Thêm địa chỉ mới
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="h-24 bg-light-secondary rounded animate-pulse" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="border-2 border-dashed border-light-secondary rounded-lg py-14 text-center">
          <FiMapPin size={28} className="text-muted mx-auto mb-3" />
          <p className="font-sans text-muted text-sm mb-4">Chưa có địa chỉ nào được lưu</p>
          <button onClick={openAdd} className="btn-outline text-sm">Thêm địa chỉ đầu tiên</button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => {
            const isDefault = addr.is_default === 1 || addr.is_default === true;
            return (
              <div key={addr.id} className={`border rounded-lg p-5 transition-all ${isDefault ? 'border-primary bg-primary/5' : 'border-light-secondary'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans font-semibold text-dark text-sm">{addr.receiver_name}</span>
                      <span className="text-muted text-sm">·</span>
                      <span className="font-sans text-muted text-sm">{addr.phone}</span>
                      {isDefault && (
                        <span className="text-[10px] tracking-wider uppercase font-sans font-medium px-2 py-0.5 bg-primary text-white rounded-full">Mặc định</span>
                      )}
                    </div>
                    <p className="font-sans text-sm text-muted">
                      {[addr.address_detail, addr.ward, addr.district, addr.province].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-sans text-muted hover:text-primary border border-light-secondary hover:border-primary px-3 py-1 transition-colors">
                        Đặt mặc định
                      </button>
                    )}
                    <button onClick={() => openEdit(addr)} className="text-gray-400 hover:text-dark transition-colors p-1">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-light-secondary">
              <h3 className="font-serif text-lg text-dark">{editing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-dark transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-sans font-medium text-dark block mb-1.5">Họ tên người nhận *</label>
                  <input value={form.receiver_name} onChange={e => upd('receiver_name', e.target.value)}
                    placeholder="Nguyễn Văn A" className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-dark block mb-1.5">Số điện thoại *</label>
                  <input value={form.phone} onChange={e => upd('phone', e.target.value)}
                    placeholder="0901234567" className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-dark block mb-1.5">Tỉnh / Thành phố *</label>
                <select value={form.province} onChange={e => upd('province', e.target.value)}
                  className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors">
                  <option value="">Chọn tỉnh / thành phố</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-sans font-medium text-dark block mb-1.5">Quận / Huyện</label>
                  <input value={form.district} onChange={e => upd('district', e.target.value)}
                    placeholder="Quận 1" className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-dark block mb-1.5">Phường / Xã</label>
                  <input value={form.ward} onChange={e => upd('ward', e.target.value)}
                    placeholder="Phường Bến Nghé" className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-sans font-medium text-dark block mb-1.5">Địa chỉ chi tiết *</label>
                <input value={form.address_detail} onChange={e => upd('address_detail', e.target.value)}
                  placeholder="Số nhà, tên đường..." className="w-full border border-light-secondary px-3 py-2.5 text-sm font-sans outline-none focus:border-primary transition-colors" />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.is_default} onChange={e => upd('is_default', e.target.checked)}
                  className="accent-primary w-4 h-4" />
                <span className="text-sm font-sans text-dark">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-light-secondary">
              <button onClick={() => setShowForm(false)} className="btn-outline flex-1">Hủy</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Lưu địa chỉ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
