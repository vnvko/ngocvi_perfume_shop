-- ============================================================
-- NGOCVI Perfume Shop - Seed Data
-- Chạy sau khi đã import ngocvi_perfume_shop.sql
-- ============================================================

USE ngocvi_perfume_shop;

-- ── Roles ──
INSERT INTO roles (id, name) VALUES
  (1, 'admin'),
  (2, 'staff'),
  (3, 'customer')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ── Permissions ──
INSERT INTO permissions (id, name) VALUES
  (1, 'manage_products'),
  (2, 'manage_orders'),
  (3, 'manage_users'),
  (4, 'manage_blog'),
  (5, 'view_dashboard')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ── Role Permissions ──
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
  (2, 1), (2, 2), (2, 4), (2, 5)
ON DUPLICATE KEY UPDATE permission_id = VALUES(permission_id);

-- ── Admin User ──
-- Password: Admin@123 (bcrypt hash)
INSERT INTO users (name, email, password, phone, role_id, status)
VALUES (
  'Admin NGOCVI',
  'admin@ngocvi.com',
  '$2a$10$rMVp3vLT3nO9.w4sU8jYp.X9nT1O8fXnG0Zw6rQHzXEOJ2vRpqBkG',
  '0901234567',
  1,
  'active'
) ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ── Categories ──
INSERT INTO categories (name, slug) VALUES
  ('Nước hoa Nam', 'nuoc-hoa-nam'),
  ('Nước hoa Nữ', 'nuoc-hoa-nu'),
  ('Unisex', 'unisex'),
  ('Gift Sets', 'gift-sets')
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

-- ── Brands ──
INSERT INTO brands (name, slug, description) VALUES
  ('Dior', 'dior', 'Nhà mốt cao cấp Pháp - Christian Dior'),
  ('Chanel', 'chanel', 'Biểu tượng thời trang và nước hoa Pháp'),
  ('Tom Ford', 'tom-ford', 'Luxury niche perfume từ nhà thiết kế Tom Ford'),
  ('Le Labo', 'le-labo', 'Niche perfume New York với công thức độc đáo'),
  ('YSL', 'ysl', 'Yves Saint Laurent - Thời trang và nước hoa cao cấp'),
  ('Versace', 'versace', 'Thương hiệu Ý sang trọng và táo bạo'),
  ('Giorgio Armani', 'giorgio-armani', 'Armani - Phong cách Ý tinh tế'),
  ('Creed', 'creed', 'Nhà nước hoa lâu đời từ thế kỷ 18')
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

-- ── Blog Categories ──
INSERT INTO blog_categories (name, slug) VALUES
  ('Kiến thức', 'kien-thuc'),
  ('Selection Guide', 'selection-guide'),
  ('Xu hướng', 'xu-huong'),
  ('Brand Reviews', 'brand-reviews'),
  ('Tips', 'tips')
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

