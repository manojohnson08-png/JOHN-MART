package com.johnmart.config;

import com.johnmart.model.*;
import com.johnmart.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistRepository wishlistRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(CategoryRepository categoryRepository, ProductRepository productRepository,
                           UserRepository userRepository, CartRepository cartRepository,
                           CartItemRepository cartItemRepository, WishlistRepository wishlistRepository,
                           OrderRepository orderRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.wishlistRepository = wishlistRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Users if not present
        User demoUser = null;
        if (userRepository.count() == 0) {
            demoUser = userRepository.save(new User("John Doe", "john@example.com", "9876543210", "password123", "USER"));
            userRepository.save(new User("Jane Smith", "jane@example.com", "9123456780", "password123", "USER"));
            userRepository.save(new User("Admin User", "admin@johnmart.com", "9998887776", "admin123", "ADMIN"));
        } else {
            demoUser = userRepository.findByEmail("john@example.com").orElse(null);
        }

        // 2. Seed Categories if not present
        Map<String, Category> catMap = new HashMap<>();
        if (categoryRepository.count() == 0) {
            catMap.put("Electronics", categoryRepository.save(new Category("Electronics", "Smartphones, Audio, Laptops, Wearables & Smart Home", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80")));
            catMap.put("Fashion", categoryRepository.save(new Category("Fashion", "Premium apparel, footwear, hoodies, t-shirts & streetwear", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80")));
            catMap.put("Home & Kitchen", categoryRepository.save(new Category("Home & Kitchen", "Modern appliances, cookware, smart lighting & home decor", "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80")));
            catMap.put("Beauty", categoryRepository.save(new Category("Beauty", "Skincare, perfumes, grooming essentials & personal care", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80")));
            catMap.put("Grocery", categoryRepository.save(new Category("Grocery", "Artisanal coffee, organic snacks, tea & superfoods", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80")));
            catMap.put("Sports", categoryRepository.save(new Category("Sports", "Fitness gear, yoga mats, resistance bands & training wear", "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80")));
            catMap.put("Accessories", categoryRepository.save(new Category("Accessories", "Backpacks, minimalist wallets, watches & tech organizers", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80")));
        } else {
            for (Category c : categoryRepository.findAll()) {
                catMap.put(c.getName(), c);
            }
        }

        // 3. Seed Products if not present
        if (productRepository.count() == 0 && !catMap.isEmpty()) {
            List<Product> products = Arrays.asList(
                    // Electronics
                    new Product("Sony WH-1000XM5 Wireless Headphones",
                            "Industry-leading noise canceling with two processors and 8 microphones. Hi-Res audio, crystal clear calls, and 30-hour battery life.",
                            BigDecimal.valueOf(349.99), BigDecimal.valueOf(399.99), 12, catMap.get("Electronics"),
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                            BigDecimal.valueOf(4.8), 1420, 25, true, true),

                    new Product("Apple Watch Ultra 2 Smartwatch",
                            "Rugged 49mm titanium case, ultra-bright always-on Retina display, dual-frequency precision GPS, and 36-hour battery life.",
                            BigDecimal.valueOf(799.00), BigDecimal.valueOf(849.00), 6, catMap.get("Electronics"),
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                            BigDecimal.valueOf(4.9), 890, 18, true, true),

                    new Product("JBL Charge 5 Portable Bluetooth Speaker",
                            "Bold JBL Original Pro Sound with long excursion driver, separate tweeter, and dual pumping bass radiators with 20h playtime.",
                            BigDecimal.valueOf(149.95), BigDecimal.valueOf(179.95), 17, catMap.get("Electronics"),
                            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
                            BigDecimal.valueOf(4.7), 650, 40, false, true),

                    new Product("Keychron Q1 Pro Custom Mechanical Keyboard",
                            "Custom 75% layout mechanical keyboard with CNC aluminum chassis, hot-swappable switches, and RGB backlighting.",
                            BigDecimal.valueOf(199.00), BigDecimal.valueOf(229.00), 13, catMap.get("Electronics"),
                            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
                            BigDecimal.valueOf(4.9), 340, 15, true, false),

                    new Product("Logitech MX Master 3S Wireless Mouse",
                            "Quiet clicks and 8K DPI any-surface tracking. Ergonomic silhouette, ultra-fast MagSpeed scrolling, and multi-device flow.",
                            BigDecimal.valueOf(99.99), BigDecimal.valueOf(119.99), 17, catMap.get("Electronics"),
                            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
                            BigDecimal.valueOf(4.8), 1120, 50, false, true),

                    new Product("Anker 737 Power Bank (140W 24K)",
                            "Ultra-powerful two-way fast charging with smart digital display. 24,000mAh capacity to power laptops and phones on the move.",
                            BigDecimal.valueOf(129.99), BigDecimal.valueOf(149.99), 13, catMap.get("Electronics"),
                            "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
                            BigDecimal.valueOf(4.7), 480, 35, false, false),

                    // Fashion
                    new Product("Nike Air Zoom Pegasus 40 Running Shoes",
                            "Responsive Nike React foam cushioning and engineered mesh upper for lightweight breathability and springy comfort.",
                            BigDecimal.valueOf(129.99), BigDecimal.valueOf(140.00), 7, catMap.get("Fashion"),
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                            BigDecimal.valueOf(4.7), 910, 30, true, true),

                    new Product("Heavyweight Oversized Cotton T-Shirt",
                            "Crafted from 100% combed ring-spun 240 GSM organic cotton. Relaxed boxy fit, ribbed collar, and durable double-needle stitching.",
                            BigDecimal.valueOf(34.50), BigDecimal.valueOf(45.00), 23, catMap.get("Fashion"),
                            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
                            BigDecimal.valueOf(4.6), 530, 85, false, true),

                    new Product("Urban French Terry Pullover Hoodie",
                            "Premium 450 GSM French terry cotton with plush brushed interior, kangaroo pocket, double-layered hood, and ribbed cuffs.",
                            BigDecimal.valueOf(68.00), BigDecimal.valueOf(85.00), 20, catMap.get("Fashion"),
                            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
                            BigDecimal.valueOf(4.8), 380, 45, true, false),

                    new Product("Slim Fit Stretch Denim Trucker Jacket",
                            "Classic trucker jacket silhouette cut from premium 12oz comfort-stretch denim. Brass hardware and chest pockets.",
                            BigDecimal.valueOf(89.90), BigDecimal.valueOf(115.00), 22, catMap.get("Fashion"),
                            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
                            BigDecimal.valueOf(4.5), 290, 28, false, false),

                    // Home & Kitchen
                    new Product("Breville Barista Touch Espresso Machine",
                            "Automated touchscreen simplicity with pre-programmed cafe drinks menu and 3-second ThermoJet heating system.",
                            BigDecimal.valueOf(899.95), BigDecimal.valueOf(999.95), 10, catMap.get("Home & Kitchen"),
                            "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
                            BigDecimal.valueOf(4.9), 780, 12, true, true),

                    new Product("Ninja Air Fryer Pro 4-in-1 DualZone",
                            "6-quart air fryer with wide temperature range (105°F–400°F). Uses up to 75% less oil than traditional frying methods.",
                            BigDecimal.valueOf(119.99), BigDecimal.valueOf(149.99), 20, catMap.get("Home & Kitchen"),
                            "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
                            BigDecimal.valueOf(4.7), 850, 40, false, true),

                    new Product("Philips Hue Smart LED Starter Kit",
                            "Transform your ambient home lighting with 16 million colors and tunable whites. Control via smartphone app or voice.",
                            BigDecimal.valueOf(159.00), BigDecimal.valueOf(199.99), 20, catMap.get("Home & Kitchen"),
                            "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=800&q=80",
                            BigDecimal.valueOf(4.6), 420, 30, false, false),

                    new Product("Enamelled Cast Iron Dutch Oven (6-Qt)",
                            "Superior heat distribution and retention for slow cooking, braising, baking bread, and simmering rich stews.",
                            BigDecimal.valueOf(79.99), BigDecimal.valueOf(99.99), 20, catMap.get("Home & Kitchen"),
                            "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
                            BigDecimal.valueOf(4.8), 310, 22, false, false),

                    // Beauty
                    new Product("CeraVe Hydrating Facial Cleanser (16 oz)",
                            "Formulated with three essential ceramides and hyaluronic acid to cleanse, hydrate, and preserve the skin barrier.",
                            BigDecimal.valueOf(18.99), BigDecimal.valueOf(22.99), 17, catMap.get("Beauty"),
                            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
                            BigDecimal.valueOf(4.9), 3200, 120, true, true),

                    new Product("Dior Sauvage Eau de Parfum (100ml)",
                            "A powerfully fresh signature with woody notes, Calabrian bergamot, and warm, sensual Papua New Guinean vanilla.",
                            BigDecimal.valueOf(145.00), BigDecimal.valueOf(160.00), 9, catMap.get("Beauty"),
                            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
                            BigDecimal.valueOf(4.8), 1890, 35, true, true),

                    new Product("The Ordinary Niacinamide 10% + Zinc 1%",
                            "High-strength vitamin and mineral blemish formula to reduce visible sebum activity and balance uneven texture.",
                            BigDecimal.valueOf(10.80), BigDecimal.valueOf(12.00), 10, catMap.get("Beauty"),
                            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
                            BigDecimal.valueOf(4.7), 2450, 90, false, false),

                    // Grocery
                    new Product("Blue Bottle Organic Whole Bean Coffee",
                            "Specialty dark roast blend with tasting notes of dark chocolate, brown sugar, and toasted marshmallow.",
                            BigDecimal.valueOf(24.00), BigDecimal.valueOf(28.00), 14, catMap.get("Grocery"),
                            "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
                            BigDecimal.valueOf(4.8), 620, 60, false, true),

                    new Product("Ceremonial Grade Matcha Green Tea (100g)",
                            "First harvest stone-ground Japanese Uji matcha rich in L-theanine and antioxidants with smooth umami notes.",
                            BigDecimal.valueOf(32.50), BigDecimal.valueOf(39.00), 17, catMap.get("Grocery"),
                            "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
                            BigDecimal.valueOf(4.9), 410, 45, true, false),

                    // Sports
                    new Product("Manduka PRO Yoga & Pilates Mat (6mm)",
                            "Ultra-dense cushioning for joint protection and unmatched grip on any floor surface. Guaranteed for life.",
                            BigDecimal.valueOf(128.00), BigDecimal.valueOf(140.00), 9, catMap.get("Sports"),
                            "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
                            BigDecimal.valueOf(4.8), 560, 30, false, true),

                    new Product("Hydro Flask 32 oz Insulated Water Bottle",
                            "TempShield double-wall vacuum insulation keeps drinks ice cold up to 24 hours. BPA-free stainless steel.",
                            BigDecimal.valueOf(44.95), BigDecimal.valueOf(49.95), 10, catMap.get("Sports"),
                            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
                            BigDecimal.valueOf(4.9), 1780, 75, true, true),

                    new Product("Heavy-Duty Resistance Band Set (5 Levels)",
                            "Natural latex resistance tubes with padded handles, ankle straps, and door anchor for home fitness.",
                            BigDecimal.valueOf(29.99), BigDecimal.valueOf(39.99), 25, catMap.get("Sports"),
                            "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80",
                            BigDecimal.valueOf(4.6), 680, 55, false, false),

                    // Accessories
                    new Product("Nomatic Expandable Travel Backpack (20L-30L)",
                            "Water-resistant minimalist backpack engineered for daily tech carry and weekend travel with RFID protection.",
                            BigDecimal.valueOf(259.99), BigDecimal.valueOf(289.99), 10, catMap.get("Accessories"),
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
                            BigDecimal.valueOf(4.8), 830, 20, true, true),

                    new Product("Ridge Minimalist Slim RFID Metal Wallet",
                            "Holds 1-12 cards without stretching out. Integrated cash strap and aircraft-grade aluminum casing.",
                            BigDecimal.valueOf(85.00), BigDecimal.valueOf(95.00), 11, catMap.get("Accessories"),
                            "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
                            BigDecimal.valueOf(4.7), 1340, 65, false, true)
            );

            List<Product> savedProducts = productRepository.saveAll(products);

            // Seed demo cart, wishlist, and orders for John Doe
            if (demoUser != null) {
                final User userForDemo = demoUser;
                Cart cart = cartRepository.findByUserId(userForDemo.getId()).orElseGet(() -> cartRepository.save(new Cart(userForDemo)));
                if (cart.getItems().isEmpty() && savedProducts.size() > 7) {
                    CartItem i1 = new CartItem(cart, savedProducts.get(0), 1, savedProducts.get(0).getPrice());
                    CartItem i2 = new CartItem(cart, savedProducts.get(7), 2, savedProducts.get(7).getPrice());
                    cartItemRepository.save(i1);
                    cartItemRepository.save(i2);
                }

                if (wishlistRepository.findByUserIdOrderByCreatedAtDesc(userForDemo.getId()).isEmpty() && savedProducts.size() > 6) {
                    wishlistRepository.save(new Wishlist(userForDemo, savedProducts.get(1)));
                    wishlistRepository.save(new Wishlist(userForDemo, savedProducts.get(6)));
                }

                if (orderRepository.findByUserIdOrderByCreatedAtDesc(userForDemo.getId()).isEmpty() && savedProducts.size() > 2) {
                    Order order = new Order(userForDemo, BigDecimal.valueOf(194.90), "UPI", "John Doe",
                            "john@example.com", "9876543210", "42 Tech Avenue, Silicon Hills",
                            "Bangalore", "Karnataka", "560001", "DELIVERED");
                    order.addItem(new OrderItem(order, savedProducts.get(2), 1, savedProducts.get(2).getPrice()));
                    order.addItem(new OrderItem(order, savedProducts.get(20), 1, savedProducts.get(20).getPrice()));
                    orderRepository.save(order);
                }
            }
        }
    }
}
