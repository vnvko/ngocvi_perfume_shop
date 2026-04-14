-- Chạy một lần trên DB cũ (chưa có cột blogs.status / bảng review_media).
-- Nếu báo lỗi "Duplicate column" / "Duplicate key", bỏ dòng tương ứng và chạy phần còn lại.

ALTER TABLE `blogs`
  ADD COLUMN `status` enum('published','draft','hidden') NOT NULL DEFAULT 'published' AFTER `thumbnail`,
  ADD KEY `status` (`status`);

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
