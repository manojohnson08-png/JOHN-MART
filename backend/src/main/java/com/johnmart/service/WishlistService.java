package com.johnmart.service;

import com.johnmart.dto.WishlistRequest;
import com.johnmart.model.Product;
import com.johnmart.model.User;
import com.johnmart.model.Wishlist;
import com.johnmart.repository.ProductRepository;
import com.johnmart.repository.UserRepository;
import com.johnmart.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<Wishlist> getWishlistByUser(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Wishlist addToWishlist(WishlistRequest request) {
        if (wishlistRepository.existsByUserIdAndProductId(request.getUserId(), request.getProductId())) {
            return wishlistRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId()).get();
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + request.getUserId()));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + request.getProductId()));

        Wishlist wishlist = new Wishlist(user, product);
        return wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(Long wishlistId) {
        wishlistRepository.deleteById(wishlistId);
    }

    public void removeByUserAndProduct(Long userId, Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
