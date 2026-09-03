package com.johnmart.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer discount = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 500)
    private String image;

    @Column(precision = 3, scale = 1)
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(nullable = false)
    private Integer stock = 10;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_trending")
    private Boolean isTrending = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Product() {
    }

    public Product(String name, String description, BigDecimal price, BigDecimal originalPrice, Integer discount,
                   Category category, String image, BigDecimal rating, Integer reviewCount, Integer stock,
                   Boolean isFeatured, Boolean isTrending) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.originalPrice = originalPrice;
        this.discount = discount != null ? discount : 0;
        this.category = category;
        this.image = image;
        this.rating = rating != null ? rating : BigDecimal.valueOf(4.5);
        this.reviewCount = reviewCount != null ? reviewCount : 0;
        this.stock = stock != null ? stock : 10;
        this.isFeatured = isFeatured != null ? isFeatured : false;
        this.isTrending = isTrending != null ? isTrending : false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.rating == null) this.rating = BigDecimal.valueOf(4.5);
        if (this.reviewCount == null) this.reviewCount = 0;
        if (this.discount == null) this.discount = 0;
        if (this.stock == null) this.stock = 10;
        if (this.isFeatured == null) this.isFeatured = false;
        if (this.isTrending == null) this.isTrending = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public Boolean getIsTrending() {
        return isTrending;
    }

    public void setIsTrending(Boolean isTrending) {
        this.isTrending = isTrending;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
