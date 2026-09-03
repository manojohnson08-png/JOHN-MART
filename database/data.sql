-- ==========================================================
-- JOHN MART - Sample Seed Data
-- ==========================================================

USE `johnmart`;

-- Clear existing data (in correct dependency order)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `wishlist`;
TRUNCATE TABLE `cart_items`;
TRUNCATE TABLE `cart`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users (Simple password storage as specified)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`) VALUES
(1, 'John Doe', 'john@example.com', '9876543210', 'password123', 'USER'),
(2, 'Jane Smith', 'jane@example.com', '9123456780', 'password123', 'USER'),
(3, 'Admin User', 'admin@johnmart.com', '9998887776', 'admin123', 'ADMIN');

-- 2. Insert Categories
INSERT INTO `categories` (`id`, `name`, `description`, `image`) VALUES
(1, 'Electronics', 'Smartphones, Audio, Laptops, Wearables & Smart Home', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
(2, 'Fashion', 'Premium apparel, footwear, hoodies, t-shirts & streetwear', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'),
(3, 'Home & Kitchen', 'Modern appliances, cookware, smart lighting & home decor', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'),
(4, 'Beauty', 'Skincare, perfumes, grooming essentials & personal care', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'),
(5, 'Grocery', 'Artisanal coffee, organic snacks, tea & superfoods', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'),
(6, 'Sports', 'Fitness gear, yoga mats, resistance bands & training wear', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80'),
(7, 'Accessories', 'Backpacks, minimalist wallets, watches & tech organizers', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80');

-- 3. Insert 24 Realistic Products
INSERT INTO `products` (`id`, `name`, `description`, `price`, `original_price`, `discount`, `category_id`, `image`, `rating`, `review_count`, `stock`, `is_featured`, `is_trending`) VALUES
-- Electronics
(1, 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'Industry-leading noise canceling with two processors and 8 microphones. Exceptional sound quality with Hi-Res audio, crystal clear hands-free calling, and 30-hour battery life.', 349.99, 399.99, 12, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 4.8, 1420, 25, TRUE, TRUE),
(2, 'Apple Watch Ultra 2 Smartwatch', 'Rugged 49mm titanium case, ultra-bright always-on Retina display, dual-frequency GPS, and up to 36 hours of battery life. Built for endurance and outdoor exploration.', 799.00, 849.00, 6, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 4.9, 890, 18, TRUE, TRUE),
(3, 'JBL Charge 5 Portable Bluetooth Speaker', 'Bold JBL Original Pro Sound with long excursion driver, separate tweeter, and dual pumping JBL bass radiators. Up to 20 hours of playtime and built-in powerbank.', 149.95, 179.95, 17, 1, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', 4.7, 650, 40, FALSE, TRUE),
(4, 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard', 'Fully customizable 75% layout mechanical keyboard with CNC aluminum body, hot-swappable switches, RGB backlighting, and Bluetooth 5.1 multi-device connectivity.', 199.00, 229.00, 13, 1, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 4.9, 340, 15, TRUE, FALSE),
(5, 'Logitech MX Master 3S Wireless Performance Mouse', 'Quiet clicks and 8K DPI any-surface tracking. Ergonomic silhouette, ultra-fast MagSpeed scrolling, and customizable app-specific workflows.', 99.99, 119.99, 17, 1, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', 4.8, 1120, 50, FALSE, TRUE),
(6, 'Anker 737 Power Bank (PowerCore 24K 140W)', 'Ultra-powerful two-way fast charging with smart digital display. 24,000mAh capacity capable of charging laptops, phones, and tablets at top speed simultaneously.', 129.99, 149.99, 13, 1, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', 4.7, 480, 35, FALSE, FALSE),

-- Fashion
(7, 'Nike Air Zoom Pegasus 40 Running Shoes', 'A springy ride for every run, familiar and made just for you. Responsive Nike React foam cushioning and engineered mesh upper for lightweight breathability.', 129.99, 140.00, 7, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 4.7, 910, 30, TRUE, TRUE),
(8, 'Classic Heavyweight Oversized Cotton T-Shirt', 'Crafted from 100% combed ring-spun 240 GSM organic cotton. Relaxed boxy fit, ribbed collar, and durable double-needle stitching in vintage washed black.', 34.50, 45.00, 23, 2, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', 4.6, 530, 85, FALSE, TRUE),
(9, 'Urban Streetwear French Terry Pullover Hoodie', 'Premium 450 GSM French terry cotton with plush brushed interior, kangaroo pocket, double-layered hood, and ribbed side gussets for maximum comfort.', 68.00, 85.00, 20, 2, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', 4.8, 380, 45, TRUE, FALSE),
(10, 'Slim Fit Stretch Denim Jacket', 'Classic trucker jacket silhouette cut from premium 12oz comfort-stretch denim. Features brass hardware, adjustable waist tabs, and dual chest flap pockets.', 89.90, 115.00, 22, 2, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80', 4.5, 290, 28, FALSE, FALSE),

-- Home & Kitchen
(11, 'Breville Barista Touch Espresso Machine', 'Automated touchscreen simplicity with pre-programmed cafe drinks menu. ThermoJet heating system achieves optimum extraction temperature in 3 seconds.', 899.95, 999.95, 10, 3, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80', 4.9, 780, 12, TRUE, TRUE),
(12, 'Ninja Air Fryer Pro 4-in-1 DualZone', '6-quart air fryer with wide temperature range (105°F–400°F). Uses up to 75% less fat than traditional frying methods with dishwasher-safe basket.', 119.99, 149.99, 20, 3, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80', 4.7, 850, 40, FALSE, TRUE),
(13, 'Philips Hue Smart LED Color Ambience Starter Kit', 'Transform your home lighting with 16 million colors and tunable whites. Control via smartphone app, voice assistant, or smart schedules.', 159.00, 199.99, 20, 3, 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=800&q=80', 4.6, 420, 30, FALSE, FALSE),
(14, 'Cast Iron Dutch Oven 6-Quart Enamel Coated', 'Even heat distribution and heat retention for slow cooking, braising, baking sourdough bread, and simmering soups. Vibrant gloss enamel finish.', 79.99, 99.99, 20, 3, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80', 4.8, 310, 22, FALSE, FALSE),

-- Beauty
(15, 'CeraVe Hydrating Facial Cleanser (16 oz)', 'Formulated with three essential ceramides and hyaluronic acid to cleanse, hydrate, and restore the natural protective skin barrier.', 18.99, 22.99, 17, 4, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80', 4.9, 3200, 120, TRUE, TRUE),
(16, 'Dior Sauvage Eau de Parfum (100ml)', 'A powerfully fresh signature with woody and amber notes. Bergamot from Reggio di Calabria meets warm, sensual vanilla absolute.', 145.00, 160.00, 9, 4, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80', 4.8, 1890, 35, TRUE, TRUE),
(17, 'The Ordinary Niacinamide 10% + Zinc 1%', 'High-strength vitamin and mineral blemish formula to balance visible sebum activity and improve skin texture.', 10.80, 12.00, 10, 4, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', 4.7, 2450, 90, FALSE, FALSE),

-- Grocery
(18, 'Blue Bottle Organic Whole Bean Coffee (Blend Box)', 'Specialty roasted whole bean blend with balanced notes of dark chocolate, brown sugar, and toasted marshmallow. Sustainably sourced.', 24.00, 28.00, 14, 5, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80', 4.8, 620, 60, FALSE, TRUE),
(19, 'Artisanal Ceremonial Grade Matcha Green Tea (100g)', 'First harvest stone-ground Japanese green tea rich in L-theanine and antioxidants. Smooth umami taste with vibrant emerald green color.', 32.50, 39.00, 17, 5, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80', 4.9, 410, 45, TRUE, FALSE),

-- Sports
(20, 'Manduka PRO Yoga & Pilates Mat (6mm)', 'High-density cushion for joint protection and unparalleled grip. Guaranteed never to wear out or peel from practice.', 128.00, 140.00, 9, 6, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', 4.8, 560, 30, FALSE, TRUE),
(21, 'Hydro Flask 32 oz Wide Mouth Insulated Water Bottle', 'TempShield double-wall vacuum insulation keeps beverages ice cold for up to 24 hours or piping hot for up to 12 hours. BPA-free stainless steel.', 44.95, 49.95, 10, 6, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 4.9, 1780, 75, TRUE, TRUE),
(22, 'Heavy-Duty Resistance Band Set (5 Levels)', '100% natural latex resistance tubes with cushioned handles, ankle straps, and door anchor for home workout and physical therapy.', 29.99, 39.99, 25, 6, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80', 4.6, 680, 55, FALSE, FALSE),

-- Accessories
(23, 'Nomatic Travel Pack Minimalist Water-Resistant Backpack', '20L to 30L expandable backpack designed for daily use and weekend trips with magnetic water bottle pockets and RFID safe storage.', 259.99, 289.99, 10, 7, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 4.8, 830, 20, TRUE, TRUE),
(24, 'Ridge Minimalist Slim RFID-Blocking Metal Wallet', 'Holds 1-12 cards without stretching out. Integrated cash strap, aircraft-grade aluminum plates with scratch-resistant coating.', 85.00, 95.00, 11, 7, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', 4.7, 1340, 65, FALSE, TRUE);

-- 4. Insert Sample Cart and Items for Demo User (ID 1)
INSERT INTO `cart` (`id`, `user_id`) VALUES (1, 1);
INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 349.99),
(2, 1, 8, 2, 34.50);

-- 5. Insert Sample Wishlist for Demo User (ID 1)
INSERT INTO `wishlist` (`id`, `user_id`, `product_id`) VALUES
(1, 1, 2),
(2, 1, 7);

-- 6. Insert Sample Orders and Items
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `payment_method`, `shipping_name`, `shipping_email`, `shipping_phone`, `shipping_address`, `shipping_city`, `shipping_state`, `shipping_pincode`, `status`, `created_at`) VALUES
(1001, 1, 194.94, 'UPI', 'John Doe', 'john@example.com', '9876543210', '42 Tech Avenue, Silicon Hills', 'Bangalore', 'Karnataka', '560001', 'DELIVERED', NOW() - INTERVAL 5 DAY),
(1002, 1, 799.00, 'Credit Card', 'John Doe', 'john@example.com', '9876543210', '42 Tech Avenue, Silicon Hills', 'Bangalore', 'Karnataka', '560001', 'CONFIRMED', NOW() - INTERVAL 1 DAY);

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1001, 3, 1, 149.95),
(2, 1001, 21, 1, 44.95),
(3, 1002, 2, 1, 799.00);
