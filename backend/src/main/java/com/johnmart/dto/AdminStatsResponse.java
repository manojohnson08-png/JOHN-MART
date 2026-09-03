package com.johnmart.dto;

import com.johnmart.model.Order;
import java.math.BigDecimal;
import java.util.List;

public class AdminStatsResponse {
    private long totalProducts;
    private long totalUsers;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private List<Order> recentOrders;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalProducts, long totalUsers, long totalOrders, BigDecimal totalRevenue, List<Order> recentOrders) {
        this.totalProducts = totalProducts;
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.recentOrders = recentOrders;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<Order> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<Order> recentOrders) {
        this.recentOrders = recentOrders;
    }
}