-- ── Sample Banners ──
INSERT INTO banners (title, image_url, link, status) VALUES
  ('Khám phá nghệ thuật hương thơm', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=90', '/products', 1),
  ('Bộ Sưu Tập Mùa Mới', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1400&q=90', '/products', 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ── Sample Products ──
INSERT INTO products (name, slug, brand_id, category_id, description, gender, concentration, price, sale_price, status) VALUES
  ('Sauvage Eau De Parfum',
   'sauvage-eau-de-parfum',
   (SELECT id FROM brands WHERE slug = 'dior'),
   (SELECT id FROM categories WHERE slug = 'nuoc-hoa-nam'),
   'Sauvage Eau de Parfum toát lên sự cảm và bí ẩn, lấy cảm hứng từ sa mạc trong giờ hoàng hôn ma thuật. Được pha chế bởi François Demachy, Nhà sáng tạo nước hoa của Dior.',
   'male', 'EDP', 2950000, NULL, 'active'),

  ('Bleu de Chanel Parfum',
   'bleu-de-chanel-parfum',
   (SELECT id FROM brands WHERE slug = 'chanel'),
   (SELECT id FROM categories WHERE slug = 'nuoc-hoa-nam'),
   'Bleu de Chanel là một hương gỗ-thơm đặc biệt dành cho người đàn ông tự do và quyết đoán.',
   'male', 'Parfum', 4200000, NULL, 'active'),

  ('Coco Mademoiselle',
   'coco-mademoiselle',
   (SELECT id FROM brands WHERE slug = 'chanel'),
   (SELECT id FROM categories WHERE slug = 'nuoc-hoa-nu'),
   'Coco Mademoiselle là hương thơm Oriental tươi mát và quyến rũ, dành cho người phụ nữ hiện đại và tự tin.',
   'female', 'EDP', 3800000, 4500000, 'active'),

  ('Oud Wood',
   'oud-wood',
   (SELECT id FROM brands WHERE slug = 'tom-ford'),
   (SELECT id FROM categories WHERE slug = 'unisex'),
   'Oud Wood của Tom Ford mang đến trải nghiệm nước hoa Trung Đông huyền bí với gỗ Oud quý hiếm.',
   'unisex', 'EDP', 7500000, NULL, 'active'),

  ('Santal 33',
   'santal-33',
   (SELECT id FROM brands WHERE slug = 'le-labo'),
   (SELECT id FROM categories WHERE slug = 'unisex'),
   'Santal 33 là mùi hương mang tính biểu tượng nhất của Le Labo. Hương gỗ đàn hương ấm áp và độc đáo.',
   'unisex', 'EDP', 6100000, NULL, 'active')
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

-- ── Product Variants ──
INSERT INTO product_variants (product_id, volume_ml, price, stock)
SELECT p.id, 30, p.price * 0.6, 20 FROM products p WHERE p.slug = 'sauvage-eau-de-parfum'
UNION ALL
SELECT p.id, 60, p.price * 0.8, 35 FROM products p WHERE p.slug = 'sauvage-eau-de-parfum'
UNION ALL
SELECT p.id, 100, p.price, 45 FROM products p WHERE p.slug = 'sauvage-eau-de-parfum'
UNION ALL
SELECT p.id, 200, p.price * 1.6, 15 FROM products p WHERE p.slug = 'sauvage-eau-de-parfum'
UNION ALL
SELECT p.id, 50, p.price * 0.65, 20 FROM products p WHERE p.slug = 'bleu-de-chanel-parfum'
UNION ALL
SELECT p.id, 100, p.price, 30 FROM products p WHERE p.slug = 'bleu-de-chanel-parfum'
UNION ALL
SELECT p.id, 35, p.price * 0.5, 25 FROM products p WHERE p.slug = 'coco-mademoiselle'
UNION ALL
SELECT p.id, 50, p.price * 0.65, 20 FROM products p WHERE p.slug = 'coco-mademoiselle'
UNION ALL
SELECT p.id, 100, p.price, 40 FROM products p WHERE p.slug = 'coco-mademoiselle'
UNION ALL
SELECT p.id, 50, p.price * 0.65, 12 FROM products p WHERE p.slug = 'oud-wood'
UNION ALL
SELECT p.id, 100, p.price, 8 FROM products p WHERE p.slug = 'oud-wood'
UNION ALL
SELECT p.id, 50, p.price * 0.65, 15 FROM products p WHERE p.slug = 'santal-33'
UNION ALL
SELECT p.id, 100, p.price, 10 FROM products p WHERE p.slug = 'santal-33';

-- ── Product Images ──
INSERT INTO product_images (product_id, image_url, is_main)
SELECT p.id, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 1
FROM products p WHERE p.slug = 'sauvage-eau-de-parfum'
UNION ALL
SELECT p.id, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 1
FROM products p WHERE p.slug = 'bleu-de-chanel-parfum'
UNION ALL
SELECT p.id, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', 1
FROM products p WHERE p.slug = 'coco-mademoiselle'
UNION ALL
SELECT p.id, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 1
FROM products p WHERE p.slug = 'oud-wood'
UNION ALL
SELECT p.id, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 1
FROM products p WHERE p.slug = 'santal-33';

-- ── Sample Voucher ──
INSERT INTO vouchers (code, discount_type, discount_value, max_discount, min_order_value, quantity, start_date, end_date)
VALUES
  ('WELCOME10', 'percent', 10, 200000, 500000, 100, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
  ('GIAMGIA50', 'fixed', 50000, NULL, 300000, 50, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH))
ON DUPLICATE KEY UPDATE code = VALUES(code);

SELECT 'Seed data inserted successfully!' as result;
