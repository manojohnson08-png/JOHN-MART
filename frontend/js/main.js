/**
 * JOHN MART - Main UI Controller & Global Helpers
 */

document.addEventListener("DOMContentLoaded", () => {
  // Update Navbar Auth State
  Auth.updateNavbarAuth();

  // Load Navigation Categories
  loadNavCategories();

  // Sync Cart and Wishlist Counters
  syncHeaderCounters();

  // Initialize Global Search
  initSearch();

  // Initialize Mobile Toggle
  initMobileNav();
});

// Load category links in secondary header bar
async function loadNavCategories() {
  const container = document.getElementById("nav-category-list");
  if (!container) return;

  try {
    const res = await API.getCategories();
    if (res.data && res.data.length > 0) {
      let html = `<a href="products.html" class="category-nav-item ${!window.location.search.includes('categoryId') ? 'active' : ''}">All Products</a>`;
      res.data.forEach(cat => {
        const isActive = window.location.search.includes(`categoryId=${cat.id}`);
        html += `<a href="products.html?categoryId=${cat.id}" class="category-nav-item ${isActive ? 'active' : ''}">${cat.name}</a>`;
      });
      container.innerHTML = html;
    }
  } catch (e) {
    console.warn("Could not load categories for navbar", e);
  }
}

// Synchronize badge counts on Cart & Wishlist icons
async function syncHeaderCounters() {
  const user = Auth.getUser();
  const cartBadge = document.getElementById("cart-badge-count");
  const wishlistBadge = document.getElementById("wishlist-badge-count");

  if (!user) {
    if (cartBadge) cartBadge.textContent = "0";
    if (wishlistBadge) wishlistBadge.textContent = "0";
    return;
  }

  try {
    // Sync cart count
    const cartRes = await API.getCart(user.id);
    if (cartRes.data && cartBadge) {
      cartBadge.textContent = cartRes.data.totalItemCount || "0";
    }
  } catch (e) {
    // Silent fail if cart empty
  }

  try {
    // Sync wishlist count
    const wishRes = await API.getWishlist(user.id);
    if (wishRes.data && wishlistBadge) {
      wishlistBadge.textContent = wishRes.data.length || "0";
    }
  } catch (e) {
    // Silent fail
  }
}

// Global Search listener
function initSearch() {
  const form = document.getElementById("header-search-form");
  const input = document.getElementById("header-search-input");
  if (!form || !input) return;

  // Pre-fill input if on products page with search param
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("search")) {
    input.value = urlParams.get("search");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = `products.html`;
    }
  });
}

// Mobile Nav toggler
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-toggle-btn");
  const mobileNav = document.getElementById("mobile-nav-menu");
  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
  });
}

/**
 * Universal Add to Cart function (usable anywhere on any product card)
 */
async function handleAddToCart(productId, quantity = 1, event) {
  if (event) event.stopPropagation();

  const user = Auth.getUser();
  if (!user) {
    showToast("Please sign in to add items to your cart", "warning");
    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
    }, 800);
    return;
  }

  try {
    const res = await API.addToCart(user.id, productId, quantity);
    showToast("Product added to cart!", "success");
    syncHeaderCounters();
  } catch (error) {
    showToast(error.message || "Failed to add to cart", "error");
  }
}

/**
 * Universal Toggle Wishlist function
 */
async function handleToggleWishlist(productId, btnElement, event) {
  if (event) event.stopPropagation();

  const user = Auth.getUser();
  if (!user) {
    showToast("Please sign in to save items to your wishlist", "warning");
    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
    }, 800);
    return;
  }

  try {
    const res = await API.addToWishlist(user.id, productId);
    showToast("Added to wishlist!", "success");
    if (btnElement) {
      btnElement.classList.add("active");
      const icon = btnElement.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
    }
    syncHeaderCounters();
  } catch (error) {
    showToast(error.message || "Failed to update wishlist", "error");
  }
}

// Helper to render product card HTML
function renderProductCard(product) {
  const discountHtml = product.discount > 0 
    ? `<span class="badge badge-discount">${product.discount}% OFF</span>` 
    : '';
  const featuredHtml = product.isFeatured 
    ? `<span class="badge badge-featured">Featured</span>` 
    : '';

  const starsHtml = '★'.repeat(Math.round(product.rating || 4.5)) + '☆'.repeat(5 - Math.round(product.rating || 4.5));

  return `
    <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'">
        <div class="product-badges">
          ${discountHtml}
          ${featuredHtml}
        </div>
        <button class="wishlist-btn-card" title="Add to Wishlist" onclick="handleToggleWishlist(${product.id}, this, event)">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category ? product.category.name : 'Store'}</span>
        <h4 class="product-title" title="${product.name}">${product.name}</h4>
        <div class="product-rating">
          <span>${starsHtml}</span>
          <span>(${product.reviewCount || 0})</span>
        </div>
        <div class="product-pricing">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${product.originalPrice && product.originalPrice > product.price ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          ${product.discount > 0 ? `<span class="product-discount-label">Save ${product.discount}%</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm btn-block" onclick="handleAddToCart(${product.id}, 1, event)">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}
