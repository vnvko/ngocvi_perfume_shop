export const revenueData = [
  { date: '1 Nov', revenue: 12000000 }, { date: '5 Nov', revenue: 18000000 },
  { date: '10 Nov', revenue: 24000000 }, { date: '15 Nov', revenue: 31000000 },
  { date: '20 Nov', revenue: 42000000 }, { date: '25 Nov', revenue: 58000000 },
  { date: '30 Nov', revenue: 52000000 },
];

export const topSelling = [
  { name: 'Chanel No. 5', sub: 'Classic Collection', sales: 342, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=60&q=80' },
  { name: 'Dior Sauvage', sub: "Men's Fragrance", sales: 285, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=60&q=80' },
  { name: 'Gucci Bloom', sub: 'Floral Series', sales: 194, image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=60&q=80' },
  { name: 'Tom Ford Black...', sub: 'Luxury Edition', sales: 156, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=60&q=80' },
  { name: 'YSL Black Opium', sub: 'Night Collection', sales: 120, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=60&q=80' },
];

export const recentOrders = [
  { id: '#NGV-20260225-001', customer: 'Võ Ngọc Vĩ', phone: '0901234567', total: 5900000, payment: 'Đã thanh toán', status: 'shipping', date: '25/02/2026' },
  { id: '#NGV-20260225-002', customer: 'Trần Minh Tuấn', phone: '0933888999', total: 3450000, payment: 'Chờ thanh toán', status: 'pending', date: '25/02/2026' },
  { id: '#NGV-20260224-005', customer: 'Lê Hoàng Nam', phone: '0912345678', total: 12500000, payment: 'Đã thanh toán', status: 'completed', date: '24/02/2026' },
  { id: '#NGV-20260224-004', customer: 'Phạm Thị Mai', phone: '0977665544', total: 850000, payment: 'Đã thanh toán', status: 'completed', date: '24/02/2026' },
  { id: '#NGV-20260223-009', customer: 'Hoàng Thúy Linh', phone: '0988112233', total: 2100000, payment: 'Đã hoàn tiền', status: 'cancelled', date: '23/02/2026' },
];

export const adminProducts = [
  { id: 1, sku: 'NGV-DIOR-001', name: 'Sauvage Eau De Parfum', brand: 'Dior', price: 2950000, stock: 45, category: 'Nước hoa Nam', active: true, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=60&q=80' },
  { id: 2, sku: 'NGV-CHA-005', name: 'Chanel No. 5', brand: 'Chanel', price: 3450000, stock: 3, category: 'Nước hoa Nữ', active: true, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=60&q=80' },
  { id: 3, sku: 'NGV-GUC-022', name: 'Gucci Bloom', brand: 'Gucci', price: 2800000, stock: 12, category: 'Nước hoa Nữ', active: false, image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=60&q=80' },
  { id: 4, sku: 'NGV-TOM-018', name: 'Black Orchid', brand: 'Tom Ford', price: 4150000, stock: 8, category: 'Unisex', active: true, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=60&q=80' },
  { id: 5, sku: 'NGV-YSL-009', name: 'Black Opium', brand: 'YSL', price: 3100000, stock: 56, category: 'Nước hoa Nữ', active: true, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=60&q=80' },
];

export const adminUsers = [
  { id: '#U-1024', name: 'Vo Ngoc Vi', email: 'vongocvi@example.com', phone: '0901 234 567', role: 'Customer', active: true, date: '20/10/2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80' },
  { id: '#U-1025', name: 'Nguyen Thi Lan', email: 'lan.nguyen@ngocvi.com', phone: '0912 345 678', role: 'Staff', active: true, date: '22/10/2023', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80' },
  { id: '#U-1026', name: 'Tran Minh Tuan', email: 'minhtuan.tran@example.com', phone: '0987 654 321', role: 'Customer', active: false, date: '24/10/2023', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80' },
  { id: '#U-1027', name: 'Pham Thi Mai', email: 'maipham@example.com', phone: '0933 445 566', role: 'Customer', active: true, date: '25/10/2023', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80' },
  { id: '#U-1028', name: 'Hoang Thuy Linh', email: 'linh.hoang@ngocvi.com', phone: '0999 888 777', role: 'Admin', active: true, date: '01/01/2023', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80' },
];

export const adminReviews = [
  { id: '#RV-1023', product: 'Dior Sauvage', productSub: "Men's Fragrance", customer: 'Nguyen Thi Lan', rating: 5, content: 'Mùi hương tuyệt vời, nam tính và lưu hương rất lâu. Giao...', date: '25/02/2026', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=50&q=80' },
  { id: '#RV-1022', product: 'Gucci Bloom', productSub: 'Floral Series', customer: 'Tran Minh Tuan', rating: 1, content: 'Sản phẩm có vẻ không chính hãng, mùi bay hơi nhanh quá...', date: '24/02/2026', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=50&q=80' },
  { id: '#RV-1021', product: 'Chanel No. 5', productSub: 'Classic Collection', customer: 'Le Hoang Nam', rating: 4, content: 'Hàng chuẩn auth, check code ok. Tuy nhiên giao hàng hơi l...', date: '23/02/2026', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=50&q=80' },
  { id: '#RV-1020', product: 'Tom Ford Black...', productSub: 'Luxury Edition', customer: 'Pham Thi Mai', rating: 5, content: 'Tuyệt vời! Mùi hương quyến rũ, sang trọng. Shop tư vấn r...', date: '22/02/2026', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=50&q=80' },
  { id: '#RV-1019', product: 'YSL Black...', productSub: 'Night Collection', customer: 'Hoang Thuy Linh', rating: 3, content: 'Mùi hơi ngọt quá so với mình mong đợi. Nhưng độ lưu...', date: '21/02/2026', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=50&q=80' },
];

export const inventory = [
  { sku: '#NGV-DIOR-001', name: 'Dior Sauvage EDP', size: '100ml', total: 45, shipping: 5, available: 40, status: 'in_stock', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=50&q=80' },
  { sku: '#NGV-CHAN-002', name: 'Chanel No. 5', size: '50ml', total: 3, shipping: 0, available: 3, status: 'low_stock', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=50&q=80' },
  { sku: '#NGV-GUCC-003', name: 'Gucci Bloom', size: '100ml', total: 0, shipping: 0, available: 0, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=50&q=80' },
  { sku: '#NGV-TOMF-004', name: 'Tom Ford Black Orchid', size: '50ml', total: 28, shipping: 2, available: 26, status: 'in_stock', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=50&q=80' },
  { sku: '#NGV-YSL-005', name: 'YSL Black Opium', size: '90ml', total: 15, shipping: 0, available: 15, status: 'in_stock', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=50&q=80' },
];

export const blogPosts = [
  { id: '#B-001', title: 'Cách chọn nước hoa theo mùa', author: 'Admin', category: 'Kiến thức', status: 'published', date: '25/02/2026', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=60&q=80' },
  { id: '#B-002', title: 'Review Dior Sauvage chi tiết', author: 'Nguyen Van A', category: 'Review', status: 'draft', date: '24/02/2026', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=60&q=80' },
  { id: '#B-003', title: 'Top 5 mùi hương mùa xuân 2026', author: 'Admin', category: 'Xu hướng', status: 'published', date: '22/02/2026', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=60&q=80' },
  { id: '#B-004', title: 'Phân biệt nước hoa thật giả', author: 'Tran Thi B', category: 'Kiến thức', status: 'hidden', date: '20/02/2026', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=60&q=80' },
  { id: '#B-005', title: 'Lịch sử thương hiệu YSL', author: 'Admin', category: 'Thương hiệu', status: 'published', date: '18/02/2026', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=60&q=80' },
];

export const chatConversations = [
  { id: 1, name: 'Võ Ngọc Vĩ', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80', lastMsg: 'Tôi muốn hỏi về chính sách bảo hành...', time: 'Vừa xong', tag: 'need_help', online: true },
  { id: 2, name: 'Nguyễn Thị Lan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80', lastMsg: 'Cảm ơn shop, mình đã nhận được hàng.', time: '15m trước', tag: 'active', online: true },
  { id: 3, name: 'Lê Hoàng Nam', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80', lastMsg: 'Sản phẩm này còn hàng không ạ?', time: '1h trước', tag: 'bot', online: false },
  { id: 4, name: 'Phạm Thị Mai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80', lastMsg: 'Shop có ship hỏa tốc không?', time: '3h trước', tag: 'done', online: false },
];

export const fmtPrice = (n) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

export const statusBadge = (s) => {
  const map = { shipping: ['badge-blue', 'Đang giao'], pending: ['badge-yellow', 'Chờ xử lý'], completed: ['badge-green', 'Hoàn thành'], cancelled: ['badge-red', 'Đã hủy'] };
  return map[s] || ['badge-gray', s];
};
