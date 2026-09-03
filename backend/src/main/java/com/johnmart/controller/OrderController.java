package com.johnmart.controller;

import com.johnmart.dto.ApiResponse;
import com.johnmart.dto.OrderRequest;
import com.johnmart.dto.OrderStatusUpdateRequest;
import com.johnmart.model.Order;
import com.johnmart.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@RequestBody OrderRequest request) {
        try {
            if (request.getUserId() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User ID is required."));
            }
            if (request.getShippingName() == null || request.getShippingAddress() == null || request.getShippingPhone() == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Complete shipping details are required."));
            }
            Order order = orderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Order Placed Successfully!", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Order placement failed: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByUser(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch orders: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(order -> ResponseEntity.ok(ApiResponse.success("Order found", order)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Order not found with ID: " + id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(ApiResponse.success("All orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch orders: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        try {
            if (request.getStatus() == null || request.getStatus().isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Status is required."));
            }
            Order order = orderService.updateOrderStatus(id, request.getStatus());
            return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update status: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId
    ) {
        try {
            Order order = orderService.cancelOrder(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to cancel order: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(ApiResponse.success("Order deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete order: " + e.getMessage()));
        }
    }
}
