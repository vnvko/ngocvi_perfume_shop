// Admin: Chi tiết đơn hàng — xem thông tin đầy đủ, cập nhật trạng thái
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiCheck, FiTruck, FiPackage, FiFlag, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { adminAPI } from '../../../services/api';
import { mediaUrl } from '../../../utils/mediaUrl';

const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

const steps = [
  { id: 'pending', label: 'Chờ xác nhận', icon: FiPackage },
  { id: 'confirmed', label: 'Đã xác nhận', icon: FiCheck },
  { id: 'shipping', label: 'Đang giao', icon: FiTruck },
  { id: 'completed', label: 'Hoàn thành', icon: FiFlag },
  { id: 'cancelled', label: 'Đã hủy', icon: FiFlag },
];
const stepOrder = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const printInvoice = (order) => {
  if (!order) return;
  const fmtP = (n) => new Intl.NumberFormat('vi-VN').format(n||0)+'đ';
  const itemsHtml = (order.items||[]).map(item =>
    `<tr><td style="padding:8px 4px;border-bottom:1px solid #eee">${item.product_name} (${item.volume_ml||''}ml)</td>
     <td style="text-align:right;padding:8px 4px;border-bottom:1px solid #eee">${item.quantity}</td>
     <td style="text-align:right;padding:8px 4px;border-bottom:1px solid #eee">${fmtP(item.price)}</td>
     <td style="text-align:right;padding:8px 4px;border-bottom:1px solid #eee">${fmtP(item.price*item.quantity)}</td></tr>`
  ).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Hóa đơn ${order.order_code}</title>
  <style>body{font-family:Arial,sans-serif;max-width:600px;margin:40px auto;color:#333}
  h1{color:#C9A96E;font-size:24px}table{width:100%;border-collapse:collapse}
  th{background:#1a1a1a;color:#fff;padding:10px 4px;text-align:left}
  .total{font-size:18px;font-weight:bold;color:#C9A96E}
  @media print{button{display:none}}</style></head>
  <body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px">
      <div><h1>NGOCVI</h1><p style="color:#888;font-size:13px">Perfume Boutique</p></div>
      <div style="text-align:right">
        <p style="font-size:13px;color:#888">Mã đơn</p>
        <p style="font-size:20px;font-weight:bold;color:#C9A96E">${order.order_code}</p>
        <p style="font-size:12px;color:#888">${new Date(order.created_at).toLocaleString('vi-VN')}</p>
      </div>
    </div>
    <div style="margin-bottom:24px;padding:16px;background:#f9f9f9;border-radius:8px">
      <p style="font-weight:bold;margin-bottom:4px">${order.customer_name}</p>
      <p style="color:#666;font-size:13px">${order.customer_phone||''}</p>
    </div>
    <table><thead><tr>
      <th>Sản phẩm</th><th style="text-align:right">SL</th>
      <th style="text-align:right">Đơn giá</th><th style="text-align:right">Thành tiền</th>
    </tr></thead><tbody>${itemsHtml}</tbody></table>
    <div style="text-align:right;margin-top:24px;padding-top:16px;border-top:2px solid #eee">
      <p>Phí vận chuyển: ${fmtP(order.shipping_fee)}</p>
      ${order.discount>0?`<p>Giảm giá: -${fmtP(order.discount)}</p>`:''}
      <p class="Tổng cộng">Tổng cộng: ${fmtP(order.total_price)}</p>
    </div>
    <div style="margin-top:32px;text-align:center;color:#888;font-size:12px">
      <p>Cảm ơn quý khách đã tin tưởng NGOCVI Perfume Boutique!</p>
    </div>
    <div style="text-align:center;margin-top:24px"><button onclick="window.print()" style="background:#C9A96E;color:#fff;border:none;padding:12px 32px;font-size:14px;cursor:pointer;border-radius:6px">In Hóa Đơn</button></div>
  </body></html>`;
  const w = window.open('','_blank','width=700,height=900');
  w.document.write(html);
  w.document.close();
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    adminAPI.getOrder(id)
      .then(res => {
        const o = res.data.order;
        setOrder(o);
        setSelectedStatus(o.status);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(id, selectedStatus);
      setOrder(prev => ({ ...prev, status: selectedStatus }));
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Lỗi cập nhật trạng thái';
      alert(message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <AdminLayout breadcrumb={{ parent: 'Quản lý đơn hàng', parentLink: '/admin/orders', current: 'Chi tiết' }}>
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-32 bg-gray-100 rounded" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
    </AdminLayout>
  );

  if (!order) return (
    <AdminLayout breadcrumb={{ parent: 'Quản lý đơn hàng', parentLink: '/admin/orders', current: 'Không tìm thấy' }}>
      <div className="text-center py-20 text-gray-400">Không tìm thấy đơn hàng #{id}</div>
    </AdminLayout>
  );

  const currentStep = stepOrder.indexOf(order.status);

  return (
    <AdminLayout breadcrumb={{ parent: 'Quản lý đơn hàng', parentLink: '/admin/orders', current: order.order_code }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Chi tiết đơn hàng: <span className="text-primary">{order.order_code}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
        <div className="flex gap-2">
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="input text-xs">
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button onClick={handleUpdateStatus} disabled={updating || selectedStatus === order.status} className="btn-primary text-xs disabled:opacity-50">
            {updating ? 'Đang lưu...' : 'Cập nhật'}
          </button>
          <button onClick={() => printInvoice(order)} className="btn-outline flex items-center gap-1.5 text-xs"><FiPrinter size={13} /> In đơn</button>
        </div>
      </div>

      {/* Status stepper */}
      <div className="card mb-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-10 right-10 h-px bg-gray-100" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  active ? 'border-primary bg-primary text-white' :
                  done ? 'border-primary/40 bg-white text-primary' :
                  'border-gray-200 bg-white text-gray-300'
                }`}><Icon size={16} /></div>
                <p className={`text-xs ${active ? 'text-primary font-semibold' : done ? 'text-gray-600' : 'text-gray-300'}`}>{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Products */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm ({order.items?.length || 0})</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Sản phẩm', 'Giá', 'SL', 'Tổng'].map(h => (
                    <th key={h} className="table-head text-left pb-3 pr-4 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map(item => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          {item.thumbnail ? <img src={mediaUrl(item.thumbnail)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800">{item.product_name}</p>
                          <p className="text-[11px] text-gray-400">{item.volume_ml}ml</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{fmtPrice(item.price)}</td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-xs font-semibold text-gray-800 text-right">{fmtPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Tóm tắt thanh toán</h3>
            <div className="space-y-2.5">
              {[
                ['Tạm tính', fmtPrice(order.total_price - (order.shipping_fee || 0) + (order.discount || 0))],
                ['Phí vận chuyển', fmtPrice(order.shipping_fee)],
                ['Giảm giá', `- ${fmtPrice(order.discount)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className={v.startsWith('-') ? 'text-red-500' : 'text-gray-700'}>{v}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="text-sm font-semibold text-gray-800">Tổng cộng</span>
                <span className="text-sm font-semibold text-primary">{fmtPrice(order.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Status history */}
          {order.history?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">Lịch sử trạng thái</h3>
              <div className="space-y-2">
                {order.history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="font-medium">{h.status}</span>
                    <span className="text-gray-400">{new Date(h.updated_at).toLocaleString('vi-VN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer info */}
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Thông tin khách hàng</h3>
            <p className="text-sm font-semibold text-gray-800 mb-3">{order.customer_name}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiMail size={12} className="text-gray-400" /><span>{order.customer_email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FiPhone size={12} className="text-gray-400" /><span>{order.customer_phone}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Thanh toán</h3>
            <p className="text-xs text-gray-700 font-medium">{order.payment_method}</p>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full mt-2 inline-block ${order.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
              {order.status === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
