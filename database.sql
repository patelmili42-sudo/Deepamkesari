-- Database Structure for Deepam Kesari Publishing House

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for authors
-- ----------------------------
DROP TABLE IF EXISTS `authors`;
CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `photo` varchar(1024) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `role` varchar(100) DEFAULT 'Author',
  `academic_pedigree` varchar(500) DEFAULT NULL,
  `creative_focus` varchar(500) DEFAULT NULL,
  `performing_arts` varchar(500) DEFAULT NULL,
  `literary_vision` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of authors
-- ----------------------------
INSERT INTO `authors` (`id`, `name`, `photo`, `bio`, `role`, `academic_pedigree`, `creative_focus`, `performing_arts`, `literary_vision`) VALUES (1, 'Deep Patel', '/input_file_2.png', 'Rooted in values and inspired by life itself, Deep Patel is a writer and publisher at Deepam Kesari Publishing House. He writes with the intention of preserving culture, expressing genuine human emotions, and encouraging positive change through meaningful literature.', 'Author', 'Master\'s degree in Science (M.Sc.) with specialization in Organic Chemistry', 'Gujarati Literature & Culture', 'Navodit Artist in Lokdayra', 'Writing is not merely a profession but a responsibility—to reflect truth, inspire courage, and create stories that leave a thoughtful and lasting impact on readers across generations.');

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `cover_image` varchar(1024) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `amazon_link` varchar(1024) DEFAULT NULL,
  `whatsapp_link` varchar(1024) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `language` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_author` (`author_id`),
  CONSTRAINT `fk_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of books
-- ----------------------------
INSERT INTO `books` (`id`, `title`, `author_id`, `cover_image`, `description`, `isbn`, `amazon_link`, `whatsapp_link`, `category`, `language`, `featured`) VALUES (6, 'રસ્તો કરી જવાના', 4, '/input_file_5.png', 'રસ્તો કરી જવાના (Rasto Kari Javan) is a collection of soul-stirring Gujarati poems and prose that resonate with the essence of life, resilience, and the human spirit. Deep Patel brings a modern yet deeply rooted perspective to classical Gujarati literary forms.', '978-8877665544', 'https://amzn.in/d/03abeR2d', 'https://wa.me/919876543210', 'Poetry', 'Gujarati', 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for reviews
-- ----------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `rating` int(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_review_book` (`book_id`),
  CONSTRAINT `fk_review_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of reviews
-- ----------------------------
INSERT INTO `reviews` (`id`, `book_id`, `user_name`, `rating`, `comment`) VALUES 
(1, 1, 'Amit Sharma', 5, 'Truly a masterpiece. Changed my perspective on ancient philosophy.'),
(2, 6, 'Rahul Patel', 5, 'Very inspiring collection. Must read for every literature lover.'),
(3, 2, 'Sneha Gupta', 4, 'Excellent historical context. The translation is very smooth.');

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `event_gallery_images`;
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `event_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(1024) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `details` text DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Event',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `event_gallery_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `image` varchar(1024) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_event_gallery` (`event_id`),
  CONSTRAINT `fk_event_gallery` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` (`id`, `title`, `event_date`, `location`, `image`, `description`, `details`, `category`) VALUES 
(1, 'Book Launch & Reading Circle', '2025-05-12', 'Ahmedabad, Gujarat', '/assets/images/BOOK_STACK.jpeg', 'An evening of author reflections, live readings, and conversation with readers.', 'The event featured a live reading from the latest release, a panel discussion, and a Q&A session with the authors and audience.', 'Launch Event'),
(2, 'Literary Festival Showcase', '2025-06-28', 'Rajkot, Gujarat', '/assets/images/BOOK_STACK2.jpeg', 'A vibrant celebration of storytelling, poetry, and emerging voices from across India.', 'Visitors enjoyed poetry readings, book stalls, interactive workshops, and networking among authors, publishers, and readers.', 'Festival'),
(3, 'Children''s Story Session', '2025-08-08', 'Vadodara, Gujarat', '/assets/images/books.jpeg', 'Interactive reading sessions designed to inspire young readers and families.', 'The session included storytelling, drawing activities, and a fun discussion about creativity and books for children.', 'Community Event');

INSERT INTO `event_gallery_images` (`id`, `event_id`, `image`, `caption`) VALUES 
(1, 1, '/assets/images/BOOK_STACK.jpeg', 'Readers at the launch event'),
(2, 1, '/assets/images/BOOK_STACK2.jpeg', 'Book display table'),
(3, 2, '/assets/images/books.jpeg', 'Author interaction at festival'),
(4, 2, '/assets/images/IMG_20250506_113923.png', 'Audience listening in a seminar'),
(5, 3, '/assets/images/NAME_LOGO.jpeg', 'Workshop participants'),
(6, 3, '/assets/images/logo.png', 'Launch ceremony');

-- ----------------------------
-- Table structure for contact_requests
-- ----------------------------
DROP TABLE IF EXISTS `contact_requests`;
CREATE TABLE `contact_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for subscribers
-- ----------------------------
DROP TABLE IF EXISTS `subscribers`;
CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for manuscripts
-- ----------------------------
DROP TABLE IF EXISTS `manuscripts`;
CREATE TABLE `manuscripts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
