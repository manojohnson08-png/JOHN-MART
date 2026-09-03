package com.johnmart.service;

import com.johnmart.dto.CartRequest;
import com.johnmart.dto.CartResponse;
import com.johnmart.model.Cart;
import com.johnmart.model.CartItem;
import com.johnmart.model.Product;
import com.johnmart.model.User;
import com.johnmart.repository.CartItemRepository;
import com.johnmart.repository.CartRepository;
import com.johnmart.repository.ProductRepository;
import com.johnmart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    public CartResponse getCartResponse(Long userId) {
        Cart cart = getOrCreateCart(userId);
        CartResponse response = new CartResponse();
        response.setCartId(cart.getId());
        response.setUserId(userId);

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalSavings = BigDecimal.ZERO;
        int totalItemsCount = 0;

        for (CartItem item : cart.getItems()) {
            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
            totalItemsCount += item.getQuantity();

            if (item.getProduct().getOriginalPrice() != null &&
                item.getProduct().getOriginalPrice().compareTo(item.getPrice()) > 0) {
                BigDecimal savingPerUnit = item.getProduct().getOriginalPrice().subtract(item.getPrice());
                totalSavings = totalSavings.add(savingPerUnit.multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            CartResponse.CartItemDto itemDto = new CartResponse.CartItemDto(
                    item.getId(),
                    item.getProduct(),
                    item.getQuantity(),
                    item.getPrice(),
                    itemTotal
            );
            response.getItems().add(itemDto);
        }

        response.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        response.setDiscount(totalSavings.setScale(2, RoundingMode.HALF_UP));
        response.setTotalItemCount(totalItemsCount);

        // Free delivery over $50 / ₹500, else $9.99 flat
        BigDecimal delivery = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(BigDecimal.valueOf(50.00)) < 0) {
            delivery = BigDecimal.valueOf(9.99);
        }
        response.setDeliveryCharge(delivery.setScale(2, RoundingMode.HALF_UP));
        response.setGrandTotal(subtotal.add(delivery).setScale(2, RoundingMode.HALF_UP));

        return response;
    }

    public CartResponse addToCart(CartRequest request) {
        Cart cart = getOrCreateCart(request.getUserId());
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + request.getProductId()));

        int qtyToAdd = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + qtyToAdd);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(cart, product, qtyToAdd, product.getPrice());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return getCartResponse(request.getUserId());
    }

    public CartResponse updateCartItemQuantity(Long cartItemId, Integer newQuantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with ID: " + cartItemId));

        Long userId = cartItem.getCart().getUser().getId();

        if (newQuantity == null || newQuantity <= 0) {
            Cart cart = cartItem.getCart();
            cart.getItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        }

        return getCartResponse(userId);
    }

    public CartResponse removeCartItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found with ID: " + cartItemId));

        Long userId = cartItem.getCart().getUser().getId();
        Cart cart = cartItem.getCart();
        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        return getCartResponse(userId);
    }

    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
    }
}
