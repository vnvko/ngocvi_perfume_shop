-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2026 at 12:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ngocvi_perfume_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `receiver_name` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `address_detail` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `receiver_name`, `phone`, `province`, `district`, `ward`, `address_detail`, `is_default`) VALUES
(1, 3, 'Võ Ngọc Vĩ', '0901234568', 'TP. Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', '123 Đường Nguyễn Huệ', 1),
(2, 3, 'Võ Ngọc Vĩ', '0901234568', 'TP. Hồ Chí Minh', 'Quận 7', 'Phường Tân Phú', '45 Nguyễn Thị Thập', 0),
(3, 4, 'Trần Minh Tuấn', '0933888999', 'Hà Nội', 'Quận Cầu Giấy', 'Phường Dịch Vọng', '88 Trần Duy Hưng', 1),
(4, 5, 'Phạm Thị Mai', '0977665544', 'TP. Hồ Chí Minh', 'Quận Bình Thạnh', 'Phường 25', '72 Xô Viết Nghệ Tĩnh', 1),
(5, 6, 'Lê Hoàng Nam', '0912345679', 'Đà Nẵng', 'Quận Hải Châu', 'Phường Hải Châu 1', '15 Trần Phú', 1),
(6, 7, 'Hoàng Thúy Linh', '0988112233', 'TP. Hồ Chí Minh', 'Quận 3', 'Phường 6', '99 Lý Chính Thắng', 1),
(7, 8, 'Nguyễn Văn An', '0966554433', 'TP. Hồ Chí Minh', 'Quận 10', 'Phường 12', '201 Tô Hiến Thành', 1);

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image_url`, `link`, `status`) VALUES
(1, 'Khám phá nghệ thuật hương thơm', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1400&q=90', '/products', 1),
(3, 'Unisex — Tự Do Không Giới Hạn', 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1400&q=90', '/products?category=unisex', 1),
(4, 'Bộ sưu tập mùa hè 2026', '/uploads/banners/1776099258875-11129.jpg', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `thumbnail` text DEFAULT NULL,
  `status` enum('published','draft','hidden') NOT NULL DEFAULT 'published',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `content`, `author_id`, `category_id`, `thumbnail`, `status`, `created_at`) VALUES
(1, 'Cách chọn nước hoa theo mùa', 'cach-chon-nuoc-hoa-theo-mua', 'Việc chọn nước hoa phù hợp với từng mùa là một nghệ thuật tinh tế mà không phải ai cũng nắm rõ. Bài viết này sẽ giúp bạn hiểu rõ hơn về cách chọn mùi hương phù hợp cho từng thời điểm trong năm.\n\n**Mùa Xuân (tháng 3 - 5)**\nMùa xuân là thời điểm lý tưởng cho những mùi hương tươi mát, nhẹ nhàng. Hãy chọn những chai nước hoa có hương hoa tươi như Chanel Chance, Dior Miss Dior hoặc những dòng Floral Fresh. Citrus và Green Notes cũng rất phù hợp trong giai đoạn này.\n\n**Mùa Hè (tháng 6 - 8)**\nTrong tiết trời nóng bức, bạn nên chọn những mùi hương nhẹ, tươi mát và có khả năng bay nhanh. Aquatic Notes như Acqua di Giò, hay những dòng Light Citrus là lựa chọn hoàn hảo. Tránh dùng nước hoa quá nặng, Oriental hay Oud vì chúng sẽ trở nên ngột ngạt.\n\n**Mùa Thu (tháng 9 - 11)**\nĐây là mùa tuyệt vời nhất để thử những mùi hương Woody, Spicy và Oriental nhẹ. Tom Ford Oud Wood, Dior Sauvage EDP hay những dòng Amber đều phát huy tốt nhất trong tiết trời mát mẻ của mùa thu.\n\n**Mùa Đông (tháng 12 - 2)**\nMùa đông là thời điểm hoàn hảo cho những mùi hương nồng nàn, ấm áp và bền lâu. Oriental, Oud, Amber và Gourmand là những nhóm hương thơm thể hiện tốt nhất khi nhiệt độ thấp. Creed Aventus, YSL Black Opium hay Dior Sauvage Elixir đều là những lựa chọn xuất sắc.', 1, 1, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 'published', '2024-02-25 09:00:00'),
(2, 'Review chi tiết Dior Sauvage EDP — Có xứng đáng với giá tiền?', 'review-chi-tiet-dior-sauvage-edp-co-xung-djang-voi-gia-tien-1776099016890', 'Dior Sauvage EDP là một trong những chai nước hoa bán chạy nhất thế giới. Nhưng liệu nó có thực sự xứng đáng với mức giá cao cấp mà hãng đặt ra? Hãy cùng NGOCVI đánh giá chi tiết từng khía cạnh.\r\n\r\n**Mùi hương mở đầu (Top Notes)**\r\nKhi vừa xịt, Bergamot Calabria xuất hiện rực rỡ, tươi sáng và cực kỳ ấn tượng. Đây là điểm mạnh đặc trưng của dòng Sauvage — sự tươi mát ban đầu cực kỳ thu hút.\r\n\r\n**Mùi hương trái tim (Heart Notes)**\r\nSichuan Pepper dần xuất hiện sau 15-20 phút, tạo ra chiều sâu và sự bí ẩn. Đây là điểm khác biệt lớn nhất giữa EDT và EDP của Sauvage. EDP mang lại sự ấm áp và phức tạp hơn nhiều.\r\n\r\n**Mùi hương nền (Base Notes)**\r\nAmbroxan — thành phần đặc trưng của dòng Sauvage, kết hợp với Cedar tạo ra vệt hương kéo dài 8-12 tiếng. Đây chính là lý do Sauvage EDP được mệnh danh là \"king of office fragrances\".\r\n\r\n**Verdict**\r\n★★★★☆ (4.5/5) — Sauvage EDP xứng đáng với mức giá. Đây là chai nước hoa toàn năng nhất dành cho nam giới.', 2, 2, '/uploads/blogs/1776099016887-492816.jpg', 'published', '2024-03-01 10:00:00'),
(3, 'Top 5 mùi hương trending năm 2024', 'top-5-mui-huong-trending-2024', 'Năm 2024 chứng kiến sự trở lại mạnh mẽ của những mùi hương Woody Oriental và sự bùng nổ của dòng Clean Musky. Dưới đây là 5 xu hướng nổi bật nhất năm nay.\n\n1. **Oud Wood — Tom Ford**: Vẫn là biểu tượng của luxury niche fragrance, Oud Wood tiếp tục dẫn đầu danh sách những chai được tìm kiếm nhiều nhất.\n\n2. **Santal 33 — Le Labo**: Hương gỗ đàn hương đặc trưng này đã trở thành \"mùi hương của thế kỷ\" và ngày càng phổ biến hơn tại Việt Nam.\n\n3. **Sauvage Elixir — Dior**: Phiên bản mới nhất của dòng Sauvage, mạnh mẽ hơn và quyến rũ hơn, đang chiếm lĩnh thị trường.\n\n4. **Black Opium — YSL**: Hương cà phê ngọt ngào vẫn là lựa chọn số 1 cho phái nữ trong năm nay.\n\n5. **Aventus — Creed**: Chai nước hoa \"cho người thành đạt\" vẫn giữ vững vị trí top đầu mặc dù giá không hề rẻ.', 1, 3, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 'published', '2024-03-10 11:00:00'),
(4, 'Lịch sử thương hiệu Chanel — Từ tiệm may đến đế chế nước hoa', 'lich-su-thuong-hieu-chanel', 'Câu chuyện của Chanel bắt đầu từ năm 1910 khi Gabrielle \"Coco\" Chanel mở tiệm mũ nhỏ tại Paris. Hành trình từ đó đến khi trở thành một trong những thương hiệu xa xỉ nhất thế giới là một câu chuyện đầy cảm hứng.\n\n**1921 — Chanel No. 5 Ra Đời**\nChanel No. 5 là chai nước hoa đầu tiên được tạo ra bởi nhà điều chế Ernest Beaux theo yêu cầu của Coco Chanel. Đây là lần đầu tiên trong lịch sử, aldehydes được sử dụng trong nước hoa, tạo ra một mùi hương hoàn toàn mới.\n\n**Biểu Tượng Văn Hóa**\nMarilyn Monroe nổi tiếng với câu nói \"The only thing I wear to bed is a few drops of Chanel No. 5\". Kể từ đó, Chanel No. 5 trở thành biểu tượng của sự sang trọng và quyến rũ.', 2, 4, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80', 'published', '2024-03-20 09:00:00'),
(5, '7 mẹo giúp nước hoa lưu hương lâu hơn', '7-meo-giup-nuoc-hoa-luu-huong-lau-hon-1776099008267', 'Bạn đã bao giờ xịt nước hoa buổi sáng nhưng chỉ sau vài tiếng đã không còn cảm nhận được mùi? Đây là 7 bí quyết giúp nước hoa của bạn tỏa hương bền lâu hơn.\r\n\r\n1. **Xịt vào điểm mạch (pulse points)**: Cổ tay, sau tai, vùng cổ, khuỷu tay — những nơi có mạch máu gần da giúp khuếch tán mùi hương tốt hơn.\r\n\r\n2. **Dưỡng ẩm trước khi xịt**: Da khô \"ăn\" mùi nước hoa nhanh hơn. Hãy thoa kem dưỡng thể hoặc vaseline trước khi xịt để tạo lớp nền giữ hương.\r\n\r\n3. **Không chà xát sau khi xịt**: Cử chỉ này phá vỡ cấu trúc phân tử của nước hoa, làm mất đi các top notes quý giá.\r\n\r\n4. **Bảo quản đúng cách**: Tránh ánh nắng trực tiếp, nhiệt độ cao và ẩm ướt. Tủ lạnh hoặc ngăn tối mát là lý tưởng nhất.\r\n\r\n5. **Chọn nồng độ phù hợp**: EDP > EDT > EDC về độ bền hương. Nếu cần hương lâu, hãy chọn EDP hoặc Parfum.', 1, 5, '/uploads/blogs/1776099008251-652569.jpg', 'published', '2024-04-01 10:00:00'),
(6, 'Phân biệt nước hoa thật và hàng nhái — Cẩm nang cho người mới', 'phan-biet-nuoc-hoa-that-hang-nhai', 'Thị trường nước hoa đang tràn ngập hàng nhái, hàng kém chất lượng với giá rẻ bất ngờ. Làm thế nào để tự bảo vệ mình? Dưới đây là những dấu hiệu nhận biết nước hoa chính hãng.\n\n**Kiểm tra tem và mã vạch**\nNước hoa chính hãng luôn có tem chống hàng giả, mã vạch có thể check được trên website của hãng. Dior, Chanel, Tom Ford đều có hệ thống verify online.\n\n**Quan sát bao bì**\nChất lượng hộp, font chữ, logo in rõ nét — đây là những chi tiết mà hàng giả thường không làm được hoàn hảo. Hãy so sánh với ảnh chính hãng trên website.\n\n**Kiểm tra mùi hương**\nNước hoa thật có sự phát triển rõ ràng từ top notes → heart notes → base notes. Hàng giả thường chỉ có một mùi đơn điệu và bay đi rất nhanh.\n\n**Mua tại đại lý uy tín**\nNGOCVI cam kết 100% hàng chính hãng, có hóa đơn và chứng từ nhập khẩu rõ ràng.', 2, 1, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 'published', '2024-04-15 14:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `slug` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`) VALUES
(1, 'Kiến thức', 'kien-thuc'),
(2, 'Review', 'review'),
(3, 'Xu hướng', 'xu-huong'),
(4, 'Thương hiệu', 'thuong-hieu'),
(5, 'Tips & Tricks', 'tips');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `slug` varchar(150) DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `description`) VALUES
(1, 'Dior', 'dior', NULL, 'Christian Dior — nhà mốt cao cấp Pháp, biểu tượng của sự thanh lịch và quyến rũ từ năm 1947.'),
(2, 'Chanel', 'chanel', NULL, 'Chanel — thương hiệu thời trang và nước hoa đỉnh cao, nổi tiếng với Chanel No. 5 huyền thoại.'),
(3, 'Tom Ford', 'tom-ford', NULL, 'Tom Ford Beauty — dòng nước hoa luxury niche nổi tiếng với Oud Wood, Black Orchid và nhiều kiệt tác khác.'),
(4, 'Le Labo', 'le-labo', NULL, 'Le Labo — thương hiệu niche từ New York với triết lý \"handcrafted perfumery\", nổi tiếng với Santal 33.'),
(5, 'YSL', 'ysl', NULL, 'Yves Saint Laurent — thời trang và nước hoa Pháp đẳng cấp, nổi tiếng với Black Opium và Y EDP.'),
(6, 'Versace', 'versace', NULL, 'Versace — thương hiệu Ý táo bạo và mãnh liệt, nổi tiếng với Eros và Dylan Turquoise.'),
(7, 'Giorgio Armani', 'giorgio-armani', NULL, 'Giorgio Armani — phong cách Ý tinh tế, nổi tiếng với Acqua di Giò và Si.'),
(8, 'Creed', 'creed', NULL, 'Creed — nhà nước hoa lâu đời từ thế kỷ 18, biểu tượng của tầng lớp thượng lưu với Aventus huyền thoại.');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(1, 3, '2024-05-01 10:00:00'),
(2, 4, '2024-05-02 11:00:00'),
(3, 5, '2024-05-03 09:00:00'),
(4, 6, '2024-05-04 14:00:00'),
(5, 11, '2026-03-17 08:21:04');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `variant_id`, `quantity`) VALUES
(1, 1, 1, 3, 1),
(2, 1, 10, 27, 1),
(3, 2, 7, 21, 2),
(4, 3, 6, 16, 1),
(5, 4, 2, 6, 1),
(9, 5, 5, 13, 2),
(10, 5, 4, 11, 1),
(11, 5, 1036, 3036, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `slug` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Nước hoa Nam', 'nuoc-hoa-nam'),
(2, 'Nước hoa Nữ', 'nuoc-hoa-nu'),
(3, 'Unisex', 'unisex'),
(4, 'Gift Sets', 'gift-sets');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `user_id`, `created_at`) VALUES
(1, 3, '2024-05-10 10:00:00'),
(2, 4, '2024-05-11 14:00:00'),
(3, 5, '2024-05-12 09:00:00'),
(4, 11, '2026-03-17 08:29:32');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `change_type` enum('import','export','adjust') DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_logs`
--

INSERT INTO `inventory_logs` (`id`, `product_id`, `variant_id`, `change_type`, `quantity`, `created_at`) VALUES
(1, 1, 1, 'import', 20, '2024-01-01 08:00:00'),
(2, 1, 2, 'import', 35, '2024-01-01 08:00:00'),
(3, 1, 3, 'import', 50, '2024-01-01 08:00:00'),
(4, 1, 4, 'import', 10, '2024-01-01 08:00:00'),
(5, 10, 21, 'import', 15, '2024-01-01 08:00:00'),
(6, 10, 22, 'import', 10, '2024-01-01 08:00:00'),
(7, 12, 26, 'import', 15, '2024-01-01 08:00:00'),
(8, 12, 27, 'import', 10, '2024-01-01 08:00:00'),
(9, 1, 3, 'export', 1, '2024-05-01 10:30:00'),
(10, 10, 21, 'export', 1, '2024-05-01 10:30:00'),
(11, 7, 19, 'export', 1, '2024-05-02 14:20:00'),
(12, 12, 27, 'export', 1, '2024-05-03 09:15:00'),
(13, 9, 24, 'export', 1, '2026-03-17 08:25:17'),
(14, 5, 13, 'export', 1, '2026-03-18 02:12:41'),
(15, 8, 22, 'export', 1, '2026-03-21 12:31:05'),
(16, 1048, 3048, 'adjust', 6, '2026-04-15 02:39:16'),
(17, 12, 33, 'adjust', 7, '2026-04-15 02:39:22'),
(18, 1039, 3039, 'adjust', 5, '2026-04-15 02:39:25'),
(19, 11, 29, 'adjust', -15, '2026-04-15 02:56:03');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `sender_type` enum('user','admin','bot') DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_type`, `message`, `created_at`) VALUES
(1, 1, 'bot', 'Xin chào! Em là trợ lý ảo của NGOCVI Boutique. Em có thể giúp gì cho anh/chị ạ?', '2024-05-10 10:00:00'),
(2, 1, 'user', 'Cho mình hỏi Sauvage EDP 100ml hiện tại còn hàng không?', '2024-05-10 10:02:00'),
(3, 1, 'bot', 'Dạ, Dior Sauvage EDP 100ml hiện đang còn hàng với giá 2.950.000đ ạ. Anh/chị có muốn thêm vào giỏ hàng không?', '2024-05-10 10:02:30'),
(4, 1, 'user', 'Còn hàng chính hãng không? Có tem chống giả không?', '2024-05-10 10:05:00'),
(5, 1, 'admin', 'Chào anh! Em là nhân viên tư vấn của NGOCVI. Tất cả sản phẩm bên em đều là hàng chính hãng 100%, có tem chống hàng giả của Dior, có thể check mã online. Bên em còn có bảo hành mùi hương 30 ngày ạ.', '2024-05-10 10:10:00'),
(6, 1, 'user', 'OK cảm ơn bạn, mình sẽ đặt hàng!', '2024-05-10 10:12:00'),
(7, 2, 'bot', 'Xin chào! Em là trợ lý ảo của NGOCVI Boutique. Em có thể giúp gì cho anh/chị ạ?', '2024-05-11 14:00:00'),
(8, 2, 'user', 'Chính sách vận chuyển của shop như thế nào?', '2024-05-11 14:02:00'),
(9, 2, 'bot', 'Dạ shop miễn phí vận chuyển cho đơn từ 500K. Giao hàng toàn quốc 3-5 ngày ạ. Nội thành HCM có giao hỏa tốc 4h.', '2024-05-11 14:02:30'),
(10, 3, 'bot', 'Xin chào! Em là trợ lý ảo của NGOCVI Boutique. Em có thể giúp gì cho anh/chị ạ?', '2024-05-12 09:00:00'),
(11, 3, 'user', 'Shop có Tom Ford Oud Wood không? Giá bao nhiêu?', '2024-05-12 09:02:00'),
(12, 3, 'bot', 'Dạ, Tom Ford Oud Wood EDP đang có 2 size: 50ml giá 5.000.000đ và 100ml giá 7.500.000đ ạ. Đây là dòng Private Blend nổi tiếng của Tom Ford ạ.', '2024-05-12 09:02:30'),
(13, 3, 'user', 'Giá hơi cao nhỉ, có giảm giá không?', '2024-05-12 09:05:00'),
(14, 3, 'admin', 'Chào chị! Oud Wood là dòng Private Blend cao cấp nên giá là cố định ạ. Tuy nhiên nếu chị có mã VIP200 thì được giảm 200K cho đơn từ 2 triệu. Chị cũng có thể check voucher WELCOME10 để được giảm 10% ạ!', '2024-05-12 09:15:00'),
(15, 4, 'user', 'Hàng có chính hãng không?', '2026-03-17 08:29:35'),
(16, 4, 'user', 'chào bạn', '2026-03-17 08:29:45'),
(17, 4, 'user', 'bạn tư vấn nước hoa giúp mình dc k', '2026-03-17 08:30:26');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_code` varchar(50) DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  `shipping_fee` decimal(12,2) DEFAULT NULL,
  `discount` decimal(12,2) DEFAULT NULL,
  `payment_method` enum('COD','ONLINE') DEFAULT NULL,
  `status` enum('pending','confirmed','shipping','completed','cancelled') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_code`, `total_price`, `shipping_fee`, `discount`, `payment_method`, `status`, `created_at`) VALUES
