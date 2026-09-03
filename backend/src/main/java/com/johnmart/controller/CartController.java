package com.johnmart.controller;

import com.johnmart.dto.ApiResponse;
import com.johnmart.dto.CartItemUpdateRequest;
import com.johnmart.dto.CartRequest;
import com.johnmart.dto.CartResponse;
import com.johnmart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable Long userId) {
        try {
            CartResponse response = cartService.getCartResponse(userId);
            return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch cart: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@RequestBody CartRequest request) {
        try {
            if (request.getUserId() == null || request.getProductId() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User ID and Product ID are required."));
            }
            CartResponse response = cartService.addToCart(request);
            return ResponseEntity.ok(ApiResponse.success("Item added to cart successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to add to cart: " + e.getMessage()));
        }
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody CartItemUpdateRequest request
    ) {
        try {
            CartResponse response = cartService.updateCartItemQuantity(cartItemId, request.getQuantity());
            return ResponseEntity.ok(ApiResponse.success("Cart updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update cart: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(@PathVariable Long cartItemId) {
        try {
            CartResponse response = cartService.removeCartItem(cartItemId);
            return ResponseEntity.ok(ApiResponse.success("Item removed from cart", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to remove item: " + e.getMessage()));
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to clear cart: " + e.getMessage()));
        }
    }
}
