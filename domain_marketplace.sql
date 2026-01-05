-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 05, 2026 at 08:29 AM
-- Server version: 8.4.7
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `domain_marketplace`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `domain_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_domain` (`user_id`,`domain_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_domain_id` (`domain_id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `domain_count` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `domain_count`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Premium', 'High-value premium domains', 45, 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:19'),
(2, 'Luxury', 'Luxury brand domains', 23, 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:19'),
(3, 'Short', 'Short and memorable domains', 67, 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:19'),
(4, 'Brandable', 'Brandable business names', 34, 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:19'),
(13, 'Generic', 'Generic keyword domains', 0, 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:19'),
(14, 'Numeric', 'Numeric and alphanumeric domains', 0, 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:19'),
(15, 'Geographic', 'Location-based domains', 0, 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:19'),
(16, 'Industry', 'Industry-specific domains', 0, 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:19'),
(61, 'Tech', 'Technology related domains', 0, 'active', '2025-12-31 06:48:02', '2025-12-31 07:03:19'),
(62, 'Business', 'Business related domains', 0, 'active', '2025-12-31 06:48:02', '2025-12-31 07:03:19'),
(73, 'Technology', 'Technology related domains', 0, 'active', '2025-12-31 10:31:29', '2025-12-31 10:31:29');

-- --------------------------------------------------------

--
-- Table structure for table `cms_pages`
--

DROP TABLE IF EXISTS `cms_pages`;
CREATE TABLE IF NOT EXISTS `cms_pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
CREATE TABLE IF NOT EXISTS `domains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `status` enum('available','sold','auction','pending') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `description` text COLLATE utf8mb4_unicode_ci,
  `tags` text COLLATE utf8mb4_unicode_ci,
  `views` int DEFAULT '0',
  `offers` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `extension` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'com',
  `length` int DEFAULT '0',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  KEY `idx_name` (`name`),
  KEY `idx_domains_status` (`status`),
  KEY `idx_domains_name` (`name`),
  KEY `idx_domains_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domains`
--

INSERT INTO `domains` (`id`, `name`, `category`, `price`, `category_id`, `status`, `description`, `tags`, `views`, `offers`, `created_at`, `updated_at`, `extension`, `length`, `image_url`, `is_featured`) VALUES
(1, 'techguru.com', 'technology', 15000.00, NULL, 'available', '', '', 0, 0, '2025-12-30 15:11:45', '2026-01-04 16:19:29', 'com', 0, NULL, 0),
(2, 'fashionhub.com', 'fashion', 12000.00, NULL, 'available', '', '', 0, 0, '2025-12-30 15:11:45', '2026-01-04 16:19:25', 'com', 0, NULL, 0),
(3, 'foodnetwork.com', 'food', 25000.00, NULL, 'auction', '', '', 0, 0, '2025-12-30 15:11:45', '2025-12-30 15:11:45', 'com', 0, NULL, 0),
(4, 'realestatepro.com', 'real-estate', 35000.00, NULL, 'available', '', '', 0, 0, '2025-12-30 15:11:45', '2026-01-04 16:18:15', 'com', 0, NULL, 0),
(5, 'test', 'Technology', 700.00, NULL, 'available', 'test', 'test', 0, 0, '2025-12-30 15:19:15', '2025-12-30 15:19:15', 'com', 0, NULL, 0),
(6, 'venture.co', 'Technology', 25000.00, 1, 'available', 'Premium venture capital domain', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:19:22', 'com', 0, NULL, 0),
(7, 'nexus.io', 'Technology', 15000.00, 1, 'available', 'Tech startup domain', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:18:02', 'com', 0, NULL, 0),
(8, 'luxury.app', 'Technology', 12000.00, 2, 'available', 'Luxury brand domain', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:19:18', 'com', 0, NULL, 0),
(9, 'short.ly', 'Technology', 8000.00, 3, 'available', 'Short memorable domain', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:19:14', 'com', 0, NULL, 0),
(10, 'brandable.com', 'Technology', 18000.00, 4, 'available', 'Perfect for brand building', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:19:10', 'com', 0, NULL, 0),
(11, 'tech.ioo', 'Technology', 10000.00, 1, 'available', 'Technology focused domain', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:19:06', 'com', 0, NULL, 0),
(12, 'business.co', 'Technology', 9000.00, 1, 'available', 'Business and finance domain', '', 0, 0, '2025-12-31 07:08:47', '2026-01-04 16:19:03', 'com', 0, NULL, 0),
(20, 'Ramhan Island', 'Technology', 700.00, NULL, 'available', 'test', 'test', 0, 0, '2025-12-31 12:42:15', '2026-01-04 16:18:57', 'com', 0, NULL, 0),
(21, 'Rana Usman', 'Technology', 700.00, NULL, 'available', 'test', 'test', 0, 0, '2026-01-04 13:59:57', '2026-01-04 16:18:53', 'com', 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `domains_backup`
--

DROP TABLE IF EXISTS `domains_backup`;
CREATE TABLE IF NOT EXISTS `domains_backup` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `status` enum('available','sold','auction','pending') COLLATE utf8mb4_unicode_ci DEFAULT 'available',
  `description` text COLLATE utf8mb4_unicode_ci,
  `tags` text COLLATE utf8mb4_unicode_ci,
  `views` int DEFAULT '0',
  `offers` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `extension` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'com',
  `length` int DEFAULT '0',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domains_backup`
--

INSERT INTO `domains_backup` (`id`, `name`, `category`, `price`, `category_id`, `status`, `description`, `tags`, `views`, `offers`, `created_at`, `updated_at`, `extension`, `length`, `image_url`, `is_featured`) VALUES
(1, 'techguru.com', 'technology', 15000.00, NULL, 'available', '', '', 0, 0, '2025-12-30 15:11:45', '2025-12-30 15:11:45', 'com', 0, NULL, 0),
(2, 'fashionhub.com', 'fashion', 12000.00, NULL, 'available', '', '', 0, 0, '2025-12-30 15:11:45', '2025-12-30 15:11:45', 'com', 0, NULL, 0),
(3, 'foodnetwork.com', 'food', 25000.00, NULL, 'auction', '', '', 0, 0, '2025-12-30 15:11:45', '2025-12-30 15:11:45', 'com', 0, NULL, 0),
(4, 'realestatepro.com', 'real-estate', 35000.00, NULL, 'available', '', '', 0, 0, '2025-12-30 15:11:45', '2025-12-30 15:11:45', 'com', 0, NULL, 0),
(5, 'test', 'Technology', 700.00, NULL, 'available', 'test', 'test', 0, 0, '2025-12-30 15:19:15', '2025-12-30 15:19:15', 'com', 0, NULL, 0),
(6, 'venture.co', NULL, 25000.00, 1, 'available', 'Premium venture capital domain', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0),
(7, 'nexus.io', NULL, 15000.00, 1, 'available', 'Tech startup domain', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0),
(8, 'luxury.app', NULL, 12000.00, 2, 'available', 'Luxury brand domain', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0),
(9, 'short.ly', NULL, 8000.00, 3, 'available', 'Short memorable domain', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0),
(10, 'brandable.com', NULL, 18000.00, 4, 'available', 'Perfect for brand building', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0),
(11, 'tech.io', NULL, 10000.00, 1, 'available', 'Technology focused domain', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0),
(12, 'business.co', NULL, 9000.00, 1, 'available', 'Business and finance domain', NULL, 0, 0, '2025-12-31 07:08:47', '2025-12-31 07:08:47', 'com', 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `domain_categories`
--

DROP TABLE IF EXISTS `domain_categories`;
CREATE TABLE IF NOT EXISTS `domain_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `domain_id` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_domain_category` (`domain_id`,`category_id`),
  KEY `idx_domain_id` (`domain_id`),
  KEY `idx_category_id` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domain_categories`
--

INSERT INTO `domain_categories` (`id`, `domain_id`, `category_id`, `created_at`) VALUES
(1, 1, 73, '2025-12-31 10:31:38'),
(2, 2, 73, '2025-12-31 10:31:38'),
(3, 3, 73, '2025-12-31 10:31:38'),
(4, 4, 73, '2025-12-31 10:31:38'),
(5, 5, 73, '2025-12-31 10:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `domain_tags`
--

DROP TABLE IF EXISTS `domain_tags`;
CREATE TABLE IF NOT EXISTS `domain_tags` (
  `domain_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`domain_id`,`tag_id`),
  KEY `idx_domain_tags_domain` (`domain_id`),
  KEY `idx_domain_tags_tag` (`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `domain_tags`
--

INSERT INTO `domain_tags` (`domain_id`, `tag_id`, `created_at`) VALUES
(1, 1, '2025-12-30 16:02:15'),
(1, 4, '2025-12-30 16:02:15'),
(1, 5, '2025-12-30 16:02:15'),
(2, 1, '2025-12-30 16:02:15'),
(2, 3, '2025-12-30 16:02:15'),
(2, 5, '2025-12-30 16:02:15'),
(3, 2, '2025-12-30 16:02:15'),
(3, 4, '2025-12-30 16:02:15'),
(4, 6, '2025-12-30 16:02:15'),
(4, 5, '2025-12-30 16:02:15'),
(5, 2, '2025-12-30 16:02:15'),
(5, 5, '2025-12-30 16:02:15'),
(6, 1, '2025-12-30 16:02:15'),
(6, 3, '2025-12-30 16:02:15'),
(7, 2, '2025-12-30 16:02:15'),
(8, 3, '2025-12-30 16:02:15'),
(8, 1, '2025-12-30 16:02:15'),
(2, 4, '2025-12-31 10:31:38'),
(3, 1, '2025-12-31 10:31:38'),
(4, 1, '2025-12-31 10:31:38'),
(4, 4, '2025-12-31 10:31:38'),
(5, 1, '2025-12-31 10:31:38'),
(5, 4, '2025-12-31 10:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `type` enum('general','domain','support','partnership') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `status` enum('new','read','replied','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `domain_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_enquiries_domain` (`domain_id`),
  KEY `idx_enquiries_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`id`, `name`, `email`, `subject`, `domain`, `message`, `type`, `status`, `domain_id`, `created_at`, `updated_at`) VALUES
(3, 'Michael Smith', 'michael@outlook.com', 'Support needed', 'techhub.ae', 'I am unable to complete the checkout process. Please assist.', 'support', 'closed', 3, '2026-01-04 16:21:54', '2026-01-04 17:41:50'),
(4, 'Aisha Khan', 'aisha@yahoo.com', 'Domain transfer question', 'greenenergy.ae', 'How long does the transfer process take after purchase?', 'general', 'closed', 4, '2026-01-04 16:21:54', '2026-01-04 17:42:00');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
CREATE TABLE IF NOT EXISTS `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `domain_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `offer_amount` decimal(15,2) NOT NULL,
  `offer_type` enum('buy','lease','partnership') COLLATE utf8mb4_unicode_ci DEFAULT 'buy',
  `status` enum('pending','accepted','rejected','expired') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `message` text COLLATE utf8mb4_unicode_ci,
  `buyer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buyer_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buyer_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_domain_id` (`domain_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `domain_id` int NOT NULL,
  `domain_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buyer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buyer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buyer_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_info` text COLLATE utf8mb4_unicode_ci,
  `seller_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seller_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `status` enum('pending','processing','completed','cancelled','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_status` (`status`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_domain` (`domain_id`),
  KEY `idx_orders_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `domain_id` int NOT NULL,
  `domain_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_domain_id` (`domain_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo_settings`
--

DROP TABLE IF EXISTS `seo_settings`;
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `og_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `og_description` text COLLATE utf8mb4_unicode_ci,
  `og_image` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_card` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_description` text COLLATE utf8mb4_unicode_ci,
  `twitter_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `structured_data` text COLLATE utf8mb4_unicode_ci,
  `canonical_url` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `robots` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` decimal(2,1) DEFAULT '0.5',
  `last_modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `schema_markup` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `page` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page` (`page`),
  KEY `idx_page_name` (`page_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seo_settings`
--

INSERT INTO `seo_settings` (`id`, `page_name`, `title`, `description`, `keywords`, `og_title`, `og_description`, `og_image`, `twitter_card`, `twitter_title`, `twitter_description`, `twitter_image`, `structured_data`, `canonical_url`, `robots`, `priority`, `last_modified`, `schema_markup`, `updated_at`, `page`) VALUES
(1, '', 'DomainHub - Premium Domain Marketplace', 'Buy and sell premium domains with ease. Find the perfect domain name for your business.', 'domains, premium domains, domain marketplace, buy domains, sell domains', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1.0, '2025-12-31 07:08:39', NULL, '2025-12-31 07:08:39', 'home'),
(2, '', 'Browse Premium Domains - DomainHub', 'Explore our collection of premium domains available for purchase. Find the perfect name for your brand.', 'browse domains, premium domains, domain names, brand domains', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.9, '2025-12-31 07:08:39', NULL, '2025-12-31 07:08:39', 'domains'),
(3, '', 'About DomainHub - Premium Domain Marketplace', 'Learn more about DomainHub and our mission to connect buyers and sellers of premium domains.', 'about us, domain marketplace, premium domains', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.7, '2025-12-31 07:08:39', NULL, '2025-12-31 07:08:39', 'about'),
(4, '', 'Contact DomainHub - Get in Touch', 'Contact DomainHub for any questions about buying or selling premium domains.', 'contact, support, domain marketplace', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.7, '2025-12-31 07:08:39', NULL, '2025-12-31 07:08:39', 'contact'),
(5, '', 'How It Works - DomainHub', 'Learn how to buy and sell premium domains on DomainHub. Simple and secure process.', 'how it works, buy domains, sell domains, domain process', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0.8, '2025-12-31 07:08:39', NULL, '2025-12-31 07:08:39', 'how-it-works'),
(6, '', 'Sitemap 1', 'Generated sitemap with 19 URLs', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n\n    <url>\n      <loc>https://yourdomain.com</loc>\n      <lastmod>2026-01-05</lastmod>\n      <changefreq>daily</changefreq>\n      <priority>1</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/home</loc>\n      <lastmod>2025-12-31</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>1.0</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains</loc>\n      <lastmod>2025-12-31</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/how-it-works</loc>\n      <lastmod>2025-12-31</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.8</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/about</loc>\n      <lastmod>2025-12-31</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.7</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/contact</loc>\n      <lastmod>2025-12-31</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.7</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/Rana Usman</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/Ramhan Island</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/venture.co</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/nexus.io</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/luxury.app</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/short.ly</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/brandable.com</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/tech.ioo</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/business.co</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/test</loc>\n      <lastmod>2025-12-30</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/techguru.com</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/fashionhub.com</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n    <url>\n      <loc>https://yourdomain.com/domains/realestatepro.com</loc>\n      <lastmod>2026-01-04</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>0.9</priority>\n    </url>\n  \n</urlset>', NULL, NULL, 0.5, '2026-01-05 08:27:58', NULL, '2026-01-05 08:27:58', 'sitemap-main.xml'),
(7, '', 'Sitemap Index', 'Main sitemap index file', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n\n  <sitemap>\n    <loc>https://yourdomain.com/sitemap-main.xml</loc>\n    <lastmod>2026-01-05</lastmod>\n  </sitemap>\n\n</sitemapindex>', NULL, NULL, 0.5, '2026-01-05 08:27:58', NULL, '2026-01-05 08:27:58', 'sitemap.xml'),
(8, '', 'Robots.txt', 'Robots.txt file for search engine crawling', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'User-agent: *\nAllow: /\n\n# Block admin and API routes\nDisallow: /admin/\nDisallow: /api/\nDisallow: /private/\nDisallow: /dashboard/\n\n# Block specific file types\nDisallow: /*.pdf$\nDisallow: /*.doc$\nDisallow: /*.xls$\n\n# Sitemap location\nSitemap: https://yourdomain.com/sitemap.xml\n\n# Crawl delay for bots\nCrawl-delay: 1\n\n# Additional rules for specific bots\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: ia_archiver\nDisallow: /\n\nUser-agent: mj12bot\nDisallow: /', NULL, NULL, 0.5, '2026-01-05 08:28:00', NULL, '2026-01-05 08:28:00', 'robots.txt');

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

DROP TABLE IF EXISTS `system_logs`;
CREATE TABLE IF NOT EXISTS `system_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `level` enum('info','warning','error','debug') COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `message` text COLLATE utf8mb4_unicode_ci,
  `user_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_level` (`level`),
  KEY `idx_user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `domain_count` int DEFAULT '0',
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `description`, `domain_count`, `color`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Premium', 'High-value premium domains', 45, '#FFD700', 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:39'),
(2, 'Tech', 'Technology related domains', 67, '#0066CC', 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:39'),
(3, 'Short', 'Short and memorable domains', 34, '#FF6B6B', 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:39'),
(4, 'Brandable', 'Brandable business names', 56, '#4ECDC4', 'active', '2025-12-30 10:46:36', '2025-12-31 07:03:39'),
(5, 'business', NULL, 0, 'bg-gree', 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:39'),
(6, 'startup', NULL, 0, 'bg-purp', 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:39'),
(7, 'brand', NULL, 0, 'bg-red-', 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:39'),
(8, 'keyword', NULL, 0, 'bg-pink', 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:39'),
(9, 'global', NULL, 0, 'bg-teal', 'active', '2025-12-30 15:59:26', '2025-12-31 07:03:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `status` enum('active','inactive','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `email_verified`, `role`, `status`, `created_at`, `updated_at`, `last_login`) VALUES
(3, 'Admin User', 'admin@example.com', '$2b$10$Gt71tFQZnu9wAxnjwS7QjeBisupr8q1gk6826r4ZQpd1z1stABFE2', 0, 'admin', 'active', '2025-12-30 11:42:57', '2025-12-31 07:02:55', NULL),
(18, 'Rana Usman', 'Test@test.com', '$2b$12$sEcnx4qpiMsus321ABjzS.2Dt/9F9DFcFMgTeMtE4jF.VY4U5mSGS', 0, 'user', 'active', '2025-12-30 14:08:34', '2026-01-04 15:15:40', '2026-01-04 15:15:40'),
(22, 'Guest User', 'guest@example.com', NULL, 0, '', 'active', '2026-01-04 11:51:10', '2026-01-04 11:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
CREATE TABLE IF NOT EXISTS `watchlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `domain_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_domain` (`user_id`,`domain_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_domain_id` (`domain_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `domains`
--
ALTER TABLE `domains`
  ADD CONSTRAINT `domains_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_domains_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD CONSTRAINT `enquiries_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_enquiries_domain` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_domain` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`domain_id`) REFERENCES `domains` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
