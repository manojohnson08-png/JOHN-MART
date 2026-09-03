package com.johnmart.controller;

import com.johnmart.dto.ApiResponse;
import com.johnmart.dto.WishlistRequest;
import com.johnmart.model.Wishlist;
import com.johnmart.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Wishlist>>> getWishlist(@PathVariable Long userId) {
        try {
            List<Wishlist> items = wishlistService.getWishlistByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved successfully", items));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch wishlist: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Wishlist>> addToWishlist(@RequestBody WishlistRequest request) {
        try {
            if (request.getUserId() == null || request.getProductId() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User ID and Product ID are required."));
            }
            Wishlist item = wishlistService.addToWishlist(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Product added to wishlist", item));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to add to wishlist: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable Long wishlistId) {
        try {
            wishlistService.removeFromWishlist(wishlistId);
            return ResponseEntity.ok(ApiResponse.success("Item removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to remove item: " + e.getMessage()));
        }
    }

    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeByUserAndProduct(
            @PathVariable Long userId,
            @PathVariable Long productId
    ) {
        try {
            wishlistService.removeByUserAndProduct(userId, productId);
            return ResponseEntity.ok(ApiResponse.success("Product removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to remove from wishlist: " + e.getMessage()));
        }
    }
}
