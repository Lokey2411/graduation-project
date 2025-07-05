SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
  time_zone = "+00:00";

--
-- Database: `datn_db`
--
-- --------------------------------------------------------
--
-- Table structure for table `addresses`
--
CREATE TABLE
  `addresses` (
    `id` int (11) NOT NULL,
    `userId` int (11) NOT NULL,
    `address` text NOT NULL,
    `isPrimaryAddress` tinyint (1) NOT NULL,
    `isDelete` tinyint (1) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `categories`
--
CREATE TABLE
  `categories` (
    `id` int (11) NOT NULL,
    `name` varchar(200) NOT NULL,
    `description` text DEFAULT NULL,
    `image_url` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `isNewArrival` tinyint (1) DEFAULT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `chat_messages`
--
CREATE TABLE
  `chat_messages` (
    `id` int (11) NOT NULL,
    `question` text NOT NULL,
    `answer` text NOT NULL,
    `sessionId` varchar(36) DEFAULT NULL,
    `user_id` int (11) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `orders`
--
CREATE TABLE
  `orders` (
    `id` int (11) NOT NULL,
    `userId` int (11) NOT NULL,
    `orderDate` date NOT NULL,
    `price` varchar(200) NOT NULL,
    `STATUS` varchar(30) DEFAULT NULL,
    `address` text NOT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `permissions`
--
CREATE TABLE
  `permissions` (
    `id` int (11) NOT NULL,
    `NAME` varchar(255) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `products`
--
CREATE TABLE
  `products` (
    `id` int (11) NOT NULL,
    `name` varchar(200) NOT NULL,
    `description` text DEFAULT NULL,
    `price` varchar(50) DEFAULT NULL,
    `discount` varchar(20) DEFAULT NULL,
    `priceAfterDiscount` varchar(50) DEFAULT NULL,
    `category_id` int (11) NOT NULL,
    `isBestSale` tinyint (1) DEFAULT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `product_images`
--
CREATE TABLE
  `product_images` (
    `id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `imageUrl` text DEFAULT NULL,
    `isPrimaryImage` tinyint (1) NOT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `product_orders`
--
CREATE TABLE
  `product_orders` (
    `id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `order_id` int (11) NOT NULL,
    `variant_id` int (11) NOT NULL,
    `quantity` int (10) UNSIGNED NOT NULL,
    `STATUS` enum ('carting', 'favorite', 'checkout') DEFAULT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `related_products`
--
CREATE TABLE
  `related_products` (
    `id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `related_product_id` int (11) NOT NULL,
    `priority` int (11) DEFAULT -1,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `users`
--
CREATE TABLE
  `users` (
    `id` int (11) NOT NULL,
    `username` varchar(50) NOT NULL,
    `fullName` varchar(200) NOT NULL,
    `email` varchar(200) NOT NULL,
    `PASSWORD` varchar(200) NOT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `user_has_permissions`
--
CREATE TABLE
  `user_has_permissions` (
    `id` int (11) NOT NULL,
    `user_id` int (11) NOT NULL,
    `permission_id` int (11) NOT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `variants`
--
CREATE TABLE
  `variants` (
    `id` int (11) NOT NULL,
    `product_id` int (11) NOT NULL,
    `name` varchar(200) DEFAULT NULL,
    `price` decimal(10, 2) UNSIGNED NOT NULL,
    `variantType` varchar(200) DEFAULT NULL,
    `isDelete` tinyint (1) DEFAULT 0
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Indexes for dumped tables
--
--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses` ADD PRIMARY KEY (`id`),
ADD KEY `userId` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages` ADD PRIMARY KEY (`id`),
ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders` ADD PRIMARY KEY (`id`),
ADD KEY `userId` (`userId`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `NAME` (`NAME`);

--
-- Indexes for table `products`
--
ALTER TABLE `products` ADD PRIMARY KEY (`id`),
ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images` ADD PRIMARY KEY (`id`),
ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_orders`
--
ALTER TABLE `product_orders` ADD PRIMARY KEY (`id`),
ADD KEY `product_id` (`product_id`),
ADD KEY `order_id` (`order_id`),
ADD KEY `variant_id` (`variant_id`);

--
-- Indexes for table `related_products`
--
ALTER TABLE `related_products` ADD PRIMARY KEY (`id`),
ADD KEY `product_id` (`product_id`),
ADD KEY `related_product_id` (`related_product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `username` (`username`),
ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_has_permissions`
--
ALTER TABLE `user_has_permissions` ADD PRIMARY KEY (`id`),
ADD KEY `user_id` (`user_id`),
ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `variants`
--
ALTER TABLE `variants` ADD PRIMARY KEY (`id`),
ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_orders`
--
ALTER TABLE `product_orders` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `related_products`
--
ALTER TABLE `related_products` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_has_permissions`
--
ALTER TABLE `user_has_permissions` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `variants`
--
ALTER TABLE `variants` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--
--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `product_orders`
--
ALTER TABLE `product_orders` ADD CONSTRAINT `product_orders_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
ADD CONSTRAINT `product_orders_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
ADD CONSTRAINT `product_orders_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `variants` (`id`);

--
-- Constraints for table `related_products`
--
ALTER TABLE `related_products` ADD CONSTRAINT `related_products_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
ADD CONSTRAINT `related_products_ibfk_2` FOREIGN KEY (`related_product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `user_has_permissions`
--
ALTER TABLE `user_has_permissions` ADD CONSTRAINT `user_has_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
ADD CONSTRAINT `user_has_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`);

--
-- Constraints for table `variants`
--
ALTER TABLE `variants` ADD CONSTRAINT `variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

COMMIT;