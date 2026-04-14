-- Đã gộp vào `001_blogs_status_review_media.sql` (thêm blogs.status + review_media).
-- Giữ file này để tương thích: chỉ tạo bảng review_media nếu bạn chưa chạy 001.

CREATE TABLE IF NOT EXISTS `review_media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review_id` int(11) NOT NULL,
  `media_type` enum('image','video') NOT NULL,
  `file_url` varchar(512) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_review_media_review` (`review_id`),
  CONSTRAINT `review_media_ibfk_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
