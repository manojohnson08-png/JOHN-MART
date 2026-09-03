package com.johnmart.dto;

public class CartItemUpdateRequest {
    private Integer quantity;

    public CartItemUpdateRequest() {
    }

    public CartItemUpdateRequest(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
