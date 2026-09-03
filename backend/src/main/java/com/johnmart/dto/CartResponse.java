package com.johnmart.dto;

import com.johnmart.model.Product;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private Long cartId;
    private Long userId;
    private List<CartItemDto> items = new ArrayList<>();
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal deliveryCharge = BigDecimal.ZERO;
    private BigDecimal grandTotal = BigDecimal.ZERO;
    private int totalItemCount = 0;

    public CartResponse() {
    }

    public static class CartItemDto {
        private Long id;
        private Product product;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal itemTotal;

        public CartItemDto() {
        }

        public CartItemDto(Long id, Product product, Integer quantity, BigDecimal price, BigDecimal itemTotal) {
            this.id = id;
            this.product = product;
            this.quantity = quantity;
            this.price = price;
            this.itemTotal = itemTotal;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Product getProduct() {
            return product;
        }

        public void setProduct(Product product) {
            this.product = product;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public BigDecimal getItemTotal() {
            return itemTotal;
        }

        public void setItemTotal(BigDecimal itemTotal) {
            this.itemTotal = itemTotal;
        }
    }

    // Getters and Setters
    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getDeliveryCharge() {
        return deliveryCharge;
    }

    public void setDeliveryCharge(BigDecimal deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public int getTotalItemCount() {
        return totalItemCount;
    }

    public void setTotalItemCount(int totalItemCount) {
        this.totalItemCount = totalItemCount;
    }
}
