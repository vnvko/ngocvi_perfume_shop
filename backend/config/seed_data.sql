-- ============================================================
-- NGOCVI Perfume Shop — Seed Data
-- Chạy SAU KHI đã import ngocvi_perfume_shop.sql
-- Lệnh: mysql -u root -p ngocvi_perfume_shop < seed_data.sql
-- ============================================================

USE `ngocvi_perfume_shop`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ============================================================
-- 1. ROLES & PERMISSIONS
-- ============================================================

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'staff'),
(3, 'customer');

INSERT INTO `permissions` (`id`, `name`) VALUES
(1, 'manage_products'),
(2, 'manage_orders'),
(3, 'manage_users'),
(4, 'manage_blog'),
(5, 'manage_reviews'),
(6, 'manage_inventory'),
(7, 'view_dashboard');

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
-- Admin có tất cả
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),
-- Staff quản lý sản phẩm, đơn hàng, blog, review, kho, dashboard
(2,1),(2,2),(2,4),(2,5),(2,6),(2,7);


-- ============================================================
-- 2. USERS (password đều là: Admin@123 / Staff@123 / User@123)
--    Hash bcrypt rounds=10
-- ============================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `avatar`, `role_id`, `status`, `email_verified`, `created_at`) VALUES
-- Admin
(1, 'Admin NGOCVI', 'admin@ngocvi.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0901234567', NULL, 1, 'active', 1, '2024-01-01 08:00:00'),

-- Staff
(2, 'Nguyễn Thị Lan', 'lan.nguyen@ngocvi.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0912345678', NULL, 2, 'active', 1, '2024-01-05 09:00:00'),

-- Customers
(3, 'Võ Ngọc Vĩ', 'vongocvi@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0901234568', NULL, 3, 'active', 1, '2024-02-10 10:30:00'),

(4, 'Trần Minh Tuấn', 'minhtuan@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0933888999', NULL, 3, 'active', 1, '2024-02-15 14:20:00'),

(5, 'Phạm Thị Mai', 'maipham@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0977665544', NULL, 3, 'active', 1, '2024-03-01 09:15:00'),

(6, 'Lê Hoàng Nam', 'lehoangnam@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0912345679', NULL, 3, 'active', 1, '2024-03-10 16:45:00'),

(7, 'Hoàng Thúy Linh', 'thuylinh@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0988112233', NULL, 3, 'active', 1, '2024-04-01 11:00:00'),

(8, 'Nguyễn Văn An', 'nguyenvanan@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0966554433', NULL, 3, 'active', 1, '2024-04-15 08:30:00'),

(9, 'Bùi Thị Hoa', 'buithihoa@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0955443322', NULL, 3, 'active', 1, '2024-05-01 13:20:00'),

(10, 'Đặng Quốc Huy', 'dangquochuy@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8',
 '0944332211', NULL, 3, 'banned', 1, '2024-05-20 10:00:00');


-- ============================================================
-- 3. ADDRESSES
-- ============================================================

INSERT INTO `addresses` (`user_id`, `receiver_name`, `phone`, `province`, `district`, `ward`, `address_detail`, `is_default`) VALUES
(3, 'Võ Ngọc Vĩ',      '0901234568', 'TP. Hồ Chí Minh', 'Quận 1',       'Phường Bến Nghé',   '123 Đường Nguyễn Huệ', 1),
(3, 'Võ Ngọc Vĩ',      '0901234568', 'TP. Hồ Chí Minh', 'Quận 7',       'Phường Tân Phú',    '45 Nguyễn Thị Thập',  0),
(4, 'Trần Minh Tuấn',  '0933888999', 'Hà Nội',           'Quận Cầu Giấy','Phường Dịch Vọng',  '88 Trần Duy Hưng',    1),
(5, 'Phạm Thị Mai',    '0977665544', 'TP. Hồ Chí Minh', 'Quận Bình Thạnh','Phường 25',        '72 Xô Viết Nghệ Tĩnh',1),
(6, 'Lê Hoàng Nam',    '0912345679', 'Đà Nẵng',          'Quận Hải Châu', 'Phường Hải Châu 1','15 Trần Phú',         1),
(7, 'Hoàng Thúy Linh', '0988112233', 'TP. Hồ Chí Minh', 'Quận 3',       'Phường 6',          '99 Lý Chính Thắng',   1),
(8, 'Nguyễn Văn An',   '0966554433', 'TP. Hồ Chí Minh', 'Quận 10',      'Phường 12',         '201 Tô Hiến Thành',   1);


-- ============================================================
-- 4. BANNERS
-- ============================================================

INSERT INTO `banners` (`id`, `title`, `image_url`, `link`, `status`) VALUES
(1, 'Khám phá nghệ thuật hương thơm',
 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=90',
 '/products', 1),
(2, 'Bộ Sưu Tập Nước Hoa Nữ 2024',
 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&q=90',
 '/products?category=nuoc-hoa-nu', 1),
(3, 'Unisex — Tự Do Không Giới Hạn',
 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1400&q=90',
 '/products?category=unisex', 1);


-- ============================================================
-- 5. BRANDS (8 thương hiệu nổi tiếng)
-- ============================================================

INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `description`) VALUES
(1, 'Dior',          'dior',          NULL,
 'Christian Dior — nhà mốt cao cấp Pháp, biểu tượng của sự thanh lịch và quyến rũ từ năm 1947.'),
(2, 'Chanel',        'chanel',        NULL,
 'Chanel — thương hiệu thời trang và nước hoa đỉnh cao, nổi tiếng với Chanel No. 5 huyền thoại.'),
(3, 'Tom Ford',      'tom-ford',      NULL,
 'Tom Ford Beauty — dòng nước hoa luxury niche nổi tiếng với Oud Wood, Black Orchid và nhiều kiệt tác khác.'),
(4, 'Le Labo',       'le-labo',       NULL,
 'Le Labo — thương hiệu niche từ New York với triết lý "handcrafted perfumery", nổi tiếng với Santal 33.'),
