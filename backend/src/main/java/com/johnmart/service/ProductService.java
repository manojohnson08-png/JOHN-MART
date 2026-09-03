package com.johnmart.service;

import com.johnmart.model.Category;
import com.johnmart.model.Product;
import com.johnmart.repository.CategoryRepository;
import com.johnmart.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Product> getProducts(String search, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        if (sortBy != null && !sortBy.isBlank()) {
            switch (sortBy.toLowerCase()) {
                case "price_asc":
                case "price-low":
                case "price_low_high":
                    sort = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "price_desc":
                case "price-high":
                case "price_high_low":
                    sort = Sort.by(Sort.Direction.DESC, "price");
                    break;
                case "rating":
                case "rating_desc":
                    sort = Sort.by(Sort.Direction.DESC, "rating");
                    break;
                case "newest":
                default:
                    sort = Sort.by(Sort.Direction.DESC, "createdAt");
                    break;
            }
        }

        if (search != null && search.trim().isEmpty()) {
            search = null;
        }

        return productRepository.searchAndFilter(search, categoryId, minPrice, maxPrice, sort);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue();
    }

    public List<Product> getTrendingProducts() {
        return productRepository.findByIsTrendingTrue();
    }

    public Product saveProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + product.getCategory().getId()));
            product.setCategory(category);
        }

        // Calculate discount if originalPrice > price
        if (product.getOriginalPrice() != null && product.getPrice() != null && product.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {
            if (product.getOriginalPrice().compareTo(product.getPrice()) > 0) {
                BigDecimal diff = product.getOriginalPrice().subtract(product.getPrice());
                BigDecimal pct = diff.divide(product.getOriginalPrice(), 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
                product.setDiscount(pct.intValue());
            } else {
                product.setDiscount(0);
            }
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));

        existing.setName(productDetails.getName());
        existing.setDescription(productDetails.getDescription());
        existing.setPrice(productDetails.getPrice());
        existing.setOriginalPrice(productDetails.getOriginalPrice());
        existing.setImage(productDetails.getImage());
        existing.setStock(productDetails.getStock());
        if (productDetails.getRating() != null) {
            existing.setRating(productDetails.getRating());
        }
        if (productDetails.getReviewCount() != null) {
            existing.setReviewCount(productDetails.getReviewCount());
        }
        if (productDetails.getIsFeatured() != null) {
            existing.setIsFeatured(productDetails.getIsFeatured());
        }
        if (productDetails.getIsTrending() != null) {
            existing.setIsTrending(productDetails.getIsTrending());
        }

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + productDetails.getCategory().getId()));
            existing.setCategory(category);
        }

        // Calculate discount
        if (existing.getOriginalPrice() != null && existing.getPrice() != null && existing.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {
            if (existing.getOriginalPrice().compareTo(existing.getPrice()) > 0) {
                BigDecimal diff = existing.getOriginalPrice().subtract(existing.getPrice());
                BigDecimal pct = diff.divide(existing.getOriginalPrice(), 4, java.math.RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
                existing.setDiscount(pct.intValue());
            } else {
                existing.setDiscount(0);
            }
        }

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }
}
