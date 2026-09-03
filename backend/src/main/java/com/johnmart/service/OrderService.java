package com.johnmart.service;

import com.johnmart.dto.OrderRequest;
import com.johnmart.model.*;
import com.johnmart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        UserRepository userRepository, ProductRepository productRepository,
                        CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public Order createOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + request.getUserId()));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash on Delivery");
        order.setShippingName(request.getShippingName());
        order.setShippingEmail(request.getShippingEmail());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingPincode(request.getShippingPincode());
        order.setStatus("PLACED");

        BigDecimal totalAmount = BigDecimal.ZERO;

        // If items are supplied in request
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemDto.getProductId()));

                BigDecimal itemPrice = itemDto.getPrice() != null ? itemDto.getPrice() : product.getPrice();
                int qty = (itemDto.getQuantity() != null && itemDto.getQuantity() > 0) ? itemDto.getQuantity() : 1;

                OrderItem orderItem = new OrderItem(order, product, qty, itemPrice);
                order.addItem(orderItem);
                totalAmount = totalAmount.add(itemPrice.multiply(BigDecimal.valueOf(qty)));

                // Reduce stock
                if (product.getStock() >= qty) {
                    product.setStock(product.getStock() - qty);
                }
                productRepository.save(product);
            }
        } else {
            // Take items from user's active cart
            Optional<Cart> cartOpt = cartRepository.findByUserId(user.getId());
            if (cartOpt.isEmpty() || cartOpt.get().getItems().isEmpty()) {
                throw new IllegalStateException("Cart is empty. Cannot place order.");
            }

            Cart cart = cartOpt.get();
            for (CartItem cartItem : cart.getItems()) {
                Product product = cartItem.getProduct();
                OrderItem orderItem = new OrderItem(order, product, cartItem.getQuantity(), cartItem.getPrice());
                order.addItem(orderItem);
                totalAmount = totalAmount.add(cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

                // Reduce stock
                if (product.getStock() >= cartItem.getQuantity()) {
                    product.setStock(product.getStock() - cartItem.getQuantity());
                }
                productRepository.save(product);
            }

            // Clear cart items
            cart.getItems().clear();
            cartItemRepository.deleteByCartId(cart.getId());
        }

        // Add standard delivery if total < 50
        if (totalAmount.compareTo(BigDecimal.valueOf(50.00)) < 0) {
            totalAmount = totalAmount.add(BigDecimal.valueOf(9.99));
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        order.setStatus(newStatus.toUpperCase());
        return orderRepository.save(order);
    }

    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        if (userId != null && !order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to cancel this order.");
        }

        if (!"PLACED".equalsIgnoreCase(order.getStatus()) && !"CONFIRMED".equalsIgnoreCase(order.getStatus())) {
            throw new IllegalStateException("Order cannot be cancelled in its current state (" + order.getStatus() + ").");
        }

        order.setStatus("CANCELLED");

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Order not found with ID: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }
}