(5, 'YSL',           'ysl',           NULL,
 'Yves Saint Laurent — thời trang và nước hoa Pháp đẳng cấp, nổi tiếng với Black Opium và Y EDP.'),
(6, 'Versace',       'versace',       NULL,
 'Versace — thương hiệu Ý táo bạo và mãnh liệt, nổi tiếng với Eros và Dylan Turquoise.'),
(7, 'Giorgio Armani','giorgio-armani',NULL,
 'Giorgio Armani — phong cách Ý tinh tế, nổi tiếng với Acqua di Giò và Si.'),
(8, 'Creed',         'creed',         NULL,
 'Creed — nhà nước hoa lâu đời từ thế kỷ 18, biểu tượng của tầng lớp thượng lưu với Aventus huyền thoại.');


-- ============================================================
-- 6. CATEGORIES
-- ============================================================

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Nước hoa Nam',  'nuoc-hoa-nam'),
(2, 'Nước hoa Nữ',  'nuoc-hoa-nu'),
(3, 'Unisex',        'unisex'),
(4, 'Gift Sets',     'gift-sets');


-- ============================================================
-- 7. PRODUCTS (12 sản phẩm thực tế)
-- ============================================================

INSERT INTO `products` (`id`, `name`, `slug`, `brand_id`, `category_id`, `description`, `gender`, `concentration`, `price`, `sale_price`, `status`, `created_at`) VALUES

-- ── NƯỚC HOA NAM ──
(1, 'Sauvage Eau De Parfum', 'sauvage-eau-de-parfum', 1, 1,
 'Sauvage EDP toát lên sức mạnh hoang dã và bí ẩn, lấy cảm hứng từ sa mạc trong giờ hoàng hôn ma thuật. Mùi hương mở đầu với Bergamot Calabria, tầng giữa là Sichuan Pepper nồng nàn, kết thúc với Ambroxan và Cedar. Được pha chế bởi François Demachy, Nhà sáng tạo nước hoa của Dior.',
 'male', 'EDP', 2950000, NULL, 'active', '2024-01-10 08:00:00'),

(2, 'Bleu de Chanel Parfum', 'bleu-de-chanel-parfum', 2, 1,
 'Bleu de Chanel Parfum là hương gỗ-thơm đặc biệt dành cho người đàn ông tự do và quyết đoán. Mùi hương mở bằng Citrus Peel và Pink Pepper, tầng giữa là Sandalwood và Labdanum, tầng đáy là Cedarwood và Amber. Đây là phiên bản cô đặc nhất và sang trọng nhất của dòng Bleu.',
 'male', 'Parfum', 4200000, NULL, 'active', '2024-01-12 09:00:00'),

(3, 'Sauvage Elixir', 'sauvage-elixir', 1, 1,
 'Sauvage Elixir là phiên bản mạnh mẽ và quyến rũ nhất của dòng Sauvage. Nồng độ Elixir tạo ra vệt hương đặc biệt kéo dài cả ngày. Grapefruit và Cardamom mở đầu, Nutmeg và Sandalwood ở giữa, Amber Wood và Licorice ở tầng đáy.',
 'male', 'Elixir', 5800000, NULL, 'active', '2024-02-01 10:00:00'),

(4, 'Eros Eau De Parfum', 'eros-eau-de-parfum', 6, 1,
 'Versace Eros EDP là biểu tượng của sức mạnh và sự hấp dẫn nam tính. Hương thơm mở đầu với Mint và Apple tươi mát, tầng giữa là Tonka Bean và Ambroxan gợi cảm, kết thúc với Vetiver và Cedarwood ấm áp.',
 'male', 'EDP', 2100000, 2600000, 'active', '2024-02-10 11:00:00'),

(5, 'Acqua di Giò Parfum', 'acqua-di-gio-parfum', 7, 1,
 'Acqua di Giò Parfum là sự tiến hóa hoàn hảo của hương thơm biển Địa Trung Hải. Patchouli Noir kết hợp Marine Accord tạo nên chiều sâu bí ẩn. Bergamot và Neroli mở đầu tươi sáng, Patchouli và Mineral Notes kết thúc ấm áp.',
 'male', 'Parfum', 3450000, NULL, 'active', '2024-02-15 14:00:00'),

-- ── NƯỚC HOA NỮ ──
(6, 'Coco Mademoiselle EDP Intense', 'coco-mademoiselle-edp-intense', 2, 2,
 'Coco Mademoiselle EDP Intense là phiên bản cô đặc hơn, táo bạo hơn của Coco Mademoiselle kinh điển. Orange và Jasmine mở đầu tươi sáng, tầng giữa là Rose và Ylang-Ylang quyến rũ, kết thúc với Patchouli và Vanilla nồng nàn.',
 'female', 'EDP Intense', 3800000, 4500000, 'active', '2024-01-20 10:00:00'),

(7, 'Black Opium EDP', 'black-opium-edp', 5, 2,
 'YSL Black Opium là sự kết hợp quyến rũ giữa cà phê đen và vanilla ngọt ngào. Coffee Accord và White Flowers mở đầu gợi cảm, tầng giữa là Jasmine và Licorice bí ẩn, tầng đáy là Cedar và Cashmere Wood ấm áp.',
 'female', 'EDP', 3100000, NULL, 'active', '2024-01-25 11:00:00'),

(8, 'Y EDP', 'y-edp', 5, 2,
 'YSL Y EDP dành cho người phụ nữ hiện đại, tự tin và sáng tạo. Fresh Bergamot và Lemon mở đầu, tầng giữa là Lavender và Tonka Bean, kết thúc với Sage và Vetiver. Đây là hương thơm của sự tự do.',
 'female', 'EDP', 2750000, NULL, 'active', '2024-03-01 09:00:00'),

(9, 'Si EDP', 'si-edp', 7, 2,
 'Armani Sì EDP là hương thơm của người phụ nữ mạnh mẽ và tinh tế. Blackcurrant và Freesia mở đầu tươi sáng, tầng giữa là Rose và Neroli thanh lịch, kết thúc với Patchouli và Vanilla ấm áp.',
 'female', 'EDP', 3200000, NULL, 'active', '2024-03-15 10:00:00'),

