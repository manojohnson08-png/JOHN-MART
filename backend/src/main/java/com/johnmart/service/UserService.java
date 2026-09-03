package com.johnmart.service;

import com.johnmart.dto.LoginRequest;
import com.johnmart.dto.RegisterRequest;
import com.johnmart.model.Cart;
import com.johnmart.model.User;
import com.johnmart.repository.CartRepository;
import com.johnmart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    public UserService(UserRepository userRepository, CartRepository cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword(),
                "USER"
        );
        User savedUser = userRepository.save(user);

        // Automatically initialize an empty cart for the new user
        Cart cart = new Cart(savedUser);
        cartRepository.save(cart);

        return savedUser;
    }

    public User login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        // Ensure user has a cart
        User user = userOpt.get();
        if (cartRepository.findByUserId(user.getId()).isEmpty()) {
            Cart cart = new Cart(user);
            cartRepository.save(cart);
        }

        return user;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
