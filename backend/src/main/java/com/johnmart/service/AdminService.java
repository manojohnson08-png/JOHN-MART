package com.johnmart.service;

import com.johnmart.dto.AdminStatsResponse;
import com.johnmart.model.Order;
import com.johnmart.repository.OrderRepository;
import com.johnmart.repository.ProductRepository;
import com.johnmart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminService(ProductRepository productRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public AdminStatsResponse getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        List<Order> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        if (recentOrders.size() > 5) {
            recentOrders = recentOrders.subList(0, 5);
        }

        return new AdminStatsResponse(
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue,
                recentOrders
        );
    }
}
