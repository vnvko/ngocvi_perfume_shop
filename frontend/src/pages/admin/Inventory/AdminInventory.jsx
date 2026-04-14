// Admin: Quản lý kho — tồn kho theo variant, chỉnh sửa stock trực tiếp
import { useState, useEffect, useCallback, useRef } from 'react';
import { FiUpload, FiEdit2, FiSearch, FiDownload } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import { mediaUrl } from '../../../utils/mediaUrl';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total_value: 0, low_stock: 0, out_of_stock: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importVariantId, setImportVariantId] = useState('');
  const [importQty, setImportQty] = useState('');
  const [importSearch, setImportSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const csvInputRef = useRef(null);

  const fetchInventory = useCallback(() => {
    setLoading(true);
    adminAPI.getInventory({ search, page: 1, limit: 10000 })
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
  }, [search]);

  const exportInventoryCsv = () => {
    if (!inventory.length) return;
    const exportedAt = new Date().toLocaleString('vi-VN');
    const headers = [
      'Ma bien the',
      'Ten san pham',
      'Dung tich (ml)',
      'Ton hien tai',
      'Dang giao',
      'Ton kha dung',
      'Nhap kho',
      'So luong nhap kho gan nhat',
      'Gia (VND)',
      'Thoi gian nhap kho gan nhat',
    ];
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = inventory.map((item) => {
      const available = (item.stock || 0) - (item.shipping_qty || 0);
      return [
        item.variant_id,
        item.name,
        item.volume_ml,
        item.stock,
        item.shipping_qty || 0,
        available,
        '',
        item.latest_import_qty || 0,
        item.price || 0,
        item.latest_import_at || '',
      ].map(escape).join(',');
    });
    const csv = [`Thoi gian xuat file,${escape(exportedAt)}`, headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ton-kho-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseCsvLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current);
    return values.map((v) => v.trim());
  };

  const handleImportCsvFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setBulkImporting(true);
      const text = await file.text();
      const lines = text
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        alert('File CSV không có dữ liệu.');
        return;
      }

      const headerLineIndex = lines.findIndex((line) => {
        const cols = parseCsvLine(line).map((h) => h.toLowerCase());
        return cols.includes('ma bien the') && cols.includes('nhap kho');
      });
      if (headerLineIndex === -1) {
        alert('File CSV không đúng định dạng. Cần có dòng tiêu đề chứa "Ma bien the" và "Nhap kho".');
        return;
      }
      const headers = parseCsvLine(lines[headerLineIndex]).map((h) => h.toLowerCase());
      const variantIdx = headers.findIndex((h) => h === 'ma bien the');
      const qtyIdx = headers.findIndex((h) => h === 'nhap kho');

      if (variantIdx === -1 || qtyIdx === -1) {
        alert('File CSV không đúng định dạng. Cần có cột "Ma bien the" và "Nhap kho".');
        return;
      }

      const payload = lines
        .slice(headerLineIndex + 1)
        .map((line) => parseCsvLine(line))
        .map((cols) => ({
          variantId: parseInt(String(cols[variantIdx] || '').replace(/[^\d-]/g, ''), 10),
          qty: parseInt(String(cols[qtyIdx] || '').replace(/[^\d-]/g, ''), 10),
        }))
        .filter((r) => Number.isInteger(r.variantId) && Number.isInteger(r.qty) && r.variantId > 0 && r.qty > 0);

      if (!payload.length) {
        alert('Không tìm thấy dòng hợp lệ để nhập kho (số lượng phải > 0).');
        return;
      }

      let successCount = 0;
      let failCount = 0;
      for (const row of payload) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await adminAPI.updateStock(row.variantId, { change_type: 'import', quantity: row.qty });
          successCount++;
        } catch (_) {
          failCount++;
        }
      }

      fetchInventory();
      alert(`Import CSV hoàn tất. Thành công: ${successCount}, thất bại: ${failCount}.`);
    } catch (err) {
      alert('Không thể đọc file CSV.');
    } finally {
      setBulkImporting(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

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

  const handleImportStock = async () => {
    const variantId = parseInt(importVariantId, 10);
    const qty = parseInt(importQty, 10);
    if (!variantId || isNaN(qty) || qty <= 0) return;
    try {
      setImporting(true);
      await adminAPI.updateStock(variantId, { change_type: 'import', quantity: qty });
      setShowImportModal(false);
      setImportVariantId('');
      setImportQty('');
      fetchInventory();
    } catch (err) {
      alert(err.message || 'Nhập kho thất bại');
    } finally {
      setImporting(false);
    }
  };

  const normalizedSearch = importSearch.trim().toLowerCase();
  const importCandidates = [...inventory]
    .sort((a, b) => {
      const byName = String(a.name || '').localeCompare(String(b.name || ''), 'vi');
      if (byName !== 0) return byName;
      return (a.volume_ml || 0) - (b.volume_ml || 0);
    })
    .filter((item) => {
      if (!normalizedSearch) return true;
      const hay = `${item.variant_id} ${item.name} ${item.volume_ml}ml`.toLowerCase();
      return hay.includes(normalizedSearch);
    });

  const selectedImportItem = inventory.find((i) => String(i.variant_id) === String(importVariantId));

  const statusInfo = (item) => {
    if (item.stock === 0) return { label: 'Hết hàng', cls: 'badge-red' };
    if (item.stock <= 5) return { label: 'Sắp hết hàng', cls: 'badge-yellow' };
    return { label: 'Còn hàng', cls: 'badge-green' };
  };

  return (
    <AdminLayout breadcrumb={{ current: 'Quản lý kho' }}>
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Quản lý kho hàng</h1>
        <div className="flex items-center gap-2">
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleImportCsvFile}
          />
          <button
            onClick={() => csvInputRef.current?.click()}
            className="btn-outline flex items-center gap-1.5"
            disabled={bulkImporting}
          >
            <FiUpload size={13} /> {bulkImporting ? 'Đang import...' : 'Import CSV'}
          </button>
          <button onClick={exportInventoryCsv} className="btn-outline flex items-center gap-1.5">
            <FiDownload size={13} /> Xuất CSV
          </button>
          <button onClick={() => setShowImportModal(true)} className="btn-primary flex items-center gap-1.5"><FiUpload size={13} /> Nhập kho</button>
        </div>
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
                      {item.thumbnail ? <img src={mediaUrl(item.thumbnail)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
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

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !importing && setShowImportModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-lg shadow-xl p-5">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Nhập kho</h3>
            <p className="text-xs text-gray-500 mb-4">Tìm biến thể cần nhập và nhập số lượng bổ sung.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Tìm nhanh biến thể</label>
                <input
                  value={importSearch}
                  onChange={(e) => setImportSearch(e.target.value)}
                  className="input mb-2"
                  placeholder="Nhập tên sản phẩm, mã biến thể hoặc dung tích..."
                  disabled={importing}
                />
                <label className="text-xs text-gray-500 block mb-1.5">Biến thể sản phẩm</label>
                <select
                  value={importVariantId}
                  onChange={(e) => setImportVariantId(e.target.value)}
                  className="input"
                  disabled={importing}
                >
                  <option value="">Chọn biến thể</option>
                  {importCandidates.map((item) => (
                    <option key={item.variant_id} value={item.variant_id}>
                      #{item.variant_id} - {item.name} ({item.volume_ml}ml)
                    </option>
                  ))}
                </select>
                {!!normalizedSearch && importCandidates.length === 0 && (
                  <p className="text-[11px] text-red-500 mt-1">Không tìm thấy biến thể phù hợp.</p>
                )}
                {selectedImportItem && (
                  <div className="mt-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                    <p className="font-medium text-gray-800 mb-0.5">{selectedImportItem.name} ({selectedImportItem.volume_ml}ml)</p>
                    <p>
                      Mã biến thể: <span className="font-medium">#{selectedImportItem.variant_id}</span> - Tồn hiện tại:{' '}
                      <span className="font-medium">{selectedImportItem.stock}</span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">Số lượng nhập thêm</label>
                <input
                  type="number"
                  min="1"
                  value={importQty}
                  onChange={(e) => setImportQty(e.target.value)}
                  className="input"
                  placeholder="Ví dụ: 20"
                  disabled={importing}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowImportModal(false)}
                className="btn-outline"
                disabled={importing}
              >
                Hủy
              </button>
              <button
                onClick={handleImportStock}
                className="btn-primary"
                disabled={importing || !importVariantId || !importQty}
              >
                {importing ? 'Đang nhập...' : 'Xác nhận nhập kho'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