-- ── UNISEX ──
(10, 'Oud Wood EDP', 'oud-wood-edp', 3, 3,
 'Tom Ford Oud Wood là một trong những chai nước hoa unisex đắt giá và nổi tiếng nhất thế giới. Oud quý hiếm từ Đông Phương kết hợp với Sandalwood và Rosewood tạo nên hương thơm sang trọng và bí ẩn. Đây là kiệt tác trong bộ sưu tập Private Blend.',
 'unisex', 'EDP', 7500000, NULL, 'active', '2024-01-15 09:00:00'),

(11, 'Santal 33 EDP', 'santal-33-edp', 4, 3,
 'Le Labo Santal 33 là mùi hương mang tính biểu tượng nhất của thế kỷ 21. Sandalwood từ Australia kết hợp với Cardamom, Iris và Papyrus tạo nên hương thơm gợi nhớ về vùng đất miền Tây nước Mỹ. Đây là mùi nước hoa được nhận ra nhiều nhất trên thế giới.',
 'unisex', 'EDP', 6100000, NULL, 'active', '2024-01-18 10:00:00'),

(12, 'Aventus EDP', 'aventus-edp', 8, 3,
 'Creed Aventus là biểu tượng của sức mạnh và thành công, lấy cảm hứng từ cuộc đời Napoleon Bonaparte. Pineapple và Blackcurrant mở đầu tươi mát, tầng giữa là Birch và Moroccan Jasmine sang trọng, kết thúc với Musk và Oak Moss bền vững.',
 'unisex', 'EDP', 9800000, NULL, 'active', '2024-02-05 08:00:00');


-- ============================================================
-- 8. PRODUCT IMAGES
-- ============================================================

INSERT INTO `product_images` (`product_id`, `image_url`, `is_main`) VALUES
-- Sauvage EDP (1)
(1, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 1),
(1, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 0),