(1, 3, 'NGV-20240501-001', 5900000.00, 0.00, 0.00, 'COD', 'completed', '2024-05-01 10:30:00'),
(2, 4, 'NGV-20240502-002', 3450000.00, 35000.00, 0.00, 'COD', 'completed', '2024-05-02 14:20:00'),
(3, 5, 'NGV-20240503-003', 9800000.00, 0.00, 200000.00, 'ONLINE', 'completed', '2024-05-03 09:15:00'),
(4, 6, 'NGV-20240510-004', 2950000.00, 0.00, 0.00, 'COD', 'shipping', '2024-05-10 16:45:00'),
(5, 7, 'NGV-20240515-005', 7500000.00, 0.00, 0.00, 'ONLINE', 'shipping', '2024-05-15 11:00:00'),
(6, 8, 'NGV-20240520-006', 4200000.00, 0.00, 50000.00, 'COD', 'confirmed', '2024-05-20 08:30:00'),
(7, 9, 'NGV-20240521-007', 6100000.00, 0.00, 0.00, 'ONLINE', 'confirmed', '2024-05-21 13:20:00'),
(8, 3, 'NGV-20240522-008', 3800000.00, 35000.00, 0.00, 'COD', 'completed', '2024-05-22 10:00:00'),
(9, 4, 'NGV-20240523-009', 2100000.00, 35000.00, 0.00, 'COD', 'cancelled', '2024-05-23 15:30:00'),
(10, 5, 'NGV-20240524-010', 12400000.00, 0.00, 300000.00, 'ONLINE', 'completed', '2024-05-24 09:45:00'),
(11, 11, 'NGV-1773710717443', 1635000.00, 35000.00, 0.00, 'COD', 'completed', '2026-03-17 08:25:17'),
(12, 11, 'NGV-1773774761676', 1935000.00, 35000.00, 0.00, 'COD', 'completed', '2026-03-18 02:12:41'),
(13, 11, 'NGV-1774071065372', 2035000.00, 35000.00, 0.00, 'COD', 'completed', '2026-03-21 12:31:05');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `price`, `quantity`) VALUES
(1, 1, 1, 3, 2950000.00, 1),
(2, 1, 10, 27, 5000000.00, 1),
(3, 2, 7, 19, 3100000.00, 1),
(4, 3, 12, 32, 9800000.00, 1),
(5, 4, 1, 3, 2950000.00, 1),
(6, 5, 10, 28, 7500000.00, 1),
(7, 6, 2, 6, 4200000.00, 1),
(8, 7, 11, 30, 6100000.00, 1),
(9, 8, 6, 17, 3800000.00, 1),
(10, 9, 4, 11, 2100000.00, 1),
(11, 10, 3, 9, 5800000.00, 1),
(12, 10, 12, 31, 6500000.00, 1),
(13, 11, 9, 24, 1600000.00, 1),
(14, 12, 5, 13, 1900000.00, 1),
(15, 13, 8, 22, 2000000.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `status`, `updated_at`) VALUES
(1, 1, 'pending', '2024-05-01 10:30:00'),
(2, 1, 'confirmed', '2024-05-01 14:00:00'),
(3, 1, 'shipping', '2024-05-02 08:00:00'),
(4, 1, 'completed', '2024-05-04 15:30:00'),
(5, 2, 'pending', '2024-05-02 14:20:00'),
(6, 2, 'confirmed', '2024-05-02 16:00:00'),
(7, 2, 'shipping', '2024-05-03 08:00:00'),
(8, 2, 'completed', '2024-05-05 14:00:00'),
(9, 3, 'pending', '2024-05-03 09:15:00'),
(10, 3, 'confirmed', '2024-05-03 10:00:00'),
(11, 3, 'shipping', '2024-05-04 08:00:00'),
(12, 3, 'completed', '2024-05-06 16:00:00'),
(13, 4, 'pending', '2024-05-10 16:45:00'),
(14, 4, 'confirmed', '2024-05-11 09:00:00'),
(15, 4, 'shipping', '2024-05-12 08:00:00'),
(16, 5, 'pending', '2024-05-15 11:00:00'),
(17, 5, 'confirmed', '2024-05-15 14:00:00'),
(18, 5, 'shipping', '2024-05-16 08:00:00'),
(19, 6, 'pending', '2024-05-20 08:30:00'),
(20, 6, 'confirmed', '2024-05-20 10:00:00'),
(21, 7, 'pending', '2024-05-21 13:20:00'),
(22, 7, 'confirmed', '2024-05-21 15:00:00'),
(23, 8, 'pending', '2024-05-22 10:00:00'),
(24, 9, 'pending', '2024-05-23 15:30:00'),
(25, 9, 'cancelled', '2024-05-23 18:00:00'),
(26, 10, 'pending', '2024-05-24 09:45:00'),
(27, 11, 'pending', '2026-03-17 08:25:17'),
(28, 12, 'pending', '2026-03-18 02:12:41'),
(29, 8, 'completed', '2026-03-18 02:13:14'),
(30, 12, 'completed', '2026-03-18 02:13:52'),
(31, 11, 'completed', '2026-03-18 02:14:06'),
(32, 13, 'pending', '2026-03-21 12:31:05'),
(34, 10, 'completed', '2026-03-21 12:42:44'),
(35, 13, 'completed', '2026-03-21 12:42:52');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`) VALUES
(1, 'manage_products'),
(2, 'manage_orders'),
(3, 'manage_users'),
(4, 'manage_blog'),
(5, 'manage_reviews'),
(6, 'manage_inventory'),
(7, 'view_dashboard');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `gender` enum('male','female','unisex') DEFAULT NULL,
  `concentration` varchar(50) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `brand_id`, `category_id`, `description`, `gender`, `concentration`, `price`, `sale_price`, `status`, `created_at`) VALUES
(1, 'Sauvage Eau De Parfum', 'sauvage-eau-de-parfum', 1, 1, 'Sauvage EDP toát lên sức mạnh hoang dã và bí ẩn, lấy cảm hứng từ sa mạc trong giờ hoàng hôn ma thuật. Mùi hương mở đầu với Bergamot Calabria, tầng giữa là Sichuan Pepper nồng nàn, kết thúc với Ambroxan và Cedar. Được pha chế bởi François Demachy, Nhà sáng tạo nước hoa của Dior.', 'male', 'EDP', 2950000.00, NULL, 'active', '2024-01-10 08:00:00'),
(2, 'Bleu de Chanel Parfum', 'bleu-de-chanel-parfum', 2, 1, 'Bleu de Chanel Parfum là hương gỗ-thơm đặc biệt dành cho người đàn ông tự do và quyết đoán. Mùi hương mở bằng Citrus Peel và Pink Pepper, tầng giữa là Sandalwood và Labdanum, tầng đáy là Cedarwood và Amber. Đây là phiên bản cô đặc nhất và sang trọng nhất của dòng Bleu.', 'male', 'Parfum', 4200000.00, 0.00, 'active', '2024-01-12 09:00:00'),
(3, 'Sauvage Elixir', 'sauvage-elixir', 1, 1, 'Sauvage Elixir là phiên bản mạnh mẽ và quyến rũ nhất của dòng Sauvage. Nồng độ Elixir tạo ra vệt hương đặc biệt kéo dài cả ngày. Grapefruit và Cardamom mở đầu, Nutmeg và Sandalwood ở giữa, Amber Wood và Licorice ở tầng đáy.', 'male', 'Elixir', 5800000.00, NULL, 'active', '2024-02-01 10:00:00'),
(4, 'Eros Eau De Parfum', 'eros-eau-de-parfum', 6, 1, 'Versace Eros EDP là biểu tượng của sức mạnh và sự hấp dẫn nam tính. Hương thơm mở đầu với Mint và Apple tươi mát, tầng giữa là Tonka Bean và Ambroxan gợi cảm, kết thúc với Vetiver và Cedarwood ấm áp.', 'male', 'EDP', 2600000.00, 2100000.00, 'active', '2024-02-10 11:00:00'),
(5, 'Acqua di Giò Parfum', 'acqua-di-gio-parfum', 7, 1, 'Acqua di Giò Parfum là sự tiến hóa hoàn hảo của hương thơm biển Địa Trung Hải. Patchouli Noir kết hợp Marine Accord tạo nên chiều sâu bí ẩn. Bergamot và Neroli mở đầu tươi sáng, Patchouli và Mineral Notes kết thúc ấm áp.', 'male', 'Parfum', 3450000.00, NULL, 'active', '2024-02-15 14:00:00'),
(6, 'Coco Mademoiselle EDP Intense', 'coco-mademoiselle-edp-intense', 2, 2, 'Coco Mademoiselle EDP Intense là phiên bản cô đặc hơn, táo bạo hơn của Coco Mademoiselle kinh điển. Orange và Jasmine mở đầu tươi sáng, tầng giữa là Rose và Ylang-Ylang quyến rũ, kết thúc với Patchouli và Vanilla nồng nàn.', 'female', 'EDP Intense', 4500000.00, 3800000.00, 'active', '2024-01-20 10:00:00'),
(7, 'Black Opium EDP', 'black-opium-edp', 5, 2, 'YSL Black Opium là sự kết hợp quyến rũ giữa cà phê đen và vanilla ngọt ngào. Coffee Accord và White Flowers mở đầu gợi cảm, tầng giữa là Jasmine và Licorice bí ẩn, tầng đáy là Cedar và Cashmere Wood ấm áp.', 'female', 'EDP', 3100000.00, NULL, 'active', '2024-01-25 11:00:00'),
(8, 'Y EDP', 'y-edp', 5, 1, 'YSL Y EDP dành cho phái mạnh hiện đại, tự tin và sáng tạo. Bergamot và Ginger mở đầu tươi mát, tầng giữa là Lavender và Sage, kết thúc với Tonka Bean và Cedar. Đây là hương thơm đặc trưng của dòng Y.', 'male', 'EDP', 2750000.00, NULL, 'active', '2024-03-01 09:00:00'),
(9, 'Si EDP', 'si-edp', 7, 2, 'Armani Sì EDP là hương thơm của người phụ nữ mạnh mẽ và tinh tế. Blackcurrant và Freesia mở đầu tươi sáng, tầng giữa là Rose và Neroli thanh lịch, kết thúc với Patchouli và Vanilla ấm áp.', 'female', 'EDP', 3200000.00, NULL, 'active', '2024-03-15 10:00:00'),
(10, 'Oud Wood EDP', 'oud-wood-edp', 3, 3, 'Tom Ford Oud Wood là một trong những chai nước hoa unisex đắt giá và nổi tiếng nhất thế giới. Oud quý hiếm từ Đông Phương kết hợp với Sandalwood và Rosewood tạo nên hương thơm sang trọng và bí ẩn. Đây là kiệt tác trong bộ sưu tập Private Blend.', 'unisex', 'EDP', 7500000.00, NULL, 'active', '2024-01-15 09:00:00'),
(11, 'Santal 33 EDP', 'santal-33-edp', 4, 3, 'Le Labo Santal 33 là mùi hương mang tính biểu tượng nhất của thế kỷ 21. Sandalwood từ Australia kết hợp với Cardamom, Iris và Papyrus tạo nên hương thơm gợi nhớ về vùng đất miền Tây nước Mỹ. Đây là mùi nước hoa được nhận ra nhiều nhất trên thế giới.', 'unisex', 'EDP', 6100000.00, NULL, 'active', '2024-01-18 10:00:00'),
(12, 'Aventus EDP', 'aventus-edp', 8, 3, 'Creed Aventus là biểu tượng của sức mạnh và thành công, lấy cảm hứng từ cuộc đời Napoleon Bonaparte. Pineapple và Blackcurrant mở đầu tươi mát, tầng giữa là Birch và Moroccan Jasmine sang trọng, kết thúc với Musk và Oak Moss bền vững.', 'unisex', 'EDP', 9800000.00, NULL, 'active', '2024-02-05 08:00:00'),
(1001, 'Dior Homme Intense', 'dior-homme-intense-1001', 1, 1, 'Warm iris and amber for elegant evenings.', 'male', 'EDP', 3450000.00, 3190000.00, 'active', '2026-04-14 21:37:49'),
(1002, 'Dior Fahrenheit Le Parfum', 'dior-fahrenheit-le-parfum-1002', 1, 1, 'Leather and vanilla with a bold signature trail.', 'male', 'Parfum', 3650000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1003, 'Dior J\'adore Infinissime', 'dior-jadore-infinissime-1003', 1, 2, 'Bright floral bouquet with creamy sandalwood.', 'female', 'EDP', 3550000.00, 3290000.00, 'active', '2026-04-14 21:37:49'),
(1004, 'Chanel Allure Homme Sport', 'chanel-allure-homme-sport-1004', 2, 1, 'Fresh citrus, tonka and clean musk accord.', 'male', 'EDT', 3250000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1005, 'Chanel Chance Eau Tendre', 'chanel-chance-eau-tendre-1005', 2, 2, 'Soft fruity floral, youthful and easy to wear.', 'female', 'EDT', 3390000.00, 3090000.00, 'active', '2026-04-14 21:37:49'),
(1006, 'Chanel Gabrielle Essence', 'chanel-gabrielle-essence-1006', 2, 2, 'Radiant white floral with smooth vanilla base.', 'female', 'EDP', 3890000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1007, 'Tom Ford Noir Extreme', 'tom-ford-noir-extreme-1007', 3, 1, 'Amber-spicy profile with kulfi dessert accord.', 'male', 'EDP', 5200000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1008, 'Tom Ford Black Orchid', 'tom-ford-black-orchid-1008', 3, 3, 'Dark truffle, black orchid and patchouli blend.', 'unisex', 'EDP', 4980000.00, 4590000.00, 'active', '2026-04-14 21:37:49'),
(1009, 'Tom Ford Lost Cherry', 'tom-ford-lost-cherry-1009', 3, 3, 'Liqueur cherry wrapped in almond and tonka.', 'unisex', 'EDP', 9200000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1010, 'Le Labo Another 13', 'le-labo-another-13-1010', 4, 3, 'Iso e super and ambroxan, clean skin scent.', 'unisex', 'EDP', 6900000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1011, 'Le Labo Rose 31', 'le-labo-rose-31-1011', 4, 3, 'Rose with cumin and cedar, modern and edgy.', 'unisex', 'EDP', 7200000.00, 6850000.00, 'active', '2026-04-14 21:37:49'),
(1013, 'YSL Libre Intense', 'ysl-libre-intense-1013', NULL, NULL, 'Lavender and orange blossom with warm vanilla.', 'female', 'EDP Intense', 3550000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1014, 'YSL Mon Paris', 'ysl-mon-paris-1014', 5, 2, 'Sweet berry-chypre with romantic floral heart.', 'female', 'EDP', 3350000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1015, 'YSL Y Le Parfum', 'ysl-y-le-parfum-1015', 5, 1, 'Dark aromatic woods with crisp apple opening.', 'male', 'Parfum', 3590000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1016, 'Versace Dylan Blue', 'versace-dylan-blue-1016', 6, 1, 'Fresh aquatic fougere with incense undertone.', 'male', 'EDT', 2590000.00, 2290000.00, 'active', '2026-04-14 21:37:49'),
(1017, 'Versace Bright Crystal', 'versace-bright-crystal-1017', 6, 2, 'Pomegranate and peony in soft musky floral.', 'female', 'EDT', 2450000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1018, 'Versace Pour Femme Dylan Purple', 'versace-dylan-purple-1018', 6, 2, 'Citrus pear floral with vibrant modern vibe.', 'female', 'EDP', 2790000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1019, 'Armani Code Parfum', 'armani-code-parfum-1019', 7, 1, 'Clean iris and tonka for classy night style.', 'male', 'Parfum', 3290000.00, 2990000.00, 'active', '2026-04-14 21:37:49'),
(1020, 'Armani My Way', 'armani-my-way-1020', 7, 2, 'White florals and vanilla, soft feminine trail.', 'female', 'EDP', 3390000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1021, 'Armani Stronger With You Intensely', 'armani-stronger-with-you-intensely-1021', 7, 1, 'Sweet amber chestnut with addictive warmth.', 'male', 'EDP', 3190000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1022, 'Creed Green Irish Tweed', 'creed-green-irish-tweed-1022', 8, 1, 'Fresh green violet leaf and sandalwood.', 'male', 'EDP', 9900000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1023, 'Creed Silver Mountain Water', 'creed-silver-mountain-water-1023', 8, 3, 'Tea-citrus musky scent inspired by alpine air.', 'unisex', 'EDP', 9800000.00, 9390000.00, 'active', '2026-04-14 21:37:49'),
(1024, 'Creed Millesime Imperial', 'creed-millesime-imperial-1024', 8, 3, 'Marine fruit notes with salty amber finish.', 'unisex', 'EDP', 10300000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1025, 'Dior Miss Dior Blooming Bouquet', 'dior-miss-dior-blooming-bouquet-1025', 1, 2, 'Peony and rose with gentle musk dry-down.', 'female', 'EDT', 3190000.00, 2890000.00, 'active', '2026-04-14 21:37:49'),
(1026, 'Dior Homme Cologne', 'dior-homme-cologne-1026', 1, 1, 'Sparkling bergamot with clean musky finish.', 'male', 'EDC', 2790000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1027, 'Chanel Egoiste Platinum', 'chanel-egoiste-platinum-1027', 2, 1, 'Aromatic lavender and oakmoss classic profile.', 'male', 'EDT', 3490000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1028, 'Chanel Coco Noir', 'chanel-coco-noir-1028', 2, 2, 'Dark rose patchouli, rich elegant character.', 'female', 'EDP', 4190000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1029, 'Tom Ford Ombre Leather', 'tom-ford-ombre-leather-1029', 3, 3, 'Leather jasmine and amber in smooth style.', 'unisex', 'EDP', 5450000.00, 4990000.00, 'active', '2026-04-14 21:37:49'),
(1033, 'YSL La Nuit De L\'Homme', 'ysl-la-nuit-de-lhomme-1033', 5, 1, 'Cardamom cedar and coumarin, date-night scent.', 'male', 'EDT', 2990000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1034, 'YSL Black Opium Le Parfum', 'ysl-black-opium-le-parfum-1034', 5, 2, 'Vanilla-rich gourmand with white floral touch.', 'female', 'Le Parfum', 3590000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1035, 'Versace Eros Flame', 'versace-eros-flame-1035', 6, 1, 'Citrus pepper and tonka, fiery masculine vibe.', 'male', 'EDP', 2690000.00, 2390000.00, 'active', '2026-04-14 21:37:49'),
(1036, 'Versace Crystal Noir', 'versace-crystal-noir-1036', 6, 2, 'Creamy spicy floral with coconut sandalwood.', 'female', 'EDP', 2890000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1037, 'Armani Acqua di Gioia', 'armani-acqua-di-gioia-1037', 7, 2, 'Mint lemon and cedar in airy marine style.', 'female', 'EDP', 2950000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1038, 'Armani Si Passione', 'armani-si-passione-1038', 7, 2, 'Fruity floral with rose and woody vanilla.', 'female', 'EDP', 3250000.00, 2990000.00, 'active', '2026-04-14 21:37:49'),
(1039, 'Creed Carmina', 'creed-carmina-1039', 8, 3, 'Luxe floral amber with cherry and saffron.', 'unisex', 'EDP', 11200000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1040, 'Creed Original Vetiver', 'creed-original-vetiver-1040', 8, 3, 'Clean vetiver and citrus for timeless wear.', 'unisex', 'EDP', 9700000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1041, 'Dior Addict', 'dior-addict-1041', 1, 2, 'Vanilla-orange blossom with sensual depth.', 'female', 'EDP', 3490000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1042, 'Chanel No 5 Eau Premiere', 'chanel-no5-eau-premiere-1042', 2, 2, 'Aldehydic floral made softer and modern.', 'female', 'EDP', 4590000.00, 4290000.00, 'active', '2026-04-14 21:37:49'),
(1043, 'Tom Ford Grey Vetiver', 'tom-ford-grey-vetiver-1043', 3, 1, 'Dry citrus vetiver and woods, office signature.', 'male', 'EDP', 4850000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1045, 'YSL L\'Homme', 'ysl-lhomme-1045', 5, 1, 'Ginger citrus cedar in refined daily profile.', 'male', 'EDT', 2790000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1046, 'Versace Man Eau Fraiche', 'versace-man-eau-fraiche-1046', 6, 1, 'Citrus aquatic woody, cool and easy-going.', 'male', 'EDT', 2390000.00, 2190000.00, 'active', '2026-04-14 21:37:49'),
(1047, 'Armani Prive Rouge Malachite', 'armani-prive-rouge-malachite-1047', 7, 3, 'Tuberose amber and cashmeran in rich style.', 'unisex', 'EDP', 8400000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1048, 'Creed Love In White', 'creed-love-in-white-1048', 8, 2, 'Elegant white floral with powdery soft finish.', 'female', 'EDP', 10500000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1049, 'Dior Eau Sauvage Parfum', 'dior-eau-sauvage-parfum-1049', 1, 1, 'Classic citrus aromatic with myrrh depth.', 'male', 'Parfum', 3650000.00, NULL, 'active', '2026-04-14 21:37:49'),
(1050, 'Chanel Bleu de Chanel EDT', 'chanel-bleu-de-chanel-edt-1050', 2, 1, 'Grapefruit incense and cedar for modern men.', 'male', 'EDT', 3550000.00, 3290000.00, 'active', '2026-04-14 21:37:49');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_main`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 1),
(2, 1, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 0),
(4, 2, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80', 1),
(5, 3, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 1),
(6, 4, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 1),
(9, 6, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 1),
(10, 7, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80', 1),
(11, 8, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80', 1),
(12, 9, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80', 1),
(13, 10, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 1),
(14, 10, 'https://images.unsplash.com/photo-1600612253971-2f48a4e9f2f6?w=600&q=80', 0),
(15, 11, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80', 1),
(16, 12, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=80', 1),
(17, 12, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', 0),
(27, 6, '/uploads/products/1776099092398-296056.jpg', 0),
(28, 2, '/uploads/products/1776099119893-737792.jpg', 0),
(2051, 1001, '/uploads/products/1776181976625-979413.png', 0),
(2052, 1001, '/uploads/products/1776181976629-335357.png', 0),
(2053, 1002, '/uploads/products/1776182252021-167992.webp', 0),
(2054, 1002, '/uploads/products/1776182252022-850705.jpg', 0),
(2055, 1002, '/uploads/products/1776182252023-948294.jpg', 0),
(2056, 1003, '/uploads/products/1776182422519-438154.jpg', 0),
(2058, 1003, '/uploads/products/1776182422519-862798.webp', 0),
(2059, 1003, '/uploads/products/1776182422521-123348.jpg', 0),
(2060, 1005, '/uploads/products/1776182537952-119649.jpeg', 0),
(2061, 1005, '/uploads/products/1776182537953-128795.webp', 0),
(2062, 1005, '/uploads/products/1776182537953-584318.jpg', 0),
(2063, 1004, '/uploads/products/1776182597453-293203.jpeg', 0),
(2064, 1004, '/uploads/products/1776182597455-618079.webp', 0),
(2065, 1004, '/uploads/products/1776182597457-307747.webp', 0),
(2066, 1006, '/uploads/products/1776182652138-271942.jpg', 0),
(2067, 1006, '/uploads/products/1776182652139-710908.jpg', 0),
(2068, 1006, '/uploads/products/1776182652139-322366.jpg', 0),
(2069, 1007, '/uploads/products/1776182725109-972644.jpg', 0),
(2070, 1007, '/uploads/products/1776182725110-520398.jpg', 0),
(2071, 1007, '/uploads/products/1776182725110-411752.webp', 0),
(2072, 1008, '/uploads/products/1776182812237-31391.webp', 0),
(2073, 1008, '/uploads/products/1776182812237-78528.jpg', 0),
(2074, 1008, '/uploads/products/1776182812239-395157.jpg', 0),
(2075, 1008, '/uploads/products/1776182812240-172488.jpg', 0),
(2076, 1009, '/uploads/products/1776182877569-641707.jpg', 0),
(2077, 1009, '/uploads/products/1776182877569-168938.jpg', 0),
(2078, 1009, '/uploads/products/1776182877584-313904.jpg', 0),
(2079, 1010, '/uploads/products/1776182944602-886893.jpg', 0),
(2080, 1010, '/uploads/products/1776182944602-459611.webp', 0),
(2081, 1010, '/uploads/products/1776182944603-265523.jpg', 0),
(2082, 1011, '/uploads/products/1776183008545-335797.webp', 0),
(2083, 1011, '/uploads/products/1776183008545-553843.webp', 0),
(2084, 1013, '/uploads/products/1776183116691-95518.jpg', 0),
(2085, 1013, '/uploads/products/1776183116693-512547.jpg', 0),
(2086, 1013, '/uploads/products/1776183116697-689416.jpg', 0),
(2087, 1014, '/uploads/products/1776183205397-394321.jpg', 0),
(2088, 1014, '/uploads/products/1776183205400-508163.jpg', 0),
(2089, 1014, '/uploads/products/1776183205401-974674.jpg', 0),
(2090, 1024, '/uploads/products/1776183299964-635384.jpg', 0),
(2091, 1024, '/uploads/products/1776183299966-284088.jpg', 0),
(2092, 1024, '/uploads/products/1776183299968-562622.jpg', 0),
(2093, 1025, '/uploads/products/1776183354729-427092.webp', 0),
(2094, 1025, '/uploads/products/1776183354732-926218.jpg', 0),
(2095, 1025, '/uploads/products/1776183354732-490140.webp', 0),
(2096, 1026, '/uploads/products/1776183414010-625949.jpg', 0),
(2097, 1026, '/uploads/products/1776183414011-299939.webp', 0),
(2098, 1026, '/uploads/products/1776183414012-265228.jpg', 0),
(2099, 1027, '/uploads/products/1776183479645-560110.jpg', 0),
(2100, 1027, '/uploads/products/1776183479647-765841.webp', 0),
(2101, 1027, '/uploads/products/1776183479647-61481.webp', 0),
(2102, 1028, '/uploads/products/1776183541737-400086.jpg', 0),
(2103, 1028, '/uploads/products/1776183541737-57378.png', 0),
(2104, 1028, '/uploads/products/1776183541740-495544.jpg', 0),
(2105, 1029, '/uploads/products/1776183620311-236932.jpg', 0),
(2106, 1029, '/uploads/products/1776183620312-846314.jpg', 0),
(2107, 1029, '/uploads/products/1776183620313-705197.webp', 0),
(2108, 1033, '/uploads/products/1776183846686-481277.jpg', 0),
(2109, 1034, '/uploads/products/1776183889403-128720.webp', 0),
(2111, 1035, '/uploads/products/1776183947017-554816.webp', 0),
(2112, 1035, '/uploads/products/1776183947018-868556.jpg', 0),
(2113, 1035, '/uploads/products/1776183947019-633519.jpg', 0),
(2114, 1036, '/uploads/products/1776184031879-979126.jpg', 0),
(2115, 1036, '/uploads/products/1776184031879-715036.jpg', 0),
(2116, 1036, '/uploads/products/1776184031880-160063.jpg', 0),
(2117, 1037, '/uploads/products/1776184129925-963334.webp', 0),
(2118, 1038, '/uploads/products/1776184173040-877506.jpg', 0),
(2119, 1038, '/uploads/products/1776184173040-904533.jpg', 0),
(2120, 1038, '/uploads/products/1776184173041-855564.jpg', 0),
(2121, 1039, '/uploads/products/1776184275559-756352.webp', 0),
(2122, 1039, '/uploads/products/1776184275561-960330.jpg', 0),
(2123, 1039, '/uploads/products/1776184275561-816937.jpg', 0),
(2124, 1040, '/uploads/products/1776184335837-68335.webp', 0),
(2125, 1040, '/uploads/products/1776184335839-873966.webp', 0),
(2126, 1047, '/uploads/products/1776184369355-929002.png', 0),
(2127, 1023, '/uploads/products/1776184412972-73195.jpg', 0),
(2128, 1023, '/uploads/products/1776184412973-518459.jpg', 0),
(2129, 1041, '/uploads/products/1776184462118-852842.jpg', 0),
(2130, 1042, '/uploads/products/1776184498490-341473.png', 0),
(2131, 1042, '/uploads/products/1776184498493-157597.jpg', 0),
(2132, 1048, '/uploads/products/1776184572482-14730.jpg', 0),
(2133, 1048, '/uploads/products/1776184572484-173871.png', 0),
(2135, 1048, '/uploads/products/1776184572504-599840.webp', 0),
(2136, 1017, '/uploads/products/1776184639308-479199.jpg', 0),
(2137, 1017, '/uploads/products/1776184639310-218985.webp', 0),
(2138, 1018, '/uploads/products/1776184702097-961775.jpg', 0),
(2139, 1018, '/uploads/products/1776184702097-288077.jpg', 0),
(2140, 1020, '/uploads/products/1776184756516-621071.jpg', 0),
(2141, 1020, '/uploads/products/1776184756516-669169.jpg', 0),
(2142, 1020, '/uploads/products/1776184756518-711017.jpg', 0),
(2143, 5, '/uploads/products/1776184820179-935051.jpg', 0),
(2144, 5, '/uploads/products/1776184820181-33334.webp', 0),
(2145, 5, '/uploads/products/1776184820182-855931.jpg', 0),
(2146, 1043, '/uploads/products/1776184885816-323900.jpg', 0),
(2147, 1043, '/uploads/products/1776184885819-379770.webp', 0),
(2148, 1045, '/uploads/products/1776184914050-42966.jpg', 0),
(2149, 1046, '/uploads/products/1776184950673-769554.jpg', 0),
(2150, 1049, '/uploads/products/1776185014074-271351.jpg', 0),
(2151, 1049, '/uploads/products/1776185014076-384280.webp', 0),
(2152, 1050, '/uploads/products/1776185065397-510000.jpg', 0),
(2153, 1050, '/uploads/products/1776185065399-318221.jpeg', 0),
(2154, 1021, '/uploads/products/1776185107503-40914.webp', 0),
(2155, 1019, '/uploads/products/1776185146546-263978.webp', 0),
(2156, 1019, '/uploads/products/1776185146546-121256.jpg', 0),
(2157, 1016, '/uploads/products/1776185190409-773180.jpg', 0),
(2158, 1016, '/uploads/products/1776185190409-267290.jpeg', 0),
(2159, 1015, '/uploads/products/1776185232018-519493.jpg', 0),
(2160, 1015, '/uploads/products/1776185232020-810441.jpeg', 0),
(2161, 1022, '/uploads/products/1776185280968-35485.png', 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_tags`
--

CREATE TABLE `product_tags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_tags`
--

INSERT INTO `product_tags` (`id`, `name`) VALUES
(1, 'woody'),
(2, 'floral'),
(3, 'citrus'),
(4, 'oriental'),
(5, 'fresh'),
(6, 'spicy'),
(7, 'aquatic'),
(8, 'oud'),
(9, 'sweet'),
(10, 'musky');

-- --------------------------------------------------------

--
-- Table structure for table `product_tag_map`
--

CREATE TABLE `product_tag_map` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_tag_map`
--

INSERT INTO `product_tag_map` (`id`, `product_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 1, 6),
(3, 1, 5),
(7, 3, 1),
(8, 3, 6),
(9, 3, 8),
(10, 4, 6),
(11, 4, 9),
(12, 4, 5),
(19, 7, 9),
(20, 7, 4),
(21, 7, 2),
(22, 8, 2),
(23, 8, 3),
(24, 8, 5),
(25, 9, 2),
(26, 9, 3),
(27, 9, 9),
(28, 10, 8),
(29, 10, 1),
(30, 10, 4),
(31, 11, 1),
(32, 11, 10),
(33, 11, 4),
(34, 12, 1),
(35, 12, 3),
(36, 12, 10),
(46, 6, 2),
(47, 6, 4),
(48, 6, 9),
(49, 2, 1),
(50, 2, 3),
(51, 2, 10),
(52, 5, 7),
(53, 5, 3),
(54, 5, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `volume_ml` int(11) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `volume_ml`, `price`, `stock`) VALUES
(1, 1, 30, 1200000.00, 20),
(2, 1, 60, 2100000.00, 35),
(3, 1, 100, 2950000.00, 45),
(4, 1, 200, 4800000.00, 10),
(5, 2, 50, 2800000.00, 18),
(6, 2, 100, 4200000.00, 25),
(7, 2, 150, 5900000.00, 8),
(8, 3, 60, 4100000.00, 20),
(9, 3, 100, 5800000.00, 15),
(10, 4, 50, 1400000.00, 28),
(11, 4, 100, 2100000.00, 32),
(12, 4, 200, 3600000.00, 10),
(13, 5, 40, 1900000.00, 21),
(14, 5, 75, 2750000.00, 30),
(15, 5, 125, 3450000.00, 18),
(16, 6, 35, 2100000.00, 15),
(17, 6, 50, 2800000.00, 20),
(18, 6, 100, 3800000.00, 25),
(19, 7, 30, 1500000.00, 30),
(20, 7, 50, 2200000.00, 25),
(21, 7, 90, 3100000.00, 20),
(22, 8, 60, 2000000.00, 27),
(23, 8, 100, 2750000.00, 22),
(24, 9, 30, 1600000.00, 17),
(25, 9, 50, 2300000.00, 22),
(26, 9, 100, 3200000.00, 15),
(27, 10, 50, 5000000.00, 12),
(28, 10, 100, 7500000.00, 8),
(29, 11, 50, 3950000.00, 0),
(30, 11, 100, 6100000.00, 10),
(31, 12, 50, 6500000.00, 12),
(32, 12, 100, 9800000.00, 8),
(33, 12, 250, 22000000.00, 10),
(3001, 1001, 100, 3450000.00, 24),
(3002, 1002, 100, 3650000.00, 18),
(3003, 1003, 100, 3550000.00, 30),
(3004, 1004, 100, 3250000.00, 20),
(3005, 1005, 100, 3390000.00, 26),
(3006, 1006, 100, 3890000.00, 14),
(3007, 1007, 100, 5200000.00, 16),
(3008, 1008, 100, 4980000.00, 22),
(3009, 1009, 50, 9200000.00, 8),
(3010, 1010, 100, 6900000.00, 12),
(3011, 1011, 100, 7200000.00, 10),
(3013, 1013, 90, 3550000.00, 19),
(3014, 1014, 90, 3350000.00, 17),
(3015, 1015, 100, 3590000.00, 21),
(3016, 1016, 100, 2590000.00, 23),
(3017, 1017, 90, 2450000.00, 28),
(3018, 1018, 100, 2790000.00, 25),
(3019, 1019, 100, 3290000.00, 16),
(3020, 1020, 90, 3390000.00, 14),
(3021, 1021, 100, 3190000.00, 20),
(3022, 1022, 100, 9900000.00, 7),
(3023, 1023, 100, 9800000.00, 6),
(3024, 1024, 100, 10300000.00, 6),
(3025, 1025, 100, 3190000.00, 29),
(3026, 1026, 100, 2790000.00, 24),
(3027, 1027, 100, 3490000.00, 13),
(3028, 1028, 100, 4190000.00, 11),
(3029, 1029, 100, 5450000.00, 15),
(3033, 1033, 100, 2990000.00, 26),
(3034, 1034, 90, 3590000.00, 18),
(3035, 1035, 100, 2690000.00, 22),
(3036, 1036, 90, 2890000.00, 20),
(3037, 1037, 100, 2950000.00, 25),
(3038, 1038, 100, 3250000.00, 19),
(3039, 1039, 75, 11200000.00, 10),
(3040, 1040, 100, 9700000.00, 8),
(3041, 1041, 100, 3490000.00, 17),
(3042, 1042, 100, 4590000.00, 12),
(3043, 1043, 100, 4850000.00, 15),
(3045, 1045, 100, 2790000.00, 24),
(3046, 1046, 100, 2390000.00, 27),
(3047, 1047, 100, 8400000.00, 6),
(3048, 1048, 75, 10500000.00, 11),
(3049, 1049, 100, 3650000.00, 13),
(3050, 1050, 100, 3550000.00, 21);

-- --------------------------------------------------------

--
-- Table structure for table `product_views`
--

CREATE TABLE `product_views` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `viewed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_views`
--

INSERT INTO `product_views` (`id`, `product_id`, `user_id`, `viewed_at`) VALUES
(1, 1, 3, '2024-05-01 09:00:00'),
(2, 1, 4, '2024-05-01 10:00:00'),
(3, 1, 5, '2024-05-02 09:00:00'),
(4, 1, 6, '2024-05-02 11:00:00'),
(5, 2, 3, '2024-05-01 09:10:00'),
(6, 2, 7, '2024-05-03 14:00:00'),
(7, 10, 5, '2024-05-03 08:00:00'),
(8, 10, 6, '2024-05-04 09:00:00'),
(9, 12, 5, '2024-05-03 08:10:00'),
(10, 12, 8, '2024-05-05 10:00:00'),
(11, 6, 3, '2024-05-05 11:00:00'),
(12, 7, 7, '2024-05-10 09:00:00'),
(13, 11, 7, '2024-05-15 14:00:00'),
(14, 11, 9, '2024-05-16 10:00:00'),
(15, 9, 11, '2026-03-17 08:24:57'),
(16, 9, 11, '2026-03-17 08:24:57'),
(17, 9, 11, '2026-03-17 08:34:30'),
(18, 9, 11, '2026-03-17 08:34:30'),
(19, 5, 11, '2026-03-18 02:05:30'),
(20, 5, 11, '2026-03-18 02:05:30'),
(21, 5, 11, '2026-03-18 02:06:30'),
(22, 5, 11, '2026-03-18 02:06:30'),
(23, 8, 11, '2026-03-18 02:15:34'),
(24, 8, 11, '2026-03-18 02:15:34'),
(25, 11, 11, '2026-03-18 02:17:33'),
(26, 11, 11, '2026-03-18 02:17:33'),
(27, 8, 11, '2026-03-18 02:20:00'),
(28, 8, 11, '2026-03-18 02:20:00'),
(29, 8, 11, '2026-03-21 12:30:47'),
(30, 8, 11, '2026-03-21 12:30:47'),
(31, 3, 11, '2026-03-21 12:59:59'),
(32, 3, 11, '2026-03-21 12:59:59'),
(33, 12, 11, '2026-03-21 13:00:14'),
(34, 12, 11, '2026-03-21 13:00:14'),
(35, 5, 11, '2026-03-21 14:40:24'),
(36, 12, 11, '2026-03-21 14:53:08'),
(37, 12, 11, '2026-03-21 14:53:08'),
(38, 5, 11, '2026-03-21 14:53:25'),
(39, 5, 11, '2026-03-21 14:53:26'),
(40, 5, 11, '2026-03-21 14:53:26'),
(41, 8, 11, '2026-03-21 14:53:29'),
(42, 8, 11, '2026-03-21 14:53:29'),
(43, 4, 11, '2026-03-21 14:53:31'),
(44, 4, 11, '2026-03-21 14:53:32'),
(45, 4, 11, '2026-03-21 14:53:32'),
(46, 10, 11, '2026-03-21 14:53:35'),
(47, 10, 11, '2026-03-21 14:53:35'),
(48, 8, 11, '2026-03-21 14:54:55'),
(49, 8, 11, '2026-03-21 14:54:55'),
(50, 8, 11, '2026-03-21 14:57:40'),
(51, 8, 11, '2026-03-21 14:57:40'),
(52, 8, 11, '2026-04-13 23:52:21'),
(53, 8, 11, '2026-04-13 23:52:21'),
(54, 8, 11, '2026-04-13 23:52:30'),
(55, 8, 11, '2026-04-13 23:52:30'),
(58, 8, 11, '2026-04-14 00:00:29'),
(59, 8, 11, '2026-04-14 00:00:30'),
(60, 5, 11, '2026-04-14 00:00:41'),
(61, 9, 11, '2026-04-14 00:00:48'),
(62, 9, 11, '2026-04-14 00:00:51'),
(63, 9, 11, '2026-04-14 00:00:51'),
(64, 5, 11, '2026-04-14 21:15:35'),
(65, 5, 11, '2026-04-14 21:15:35'),
(66, 5, 11, '2026-04-14 21:15:37'),
(67, 5, 11, '2026-04-14 21:15:37'),
(70, 1001, 11, '2026-04-14 22:53:12'),
(71, 1001, 11, '2026-04-14 22:53:12'),
(72, 1002, 11, '2026-04-14 22:57:45'),
(73, 1002, 11, '2026-04-14 22:57:45'),
(74, 1013, 11, '2026-04-14 23:10:37'),
(75, 1013, 11, '2026-04-14 23:10:37'),
(76, 1024, 11, '2026-04-14 23:13:52'),
(77, 1024, 11, '2026-04-14 23:13:52'),
(78, 1025, 11, '2026-04-14 23:15:04'),
(79, 1025, 11, '2026-04-14 23:15:04'),
(80, 1025, 11, '2026-04-14 23:16:02'),
(81, 1025, 11, '2026-04-14 23:16:02'),
(82, 1026, 11, '2026-04-14 23:16:05'),
(83, 1026, 11, '2026-04-14 23:16:05'),
(84, 1027, 11, '2026-04-14 23:16:58'),
(85, 1027, 11, '2026-04-14 23:16:58'),
(86, 1028, 11, '2026-04-14 23:18:15'),
(87, 1028, 11, '2026-04-14 23:18:15'),
(88, 1029, 11, '2026-04-14 23:19:06'),
(89, 1029, 11, '2026-04-14 23:19:06'),
(94, 1029, 11, '2026-04-14 23:21:43'),
(95, 1029, 11, '2026-04-14 23:21:43'),
(98, 1033, 11, '2026-04-14 23:23:29'),
(99, 1033, 11, '2026-04-14 23:23:29'),
(100, 1034, 11, '2026-04-14 23:24:10'),
(101, 1034, 11, '2026-04-14 23:24:10'),
(102, 1035, 11, '2026-04-14 23:24:53'),
(103, 1035, 11, '2026-04-14 23:24:53'),
(104, 1036, 11, '2026-04-14 23:26:12'),
(105, 1036, 11, '2026-04-14 23:26:13'),
(106, 1036, 11, '2026-04-14 23:26:13'),
(107, 1037, 11, '2026-04-14 23:27:28'),
(108, 1037, 11, '2026-04-14 23:27:28'),
(109, 1036, 11, '2026-04-14 23:27:56'),
(110, 1036, 11, '2026-04-14 23:27:56'),
(111, 1037, 11, '2026-04-14 23:28:08'),
(112, 1037, 11, '2026-04-14 23:28:08'),
(113, 1038, 11, '2026-04-14 23:28:54'),
(114, 1038, 11, '2026-04-14 23:28:54'),
(115, 1039, 11, '2026-04-14 23:30:28'),
(116, 1039, 11, '2026-04-14 23:30:28'),
(117, 1040, 11, '2026-04-14 23:31:23'),
(118, 1040, 11, '2026-04-14 23:31:23'),
(119, 1047, 11, '2026-04-14 23:32:21'),
(120, 1047, 11, '2026-04-14 23:32:21'),
(121, 1023, 11, '2026-04-14 23:32:53'),
(122, 1023, 11, '2026-04-14 23:32:53'),
(123, 1041, 11, '2026-04-14 23:33:44'),
(124, 1041, 11, '2026-04-14 23:33:44'),
(125, 1042, 11, '2026-04-14 23:34:26'),
(126, 1042, 11, '2026-04-14 23:34:26'),
(127, 1048, 11, '2026-04-14 23:35:09'),
(128, 1048, 11, '2026-04-14 23:35:09'),
(129, 1017, 11, '2026-04-14 23:36:34'),
(130, 1017, 11, '2026-04-14 23:36:34'),
(131, 1018, 11, '2026-04-14 23:37:26'),
(132, 1018, 11, '2026-04-14 23:37:26'),
(133, 1020, 11, '2026-04-14 23:38:28'),
(134, 1020, 11, '2026-04-14 23:38:28'),
(135, 5, 11, '2026-04-14 23:39:29'),
(136, 5, 11, '2026-04-14 23:39:29'),
(137, 1043, 11, '2026-04-14 23:40:42'),
(138, 1043, 11, '2026-04-14 23:40:42'),
(139, 1045, 11, '2026-04-14 23:41:28'),
(140, 1045, 11, '2026-04-14 23:41:28'),
(141, 1046, 11, '2026-04-14 23:41:57'),
(142, 1046, 11, '2026-04-14 23:41:57'),
(143, 1049, 11, '2026-04-14 23:42:36'),
(144, 1049, 11, '2026-04-14 23:42:36'),
(145, 1050, 11, '2026-04-14 23:43:41'),
(146, 1050, 11, '2026-04-14 23:43:41'),
(147, 1034, 11, '2026-04-15 00:39:33'),
(148, 1034, 11, '2026-04-15 00:39:33'),
(149, 1028, 11, '2026-04-15 00:40:48'),
(150, 1028, 11, '2026-04-15 00:40:48'),
(151, 1033, 11, '2026-04-15 00:40:51'),
(152, 1033, 11, '2026-04-15 00:40:51'),
(153, 1029, 11, '2026-04-15 00:40:53'),
(154, 1029, 11, '2026-04-15 00:40:53'),
(155, 1025, 11, '2026-04-15 00:40:56'),
(156, 1025, 11, '2026-04-15 00:40:56'),
(157, 1026, 11, '2026-04-15 00:40:58'),
(158, 1026, 11, '2026-04-15 00:40:58'),
(159, 1024, 11, '2026-04-15 00:41:02'),
(160, 1024, 11, '2026-04-15 00:41:02'),
(161, 10, 11, '2026-04-15 00:41:20'),
(162, 10, 11, '2026-04-15 00:41:20'),
(163, 10, 11, '2026-04-15 00:47:04'),
(164, 10, 11, '2026-04-15 00:47:04'),
(165, 1025, 11, '2026-04-15 00:47:10'),
(166, 1025, 11, '2026-04-15 00:47:10'),
(167, 3, 11, '2026-04-15 00:47:23'),
(168, 3, 11, '2026-04-15 00:47:23'),
(169, 10, 11, '2026-04-15 00:47:35'),
(170, 10, 11, '2026-04-15 00:47:35'),
(171, 10, 11, '2026-04-15 00:47:43'),
(172, 10, 11, '2026-04-15 00:47:43'),
(173, 1050, 11, '2026-04-15 01:00:40'),
(174, 1050, 11, '2026-04-15 01:00:40'),
(175, 5, 11, '2026-04-15 01:01:07'),
(176, 5, 11, '2026-04-15 01:01:07');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_options`
--

CREATE TABLE `quiz_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `option_text` varchar(200) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_options`
--

INSERT INTO `quiz_options` (`id`, `question_id`, `option_text`, `tag`) VALUES
(1, 1, 'Nam', 'male'),
(2, 1, 'Nữ', 'female'),
(3, 1, 'Unisex', 'unisex'),
(4, 2, 'Hoa tươi nhẹ nhàng', 'floral'),
(5, 2, 'Gỗ & Đất ấm áp', 'woody'),
(6, 2, 'Citrus tươi mát', 'citrus'),
(7, 2, 'Huyền bí & Gợi cảm', 'oriental'),
(8, 3, 'Đi làm hàng ngày', 'daily'),
(9, 3, 'Buổi tối / Hẹn hò', 'evening'),
(10, 3, 'Thể thao / Năng động', 'sport'),
(11, 3, 'Sự kiện đặc biệt', 'special'),
(12, 4, 'Nhẹ nhàng (2-4h)', 'light'),
(13, 4, 'Vừa phải (4-8h)', 'moderate'),
(14, 4, 'Lâu bền (8h+)', 'longlasting'),
(15, 5, 'Dưới 1.5 triệu', 'budget'),
(16, 5, '1.5 – 3 triệu', 'mid'),
(17, 5, 'Trên 3 triệu', 'premium');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `question` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `question`) VALUES
(1, 'Bạn thuộc giới tính nào?'),
(2, 'Bạn thích mùi hương nào nhất?'),
(3, 'Bạn thường dùng nước hoa khi nào?'),
(4, 'Độ lưu hương bạn muốn?'),
(5, 'Ngân sách của bạn?');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `result_tag` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `status` enum('visible','hidden') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`) VALUES
(1, 3, 1, 5, 'Mùi hương tuyệt vời, nam tính và lưu hương cực lâu. Dùng từ sáng đến chiều vẫn còn mùi thơm. Giao hàng nhanh, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop!', 'visible', '2024-05-05 10:00:00'),
(3, 8, 1, 4, 'Rất hài lòng với Sauvage EDP, mùi sang và bền. Chỉ tiếc là giá hơi cao nhưng xứng đáng với chất lượng. Shop tư vấn nhiệt tình.', 'visible', '2024-05-10 11:00:00'),
(4, 5, 2, 5, 'Bleu Parfum thực sự là đỉnh của dòng Bleu. Gỗ và Amber hòa quyện hoàn hảo. Dùng 1-2 xịt là đủ cho cả ngày. Giá cao nhưng hoàn toàn xứng đáng!', 'visible', '2024-05-20 09:00:00'),
(5, 6, 2, 4, 'Mùi thanh lịch, phù hợp đi làm văn phòng. Tuy nhiên so với EDT thì Parfum hơi nặng hơn với người mới. Nhìn chung rất hài lòng.', 'visible', '2024-05-21 15:00:00'),
(6, 3, 6, 5, 'Coco Mademoiselle Intense thực sự xứng đáng là nữ hoàng nước hoa. Jasmine và Rose hòa quyện tuyệt vời. Lưu hương đến 10 tiếng. Quá tuyệt!', 'visible', '2024-05-25 10:00:00'),
(7, 9, 6, 4, 'Mùi hương sang trọng, phù hợp đi tiệc. Tầng hương phát triển rất đẹp theo từng giờ. Hơi ngọt với người mới nhưng quen rồi rất mê.', 'visible', '2024-05-26 14:00:00'),
(8, 7, 7, 5, 'Black Opium là mùi nước hoa yêu thích nhất của tôi! Hương cà phê và vanilla đặc trưng, gợi cảm và bí ẩn. Mùa đông dùng quá hợp.', 'visible', '2024-05-22 11:00:00'),
(9, 4, 7, 5, 'Mùi độc lạ, khó quên. Ai nếm qua Black Opium đều không thể quên được. Shop giao hàng siêu nhanh, đóng gói đẹp.', 'visible', '2024-05-23 09:00:00'),
(10, 8, 7, 3, 'Mùi hơi ngọt quá so với tôi mong đợi, cảm giác hơi ngộp khi dùng nhiều. Nhưng độ lưu hương rất tốt. Phù hợp mùa lạnh hơn.', 'visible', '2024-05-25 16:00:00'),
(11, 5, 10, 5, 'Tom Ford Oud Wood là đỉnh của nước hoa luxury. Oud quý hiếm, gỗ đàn hương ấm áp. Một chai dùng được cho mọi dịp. Đáng đầu tư!', 'visible', '2024-05-07 10:00:00'),
(12, 6, 10, 5, 'Lần đầu ngửi Oud Wood tôi đã bị \"say\" ngay lập tức. Hương thơm của sự sang trọng và đẳng cấp. Giao hàng đúng hẹn, sản phẩm chính hãng.', 'visible', '2024-05-08 14:00:00'),
(13, 7, 11, 4, 'Santal 33 có mùi hương rất đặc biệt, không giống bất kỳ chai nào tôi từng dùng. Gỗ đàn hương ấm áp, unisex hoàn hảo.', 'visible', '2024-05-22 15:00:00'),
(14, 9, 11, 4, 'Đây là mùi hương tôi tìm kiếm từ lâu. Santal 33 vừa masculine vừa feminine, phù hợp cho cả hai giới. Giá cao nhưng chất lượng tương xứng.', 'visible', '2024-05-23 11:00:00'),
(15, 5, 12, 5, 'Aventus xứng đáng với danh tiếng huyền thoại của nó. Pineapple và Birch tạo nên sự tươi mát và nam tính hiếm có. Đây là chai nước hoa tôi tự thưởng cho bản thân.', 'visible', '2024-05-07 11:00:00'),
(16, 11, 8, 5, 'tuytej', 'visible', '2026-04-13 23:52:28');

-- --------------------------------------------------------

--
-- Table structure for table `review_media`
--

CREATE TABLE `review_media` (
  `id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `media_type` enum('image','video') NOT NULL,
  `file_url` varchar(512) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'staff'),
(3, 'customer');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `permission_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 2, 1),
(9, 2, 2),
(10, 2, 4),
(11, 2, 5),
(12, 2, 6),
(13, 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `search_history`
--

CREATE TABLE `search_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `keyword` varchar(200) DEFAULT NULL,
  `searched_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `avatar`, `role_id`, `status`, `email_verified`, `created_at`) VALUES
(1, 'Admin NGOCVI', 'admin@ngocvi.com', '$2a$10$.XOYTEVD2vXhIP3d6WEdfe.2.8a0gUnCc/VU.TvYpFK1NDalX/wZK', '0901234567', NULL, 1, 'active', 1, '2024-01-01 08:00:00'),
(2, 'Nguyễn Thị Lan', 'lan.nguyen@ngocvi.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0912345678', NULL, 2, 'active', 1, '2024-01-05 09:00:00'),
(3, 'Võ Ngọc Vĩ', 'vongocvi@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0901234568', NULL, 3, 'active', 1, '2024-02-10 10:30:00'),
(4, 'Trần Minh Tuấn', 'minhtuan@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0933888999', NULL, 3, 'active', 1, '2024-02-15 14:20:00'),
(5, 'Phạm Thị Mai', 'maipham@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0977665544', NULL, 3, 'active', 1, '2024-03-01 09:15:00'),
(6, 'Lê Hoàng Nam', 'lehoangnam@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0912345679', NULL, 2, 'active', 1, '2024-03-10 16:45:00'),
(7, 'Hoàng Thúy Linh', 'thuylinh@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0988112233', NULL, 3, 'active', 1, '2024-04-01 11:00:00'),
(8, 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0966554433', NULL, 3, 'active', 1, '2024-04-15 08:30:00'),
(9, 'Bùi Thị Hoa', 'buithihoa@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0955443322', NULL, 3, 'active', 1, '2024-05-01 13:20:00'),
(10, 'Đặng Quốc Huy', 'dangquochuy@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy8', '0944332211', NULL, 3, 'active', 1, '2024-05-20 10:00:00'),
(11, 'Admin Demo', 'admin@123.com', '$2a$10$9bbs6AQTtjQ1zS3F6LjZaeZWOiDnuSQFJKvmpyH3eSa6Zgdy6Kc4S', '0967694148', NULL, 1, 'active', 0, '2026-03-17 08:20:22');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `discount_type` enum('percent','fixed') DEFAULT NULL,
  `discount_value` decimal(10,2) DEFAULT NULL,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `min_order_value` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount_type`, `discount_value`, `max_discount`, `min_order_value`, `quantity`, `start_date`, `end_date`) VALUES
(1, 'WELCOME10', 'percent', 10.00, 200000.00, 500000.00, 100, '2024-01-01 00:00:00', '2030-12-31 23:59:59'),
(2, 'GIAMGIA50', 'fixed', 50000.00, NULL, 300000.00, 50, '2024-01-01 00:00:00', '2030-12-31 23:59:59'),
(3, 'VIP200', 'fixed', 200000.00, NULL, 2000000.00, 30, '2024-01-01 00:00:00', '2030-06-30 23:59:59'),
(4, 'SAVE15', 'percent', 15.00, 300000.00, 1000000.00, 50, '2024-03-01 00:00:00', '2030-12-31 23:59:59'),
(5, 'FREESHIP', 'fixed', 35000.00, NULL, 100000.00, 200, '2023-12-31 00:00:00', '2030-12-31 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `voucher_usage`
--

CREATE TABLE `voucher_usage` (
  `id` int(11) NOT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voucher_usage`
--

INSERT INTO `voucher_usage` (`id`, `voucher_id`, `user_id`, `order_id`) VALUES
(1, 1, 5, 3),
(2, 3, 5, 10),
(3, 2, 8, 6);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 3, 2, '2024-05-01 09:00:00'),
(2, 3, 11, '2024-05-01 09:05:00'),
(3, 3, 12, '2024-05-01 09:10:00'),
(4, 4, 1, '2024-05-02 10:00:00'),
(5, 4, 6, '2024-05-02 10:05:00'),
(6, 5, 10, '2024-05-03 08:00:00'),
(7, 5, 3, '2024-05-03 08:05:00'),
(8, 6, 7, '2024-05-04 11:00:00'),
(9, 7, 2, '2024-05-05 14:00:00'),
(10, 7, 9, '2024-05-05 14:05:00'),
(12, 11, 1050, '2026-04-14 23:43:40'),
(13, 11, 1025, '2026-04-15 01:04:32'),
(14, 11, 1026, '2026-04-15 01:04:33'),
(15, 11, 1024, '2026-04-15 01:04:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_tags`
--
ALTER TABLE `product_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_tag_map`
--
ALTER TABLE `product_tag_map`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_views`
--
ALTER TABLE `product_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `review_media`
--
ALTER TABLE `review_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_review_media_review` (`review_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `search_history`
--
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `voucher_id` (`voucher_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1051;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2162;

--
-- AUTO_INCREMENT for table `product_tags`
--
ALTER TABLE `product_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `product_tag_map`
--
ALTER TABLE `product_tag_map`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3051;

--
-- AUTO_INCREMENT for table `product_views`
--
ALTER TABLE `product_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `quiz_options`
--
ALTER TABLE `quiz_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `review_media`
--
ALTER TABLE `review_media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `search_history`
--
ALTER TABLE `search_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `blogs_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`);

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_tag_map`
--
ALTER TABLE `product_tag_map`
  ADD CONSTRAINT `product_tag_map_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `product_tag_map_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `product_tags` (`id`);

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_views`
--
ALTER TABLE `product_views`
  ADD CONSTRAINT `product_views_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `product_views_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD CONSTRAINT `quiz_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`);

--
-- Constraints for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD CONSTRAINT `quiz_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `review_media`
--
ALTER TABLE `review_media`
  ADD CONSTRAINT `review_media_ibfk_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);

--
-- Constraints for table `search_history`
--
ALTER TABLE `search_history`
  ADD CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `voucher_usage`
--
ALTER TABLE `voucher_usage`
  ADD CONSTRAINT `voucher_usage_ibfk_1` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`),
  ADD CONSTRAINT `voucher_usage_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `voucher_usage_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
