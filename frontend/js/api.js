/**
 * JOHN MART - API Service & Toast Notification Utility
 */

const API_BASE_URL = "http://localhost:8080/api";

const API = {
  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok || (data && data.success === false)) {
        const errorMsg = (data && data.message) || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // Auth & User Endpoints
  async register(userData) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  },

  async login(credentials) {
    return this.request("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
  },

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  },

  async getAllUsers() {
    return this.request("/users");
  },

  // Products Endpoints
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.categoryId) query.append("categoryId", params.categoryId);
    if (params.minPrice) query.append("minPrice", params.minPrice);
    if (params.maxPrice) query.append("maxPrice", params.maxPrice);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.featured) query.append("featured", "true");
    if (params.trending) query.append("trending", "true");

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return this.request(`/products${queryString}`);
  },

  async getProductById(id) {
    return this.request(`/products/${id}`);
  },

  async createProduct(productData) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE"
    });
  },

  // Categories Endpoints
  async getCategories() {
    return this.request("/categories");
  },

  async createCategory(categoryData) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData)
    });
  },

  // Cart Endpoints
  async getCart(userId) {
    return this.request(`/cart/${userId}`);
  },

  async addToCart(userId, productId, quantity = 1) {
    return this.request("/cart", {
      method: "POST",
      body: JSON.stringify({ userId, productId, quantity })
    });
  },

  async updateCartItem(cartItemId, quantity) {
    return this.request(`/cart/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity })
    });
  },

  async removeCartItem(cartItemId) {
    return this.request(`/cart/${cartItemId}`, {
      method: "DELETE"
    });
  },

  async clearCart(userId) {
    return this.request(`/cart/user/${userId}`, {
      method: "DELETE"
    });
  },

  // Wishlist Endpoints
  async getWishlist(userId) {
    return this.request(`/wishlist/${userId}`);
  },

  async addToWishlist(userId, productId) {
    return this.request("/wishlist", {
      method: "POST",
      body: JSON.stringify({ userId, productId })
    });
  },

  async removeFromWishlist(wishlistId) {
    return this.request(`/wishlist/${wishlistId}`, {
      method: "DELETE"
    });
  },

  async removeWishlistByUserAndProduct(userId, productId) {
    return this.request(`/wishlist/user/${userId}/product/${productId}`, {
      method: "DELETE"
    });
  },

  // Order Endpoints
  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData)
    });
  },

  async getUserOrders(userId) {
    return this.request(`/orders/user/${userId}`);
  },

  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  },

  async getAllOrders() {
    return this.request("/orders");
  },

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
  },

  async cancelOrder(orderId, userId) {
    return this.request(`/orders/${orderId}/cancel?userId=${userId}`, {
      method: "PUT"
    });
  },

  // Admin Stats
  async getAdminStats() {
    return this.request("/admin/stats");
  }
};

/**
 * Toast Notification System
 */
function showToast(message, type = "success", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconClass = type === "success" 
    ? "fa-solid fa-circle-check" 
    : type === "error" 
    ? "fa-solid fa-circle-exclamation" 
    : "fa-solid fa-circle-info";

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-message">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Global Currency Formatter
function formatPrice(amount) {
  if (amount == null) return "$0.00";
  return `$${Number(amount).toFixed(2)}`;
}