-- Bleu de Chanel (2)
(2, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', 1),
(2, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80', 0),

-- Sauvage Elixir (3)
(3, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 1),

-- Eros EDP (4)
(4, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 1),

-- Acqua di Giò (5)
(5, 'https://images.unsplash.com/photo-1600612253971-2f48a4e9f2f6?w=600&q=80', 1),

-- Coco Mademoiselle (6)
(6, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', 1),
(6, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 0),

-- Black Opium (7)
(7, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 1),

-- Y EDP YSL (8)
(8, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80', 1),

-- Si Armani (9)
(9, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80', 1),

-- Oud Wood (10)
(10, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 1),
(10, 'https://images.unsplash.com/photo-1600612253971-2f48a4e9f2f6?w=600&q=80', 0),

-- Santal 33 (11)
(11, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 1),

-- Aventus (12)
(12, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80', 1),
(12, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 0);


-- ============================================================
-- 9. PRODUCT VARIANTS (dung tích + giá + tồn kho)
-- ============================================================

INSERT INTO `product_variants` (`product_id`, `volume_ml`, `price`, `stock`) VALUES
-- Sauvage EDP (1) — 4 sizes
(1,  30,  1200000, 20),
(1,  60,  2100000, 35),
(1, 100,  2950000, 45),
(1, 200,  4800000, 10),

-- Bleu de Chanel Parfum (2) — 3 sizes
(2,  50,  2800000, 18),
(2, 100,  4200000, 25),
(2, 150,  5900000,  8),

-- Sauvage Elixir (3) — 2 sizes
(3,  60,  4100000, 20),
(3, 100,  5800000, 15),

-- Eros EDP (4) — 3 sizes
(4,  50,  1400000, 28),
(4, 100,  2100000, 32),
(4, 200,  3600000, 10),

-- Acqua di Giò Parfum (5) — 3 sizes
(5,  40,  1900000, 22),
(5,  75,  2750000, 30),
(5, 125,  3450000, 18),

-- Coco Mademoiselle Intense (6) — 3 sizes
(6,  35,  2100000, 15),
(6,  50,  2800000, 20),
(6, 100,  3800000, 25),

-- Black Opium (7) — 3 sizes
(7,  30,  1500000, 30),
(7,  50,  2200000, 25),
(7,  90,  3100000, 20),

-- Y EDP YSL (8) — 2 sizes
(8,  60,  2000000, 28),
(8, 100,  2750000, 22),

-- Si EDP Armani (9) — 3 sizes
(9,  30,  1600000, 18),
(9,  50,  2300000, 22),
(9, 100,  3200000, 15),

-- Oud Wood (10) — 2 sizes
(10,  50,  5000000, 12),
(10, 100,  7500000,  8),

-- Santal 33 (11) — 2 sizes
(11,  50,  3950000, 15),
(11, 100,  6100000, 10),

-- Aventus (12) — 3 sizes
(12,  50,  6500000, 12),
(12, 100,  9800000,  8),
(12, 250, 22000000,  3);


-- ============================================================
-- 10. PRODUCT TAGS
-- ============================================================

INSERT INTO `product_tags` (`id`, `name`) VALUES
(1,  'woody'),
(2,  'floral'),
(3,  'citrus'),
(4,  'oriental'),
(5,  'fresh'),
(6,  'spicy'),
(7,  'aquatic'),
(8,  'oud'),
(9,  'sweet'),
(10, 'musky');

INSERT INTO `product_tag_map` (`product_id`, `tag_id`) VALUES
(1, 1),(1, 6),(1, 5),   -- Sauvage: woody, spicy, fresh
(2, 1),(2, 3),(2, 10),  -- Bleu: woody, citrus, musky
(3, 1),(3, 6),(3, 8),   -- Sauvage Elixir: woody, spicy, oud
(4, 6),(4, 9),(4, 5),   -- Eros: spicy, sweet, fresh
(5, 7),(5, 3),(5, 10),  -- Acqua: aquatic, citrus, musky
(6, 2),(6, 4),(6, 9),   -- Coco Mademo: floral, oriental, sweet
(7, 9),(7, 4),(7, 2),   -- Black Opium: sweet, oriental, floral
(8, 2),(8, 3),(8, 5),   -- Y EDP: floral, citrus, fresh
(9, 2),(9, 3),(9, 9),   -- Si: floral, citrus, sweet
(10, 8),(10, 1),(10, 4),-- Oud Wood: oud, woody, oriental
(11, 1),(11, 10),(11, 4),-- Santal 33: woody, musky, oriental
(12, 1),(12, 3),(12, 10);-- Aventus: woody, citrus, musky


-- ============================================================
-- 11. BLOG CATEGORIES & BLOGS
-- ============================================================

INSERT INTO `blog_categories` (`id`, `name`, `slug`) VALUES
(1, 'Kiến thức',    'kien-thuc'),
(2, 'Review',       'review'),
(3, 'Xu hướng',     'xu-huong'),
(4, 'Thương hiệu',  'thuong-hieu'),
(5, 'Tips & Tricks','tips');

INSERT INTO `blogs` (`id`, `title`, `slug`, `content`, `author_id`, `category_id`, `thumbnail`, `created_at`) VALUES

(1, 'Cách chọn nước hoa theo mùa', 'cach-chon-nuoc-hoa-theo-mua', 
'Việc chọn nước hoa phù hợp với từng mùa là một nghệ thuật tinh tế mà không phải ai cũng nắm rõ. Bài viết này sẽ giúp bạn hiểu rõ hơn về cách chọn mùi hương phù hợp cho từng thời điểm trong năm.

**Mùa Xuân (tháng 3 - 5)**
Mùa xuân là thời điểm lý tưởng cho những mùi hương tươi mát, nhẹ nhàng. Hãy chọn những chai nước hoa có hương hoa tươi như Chanel Chance, Dior Miss Dior hoặc những dòng Floral Fresh. Citrus và Green Notes cũng rất phù hợp trong giai đoạn này.

**Mùa Hè (tháng 6 - 8)**
Trong tiết trời nóng bức, bạn nên chọn những mùi hương nhẹ, tươi mát và có khả năng bay nhanh. Aquatic Notes như Acqua di Giò, hay những dòng Light Citrus là lựa chọn hoàn hảo. Tránh dùng nước hoa quá nặng, Oriental hay Oud vì chúng sẽ trở nên ngột ngạt.

**Mùa Thu (tháng 9 - 11)**
Đây là mùa tuyệt vời nhất để thử những mùi hương Woody, Spicy và Oriental nhẹ. Tom Ford Oud Wood, Dior Sauvage EDP hay những dòng Amber đều phát huy tốt nhất trong tiết trời mát mẻ của mùa thu.

**Mùa Đông (tháng 12 - 2)**
Mùa đông là thời điểm hoàn hảo cho những mùi hương nồng nàn, ấm áp và bền lâu. Oriental, Oud, Amber và Gourmand là những nhóm hương thơm thể hiện tốt nhất khi nhiệt độ thấp. Creed Aventus, YSL Black Opium hay Dior Sauvage Elixir đều là những lựa chọn xuất sắc.',
1, 1,
'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
'2024-02-25 09:00:00'),

(2, 'Review chi tiết Dior Sauvage EDP — Có xứng đáng với giá tiền?', 'review-dior-sauvage-edp',
'Dior Sauvage EDP là một trong những chai nước hoa bán chạy nhất thế giới. Nhưng liệu nó có thực sự xứng đáng với mức giá cao cấp mà hãng đặt ra? Hãy cùng NGOCVI đánh giá chi tiết từng khía cạnh.

**Mùi hương mở đầu (Top Notes)**
Khi vừa xịt, Bergamot Calabria xuất hiện rực rỡ, tươi sáng và cực kỳ ấn tượng. Đây là điểm mạnh đặc trưng của dòng Sauvage — sự tươi mát ban đầu cực kỳ thu hút.

**Mùi hương trái tim (Heart Notes)**
Sichuan Pepper dần xuất hiện sau 15-20 phút, tạo ra chiều sâu và sự bí ẩn. Đây là điểm khác biệt lớn nhất giữa EDT và EDP của Sauvage. EDP mang lại sự ấm áp và phức tạp hơn nhiều.

**Mùi hương nền (Base Notes)**
Ambroxan — thành phần đặc trưng của dòng Sauvage, kết hợp với Cedar tạo ra vệt hương kéo dài 8-12 tiếng. Đây chính là lý do Sauvage EDP được mệnh danh là "king of office fragrances".

**Verdict**
★★★★☆ (4.5/5) — Sauvage EDP xứng đáng với mức giá. Đây là chai nước hoa toàn năng nhất dành cho nam giới.',
2, 2,
'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
'2024-03-01 10:00:00'),

(3, 'Top 5 mùi hương trending năm 2024', 'top-5-mui-huong-trending-2024',
'Năm 2024 chứng kiến sự trở lại mạnh mẽ của những mùi hương Woody Oriental và sự bùng nổ của dòng Clean Musky. Dưới đây là 5 xu hướng nổi bật nhất năm nay.

1. **Oud Wood — Tom Ford**: Vẫn là biểu tượng của luxury niche fragrance, Oud Wood tiếp tục dẫn đầu danh sách những chai được tìm kiếm nhiều nhất.

2. **Santal 33 — Le Labo**: Hương gỗ đàn hương đặc trưng này đã trở thành "mùi hương của thế kỷ" và ngày càng phổ biến hơn tại Việt Nam.

3. **Sauvage Elixir — Dior**: Phiên bản mới nhất của dòng Sauvage, mạnh mẽ hơn và quyến rũ hơn, đang chiếm lĩnh thị trường.

4. **Black Opium — YSL**: Hương cà phê ngọt ngào vẫn là lựa chọn số 1 cho phái nữ trong năm nay.

5. **Aventus — Creed**: Chai nước hoa "cho người thành đạt" vẫn giữ vững vị trí top đầu mặc dù giá không hề rẻ.',
1, 3,
'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80',
'2024-03-10 11:00:00'),

(4, 'Lịch sử thương hiệu Chanel — Từ tiệm may đến đế chế nước hoa', 'lich-su-thuong-hieu-chanel',
'Câu chuyện của Chanel bắt đầu từ năm 1910 khi Gabrielle "Coco" Chanel mở tiệm mũ nhỏ tại Paris. Hành trình từ đó đến khi trở thành một trong những thương hiệu xa xỉ nhất thế giới là một câu chuyện đầy cảm hứng.

**1921 — Chanel No. 5 Ra Đời**
Chanel No. 5 là chai nước hoa đầu tiên được tạo ra bởi nhà điều chế Ernest Beaux theo yêu cầu của Coco Chanel. Đây là lần đầu tiên trong lịch sử, aldehydes được sử dụng trong nước hoa, tạo ra một mùi hương hoàn toàn mới.

**Biểu Tượng Văn Hóa**
Marilyn Monroe nổi tiếng với câu nói "The only thing I wear to bed is a few drops of Chanel No. 5". Kể từ đó, Chanel No. 5 trở thành biểu tượng của sự sang trọng và quyến rũ.',
2, 4,
'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80',
'2024-03-20 09:00:00'),

(5, '7 mẹo giúp nước hoa lưu hương lâu hơn', '7-meo-giup-nuoc-hoa-luu-huong-lau-hon',
'Bạn đã bao giờ xịt nước hoa buổi sáng nhưng chỉ sau vài tiếng đã không còn cảm nhận được mùi? Đây là 7 bí quyết giúp nước hoa của bạn tỏa hương bền lâu hơn.

1. **Xịt vào điểm mạch (pulse points)**: Cổ tay, sau tai, vùng cổ, khuỷu tay — những nơi có mạch máu gần da giúp khuếch tán mùi hương tốt hơn.

2. **Dưỡng ẩm trước khi xịt**: Da khô "ăn" mùi nước hoa nhanh hơn. Hãy thoa kem dưỡng thể hoặc vaseline trước khi xịt để tạo lớp nền giữ hương.

3. **Không chà xát sau khi xịt**: Cử chỉ này phá vỡ cấu trúc phân tử của nước hoa, làm mất đi các top notes quý giá.

4. **Bảo quản đúng cách**: Tránh ánh nắng trực tiếp, nhiệt độ cao và ẩm ướt. Tủ lạnh hoặc ngăn tối mát là lý tưởng nhất.

5. **Chọn nồng độ phù hợp**: EDP > EDT > EDC về độ bền hương. Nếu cần hương lâu, hãy chọn EDP hoặc Parfum.',
1, 5,
'https://images.unsplash.com/photo-1600612253971-2f48a4e9f2f6?w=600&q=80',
'2024-04-01 10:00:00'),

(6, 'Phân biệt nước hoa thật và hàng nhái — Cẩm nang cho người mới', 'phan-biet-nuoc-hoa-that-hang-nhai',
'Thị trường nước hoa đang tràn ngập hàng nhái, hàng kém chất lượng với giá rẻ bất ngờ. Làm thế nào để tự bảo vệ mình? Dưới đây là những dấu hiệu nhận biết nước hoa chính hãng.

**Kiểm tra tem và mã vạch**
Nước hoa chính hãng luôn có tem chống hàng giả, mã vạch có thể check được trên website của hãng. Dior, Chanel, Tom Ford đều có hệ thống verify online.

**Quan sát bao bì**
Chất lượng hộp, font chữ, logo in rõ nét — đây là những chi tiết mà hàng giả thường không làm được hoàn hảo. Hãy so sánh với ảnh chính hãng trên website.

**Kiểm tra mùi hương**
Nước hoa thật có sự phát triển rõ ràng từ top notes → heart notes → base notes. Hàng giả thường chỉ có một mùi đơn điệu và bay đi rất nhanh.

**Mua tại đại lý uy tín**
NGOCVI cam kết 100% hàng chính hãng, có hóa đơn và chứng từ nhập khẩu rõ ràng.',
2, 1,
'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
'2024-04-15 14:00:00');


-- ============================================================
-- 12. VOUCHERS
-- ============================================================

INSERT INTO `vouchers` (`id`, `code`, `discount_type`, `discount_value`, `max_discount`, `min_order_value`, `quantity`, `start_date`, `end_date`) VALUES
(1, 'WELCOME10', 'percent', 10.00, 200000.00, 500000.00,   100, '2024-01-01 00:00:00', '2025-12-31 23:59:59'),
(2, 'GIAMGIA50', 'fixed',   50000, NULL,       300000.00,    50, '2024-01-01 00:00:00', '2025-12-31 23:59:59'),
(3, 'VIP200',    'fixed',  200000, NULL,       2000000.00,   30, '2024-01-01 00:00:00', '2025-06-30 23:59:59'),
(4, 'SAVE15',   'percent', 15.00,  300000.00,  1000000.00,   50, '2024-03-01 00:00:00', '2025-12-31 23:59:59'),
(5, 'FREESHIP', 'fixed',   35000,  NULL,        100000.00,  200, '2024-01-01 00:00:00', '2025-12-31 23:59:59');


-- ============================================================
-- 13. CARTS (giỏ hàng đang mở)
-- ============================================================

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(1, 3, '2024-05-01 10:00:00'),
(2, 4, '2024-05-02 11:00:00'),
(3, 5, '2024-05-03 09:00:00'),
(4, 6, '2024-05-04 14:00:00');

INSERT INTO `cart_items` (`cart_id`, `product_id`, `variant_id`, `quantity`) VALUES
(1, 1,  3, 1),  -- user 3: Sauvage EDP 100ml
(1, 10, 21, 1), -- user 3: Oud Wood 50ml
(2, 7,  18, 2), -- user 4: Black Opium 50ml x2
(3, 6,  16, 1), -- user 5: Coco Mademoiselle 50ml
(4, 2,  6,  1); -- user 6: Bleu Chanel 100ml


-- ============================================================
-- 14. ORDERS (10 đơn hàng mẫu với nhiều trạng thái)
-- ============================================================

INSERT INTO `orders` (`id`, `user_id`, `order_code`, `total_price`, `shipping_fee`, `discount`, `payment_method`, `status`, `created_at`) VALUES
(1,  3, 'NGV-20240501-001', 5900000,  0,      0,      'COD',    'completed', '2024-05-01 10:30:00'),
(2,  4, 'NGV-20240502-002', 3450000,  35000,  0,      'COD',    'completed', '2024-05-02 14:20:00'),
(3,  5, 'NGV-20240503-003', 9800000,  0,      200000, 'ONLINE', 'completed', '2024-05-03 09:15:00'),
(4,  6, 'NGV-20240510-004', 2950000,  0,      0,      'COD',    'shipping',  '2024-05-10 16:45:00'),
(5,  7, 'NGV-20240515-005', 7500000,  0,      0,      'ONLINE', 'shipping',  '2024-05-15 11:00:00'),
(6,  8, 'NGV-20240520-006', 4200000,  0,      50000,  'COD',    'confirmed', '2024-05-20 08:30:00'),
(7,  9, 'NGV-20240521-007', 6100000,  0,      0,      'ONLINE', 'confirmed', '2024-05-21 13:20:00'),
(8,  3, 'NGV-20240522-008', 3800000,  35000,  0,      'COD',    'pending',   '2024-05-22 10:00:00'),
(9,  4, 'NGV-20240523-009', 2100000,  35000,  0,      'COD',    'cancelled', '2024-05-23 15:30:00'),
(10, 5, 'NGV-20240524-010', 12400000, 0,      300000, 'ONLINE', 'pending',   '2024-05-24 09:45:00');

INSERT INTO `order_items` (`order_id`, `product_id`, `variant_id`, `price`, `quantity`) VALUES
-- Đơn 1 — user 3: Sauvage 100ml + Oud Wood 50ml
(1,  1,  3,  2950000, 1),
(1, 10, 21, 5000000, 1),

-- Đơn 2 — user 4: Black Opium 90ml (giá gốc 3450000 - 35000 ship = 3450000)
(2,  7, 19, 3100000, 1),

-- Đơn 3 — user 5: Aventus 100ml
(3, 12, 27, 9800000, 1),

-- Đơn 4 — user 6: Sauvage EDP 100ml
(4,  1,  3, 2950000, 1),

-- Đơn 5 — user 7: Oud Wood 100ml
(5, 10, 22, 7500000, 1),

-- Đơn 6 — user 8: Bleu de Chanel 100ml
(6,  2,  6, 4200000, 1),

-- Đơn 7 — user 9: Santal 33 100ml
(7, 11, 24, 6100000, 1),

-- Đơn 8 — user 3: Coco Mademoiselle 100ml
(8,  6, 17, 3800000, 1),

-- Đơn 9 — user 4: Eros EDP 100ml (đã hủy)
(9,  4, 11, 2100000, 1),

-- Đơn 10 — user 5: Sauvage Elixir 100ml + Aventus 50ml
(10, 3,  9, 5800000, 1),
(10, 12, 26, 6500000, 1);

INSERT INTO `order_status_history` (`order_id`, `status`, `updated_at`) VALUES
(1, 'pending',   '2024-05-01 10:30:00'),
(1, 'confirmed', '2024-05-01 14:00:00'),
(1, 'shipping',  '2024-05-02 08:00:00'),
(1, 'completed', '2024-05-04 15:30:00'),

(2, 'pending',   '2024-05-02 14:20:00'),
(2, 'confirmed', '2024-05-02 16:00:00'),
(2, 'shipping',  '2024-05-03 08:00:00'),
(2, 'completed', '2024-05-05 14:00:00'),

(3, 'pending',   '2024-05-03 09:15:00'),
(3, 'confirmed', '2024-05-03 10:00:00'),
(3, 'shipping',  '2024-05-04 08:00:00'),
(3, 'completed', '2024-05-06 16:00:00'),

(4, 'pending',   '2024-05-10 16:45:00'),
(4, 'confirmed', '2024-05-11 09:00:00'),
(4, 'shipping',  '2024-05-12 08:00:00'),

(5, 'pending',   '2024-05-15 11:00:00'),
(5, 'confirmed', '2024-05-15 14:00:00'),
(5, 'shipping',  '2024-05-16 08:00:00'),

(6, 'pending',   '2024-05-20 08:30:00'),
(6, 'confirmed', '2024-05-20 10:00:00'),

(7, 'pending',   '2024-05-21 13:20:00'),
(7, 'confirmed', '2024-05-21 15:00:00'),

(8, 'pending',   '2024-05-22 10:00:00'),
(9, 'pending',   '2024-05-23 15:30:00'),
(9, 'cancelled', '2024-05-23 18:00:00'),
(10,'pending',   '2024-05-24 09:45:00');


-- ============================================================
-- 15. INVENTORY LOGS (lịch sử nhập/xuất kho)
-- ============================================================

INSERT INTO `inventory_logs` (`product_id`, `variant_id`, `change_type`, `quantity`, `created_at`) VALUES
-- Nhập kho ban đầu
(1,  1,  'import', 20, '2024-01-01 08:00:00'),
(1,  2,  'import', 35, '2024-01-01 08:00:00'),
(1,  3,  'import', 50, '2024-01-01 08:00:00'),
(1,  4,  'import', 10, '2024-01-01 08:00:00'),
(10, 21, 'import', 15, '2024-01-01 08:00:00'),
(10, 22, 'import', 10, '2024-01-01 08:00:00'),
(12, 26, 'import', 15, '2024-01-01 08:00:00'),
(12, 27, 'import', 10, '2024-01-01 08:00:00'),
-- Xuất kho theo đơn hàng
(1,  3,  'export', 1, '2024-05-01 10:30:00'),
(10, 21, 'export', 1, '2024-05-01 10:30:00'),
(7,  19, 'export', 1, '2024-05-02 14:20:00'),
(12, 27, 'export', 1, '2024-05-03 09:15:00');


-- ============================================================
-- 16. REVIEWS (đánh giá sản phẩm — có kèm phân tích rating)
-- ============================================================

INSERT INTO `reviews` (`user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`) VALUES
-- Sauvage EDP (product 1)
(3, 1, 5, 'Mùi hương tuyệt vời, nam tính và lưu hương cực lâu. Dùng từ sáng đến chiều vẫn còn mùi thơm. Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop!', 'visible', '2024-05-05 10:00:00'),
(4, 1, 5, 'Đây là chai nước hoa nam số 1 của tôi. Ambroxan trong Sauvage EDP không bao giờ lỗi thời. Chính hãng 100%, check mã code OK.', 'visible', '2024-05-06 14:00:00'),
(8, 1, 4, 'Rất hài lòng với Sauvage EDP, mùi sang và bền. Chỉ tiếc là giá hơi cao nhưng xứng đáng với chất lượng. Shop tư vấn nhiệt tình.', 'visible', '2024-05-10 11:00:00'),

-- Bleu de Chanel Parfum (product 2)
(5, 2, 5, 'Bleu Parfum thực sự là đỉnh của dòng Bleu. Gỗ và Amber hòa quyện hoàn hảo. Dùng 1-2 xịt là đủ cho cả ngày. Giá cao nhưng hoàn toàn xứng đáng!', 'visible', '2024-05-20 09:00:00'),
(6, 2, 4, 'Mùi thanh lịch, phù hợp đi làm văn phòng. Tuy nhiên so với EDT thì Parfum hơi nặng hơn với người mới. Nhìn chung rất hài lòng.', 'visible', '2024-05-21 15:00:00'),

-- Coco Mademoiselle (product 6)
(3, 6, 5, 'Coco Mademoiselle Intense thực sự xứng đáng là nữ hoàng nước hoa. Jasmine và Rose hòa quyện tuyệt vời. Lưu hương đến 10 tiếng. Quá tuyệt!', 'visible', '2024-05-25 10:00:00'),
(9, 6, 4, 'Mùi hương sang trọng, phù hợp đi tiệc. Tầng hương phát triển rất đẹp theo từng giờ. Hơi ngọt với người mới nhưng quen rồi rất mê.', 'visible', '2024-05-26 14:00:00'),

-- Black Opium (product 7)
(7, 7, 5, 'Black Opium là mùi nước hoa yêu thích nhất của tôi! Hương cà phê và vanilla đặc trưng, gợi cảm và bí ẩn. Mùa đông dùng quá hợp.', 'visible', '2024-05-22 11:00:00'),
(4, 7, 5, 'Mùi độc lạ, khó quên. Ai nếm qua Black Opium đều không thể quên được. Shop giao hàng siêu nhanh, đóng gói đẹp.', 'visible', '2024-05-23 09:00:00'),
(8, 7, 3, 'Mùi hơi ngọt quá so với tôi mong đợi, cảm giác hơi ngộp khi dùng nhiều. Nhưng độ lưu hương rất tốt. Phù hợp mùa lạnh hơn.', 'visible', '2024-05-25 16:00:00'),

-- Oud Wood (product 10)
(5, 10, 5, 'Tom Ford Oud Wood là đỉnh của nước hoa luxury. Oud quý hiếm, gỗ đàn hương ấm áp. Một chai dùng được cho mọi dịp. Đáng đầu tư!', 'visible', '2024-05-07 10:00:00'),
(6, 10, 5, 'Lần đầu ngửi Oud Wood tôi đã bị "say" ngay lập tức. Hương thơm của sự sang trọng và đẳng cấp. Giao hàng đúng hẹn, sản phẩm chính hãng.', 'visible', '2024-05-08 14:00:00'),

-- Santal 33 (product 11)
(7, 11, 4, 'Santal 33 có mùi hương rất đặc biệt, không giống bất kỳ chai nào tôi từng dùng. Gỗ đàn hương ấm áp, unisex hoàn hảo.', 'visible', '2024-05-22 15:00:00'),
(9, 11, 4, 'Đây là mùi hương tôi tìm kiếm từ lâu. Santal 33 vừa masculine vừa feminine, phù hợp cho cả hai giới. Giá cao nhưng chất lượng tương xứng.', 'visible', '2024-05-23 11:00:00'),

-- Aventus (product 12)
(5, 12, 5, 'Aventus xứng đáng với danh tiếng huyền thoại của nó. Pineapple và Birch tạo nên sự tươi mát và nam tính hiếm có. Đây là chai nước hoa tôi tự thưởng cho bản thân.', 'visible', '2024-05-07 11:00:00');


-- ============================================================
-- 17. WISHLISTS
-- ============================================================

INSERT INTO `wishlists` (`user_id`, `product_id`, `created_at`) VALUES
(3,  2, '2024-05-01 09:00:00'),
(3, 11, '2024-05-01 09:05:00'),
(3, 12, '2024-05-01 09:10:00'),
(4,  1, '2024-05-02 10:00:00'),
(4,  6, '2024-05-02 10:05:00'),
(5, 10, '2024-05-03 08:00:00'),
(5,  3, '2024-05-03 08:05:00'),
(6,  7, '2024-05-04 11:00:00'),
(7,  2, '2024-05-05 14:00:00'),
(7,  9, '2024-05-05 14:05:00');


-- ============================================================
-- 18. VOUCHER USAGE (đã sử dụng)
-- ============================================================

INSERT INTO `voucher_usage` (`voucher_id`, `user_id`, `order_id`) VALUES
(1, 5, 3),   -- user 5 dùng WELCOME10 cho đơn 3
(3, 5, 10),  -- user 5 dùng VIP200 cho đơn 10
(2, 8, 6);   -- user 8 dùng GIAMGIA50 cho đơn 6


-- ============================================================
-- 19. QUIZ QUESTIONS & OPTIONS
-- ============================================================

INSERT INTO `quiz_questions` (`id`, `question`) VALUES
(1, 'Bạn thuộc giới tính nào?'),
(2, 'Bạn thích mùi hương nào nhất?'),
(3, 'Bạn thường dùng nước hoa khi nào?'),
(4, 'Độ lưu hương bạn muốn?'),
(5, 'Ngân sách của bạn?');

INSERT INTO `quiz_options` (`question_id`, `option_text`, `tag`) VALUES
-- Câu 1
(1, 'Nam',    'male'),
(1, 'Nữ',     'female'),
(1, 'Unisex', 'unisex'),
-- Câu 2
(2, 'Hoa tươi nhẹ nhàng',  'floral'),
(2, 'Gỗ & Đất ấm áp',      'woody'),
(2, 'Citrus tươi mát',      'citrus'),
(2, 'Huyền bí & Gợi cảm',  'oriental'),
-- Câu 3
(3, 'Đi làm hàng ngày',    'daily'),
(3, 'Buổi tối / Hẹn hò',   'evening'),
(3, 'Thể thao / Năng động', 'sport'),
(3, 'Sự kiện đặc biệt',    'special'),
-- Câu 4
(4, 'Nhẹ nhàng (2-4h)',    'light'),
(4, 'Vừa phải (4-8h)',      'moderate'),
(4, 'Lâu bền (8h+)',        'longlasting'),
-- Câu 5
(5, 'Dưới 1.5 triệu',  'budget'),
(5, '1.5 – 3 triệu',   'mid'),
(5, 'Trên 3 triệu',    'premium');


-- ============================================================
-- 20. CONVERSATIONS & MESSAGES (chatbox mẫu)
-- ============================================================

INSERT INTO `conversations` (`id`, `user_id`, `created_at`) VALUES
(1, 3, '2024-05-10 10:00:00'),
(2, 4, '2024-05-11 14:00:00'),
(3, 5, '2024-05-12 09:00:00');

INSERT INTO `messages` (`conversation_id`, `sender_type`, `message`, `created_at`) VALUES
-- Conversation 1 — user 3 hỏi về Sauvage
(1, 'bot',   'Xin chào! Em là trợ lý ảo của NGOCVI Boutique. Em có thể giúp gì cho anh/chị ạ?', '2024-05-10 10:00:00'),
(1, 'user',  'Cho mình hỏi Sauvage EDP 100ml hiện tại còn hàng không?', '2024-05-10 10:02:00'),
(1, 'bot',   'Dạ, Dior Sauvage EDP 100ml hiện đang còn hàng với giá 2.950.000đ ạ. Anh/chị có muốn thêm vào giỏ hàng không?', '2024-05-10 10:02:30'),
(1, 'user',  'Còn hàng chính hãng không? Có tem chống giả không?', '2024-05-10 10:05:00'),
(1, 'admin', 'Chào anh! Em là nhân viên tư vấn của NGOCVI. Tất cả sản phẩm bên em đều là hàng chính hãng 100%, có tem chống hàng giả của Dior, có thể check mã online. Bên em còn có bảo hành mùi hương 30 ngày ạ.', '2024-05-10 10:10:00'),
(1, 'user',  'OK cảm ơn bạn, mình sẽ đặt hàng!', '2024-05-10 10:12:00'),

-- Conversation 2 — user 4 hỏi về chính sách
(2, 'bot',   'Xin chào! Em là trợ lý ảo của NGOCVI Boutique. Em có thể giúp gì cho anh/chị ạ?', '2024-05-11 14:00:00'),
(2, 'user',  'Chính sách vận chuyển của shop như thế nào?', '2024-05-11 14:02:00'),
(2, 'bot',   'Dạ shop miễn phí vận chuyển cho đơn từ 500K. Giao hàng toàn quốc 3-5 ngày ạ. Nội thành HCM có giao hỏa tốc 4h.', '2024-05-11 14:02:30'),

-- Conversation 3 — user 5 hỏi về Tom Ford
(3, 'bot',   'Xin chào! Em là trợ lý ảo của NGOCVI Boutique. Em có thể giúp gì cho anh/chị ạ?', '2024-05-12 09:00:00'),
(3, 'user',  'Shop có Tom Ford Oud Wood không? Giá bao nhiêu?', '2024-05-12 09:02:00'),
(3, 'bot',   'Dạ, Tom Ford Oud Wood EDP đang có 2 size: 50ml giá 5.000.000đ và 100ml giá 7.500.000đ ạ. Đây là dòng Private Blend nổi tiếng của Tom Ford ạ.', '2024-05-12 09:02:30'),
(3, 'user',  'Giá hơi cao nhỉ, có giảm giá không?', '2024-05-12 09:05:00'),
(3, 'admin', 'Chào chị! Oud Wood là dòng Private Blend cao cấp nên giá là cố định ạ. Tuy nhiên nếu chị có mã VIP200 thì được giảm 200K cho đơn từ 2 triệu. Chị cũng có thể check voucher WELCOME10 để được giảm 10% ạ!', '2024-05-12 09:15:00');


-- ============================================================
-- 21. PRODUCT VIEWS (lịch sử xem sản phẩm)
-- ============================================================

INSERT INTO `product_views` (`product_id`, `user_id`, `viewed_at`) VALUES
(1, 3, '2024-05-01 09:00:00'), (1, 4, '2024-05-01 10:00:00'),
(1, 5, '2024-05-02 09:00:00'), (1, 6, '2024-05-02 11:00:00'),
(2, 3, '2024-05-01 09:10:00'), (2, 7, '2024-05-03 14:00:00'),
(10,5, '2024-05-03 08:00:00'), (10,6, '2024-05-04 09:00:00'),
(12,5, '2024-05-03 08:10:00'), (12,8, '2024-05-05 10:00:00'),
(6, 3, '2024-05-05 11:00:00'), (7, 7, '2024-05-10 09:00:00'),
(11,7, '2024-05-15 14:00:00'),(11,9, '2024-05-16 10:00:00');


-- ============================================================
-- DONE — Restore FK checks
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;

SELECT '✅ Seed data đã import thành công!' AS result;
SELECT CONCAT('- Users: ', COUNT(*)) AS info FROM users
UNION ALL SELECT CONCAT('- Products: ', COUNT(*)) FROM products
UNION ALL SELECT CONCAT('- Orders: ', COUNT(*)) FROM orders
UNION ALL SELECT CONCAT('- Reviews: ', COUNT(*)) FROM reviews
UNION ALL SELECT CONCAT('- Blogs: ', COUNT(*)) FROM blogs
UNION ALL SELECT CONCAT('- Vouchers: ', COUNT(*)) FROM vouchers;
