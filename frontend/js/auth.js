/**
 * JOHN MART - User Authentication & Session State Management
 */

const AUTH_STORAGE_KEY = "johnmart_user";

const Auth = {
  // Get currently logged-in user object from localStorage
  getUser() {
    try {
      const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error("Error reading auth state", e);
      return null;
    }
  },

  // Check if a user is logged in
  isLoggedIn() {
    return this.getUser() !== null;
  },

  // Check if current user is admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === "ADMIN";
  },

  // Save user session
  setUser(user) {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    this.updateNavbarAuth();
  },

  // Log out user
  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast("Logged out successfully", "info");
    this.updateNavbarAuth();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  },

  // Synchronize UI in navbar according to login state
  updateNavbarAuth() {
    const user = this.getUser();
    const userArea = document.getElementById("user-nav-area");
    if (!userArea) return;

    if (user) {
      const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
      userArea.innerHTML = `
        <div class="user-menu-wrapper">
          <button class="user-btn" id="user-menu-btn" onclick="toggleUserDropdown(event)">
            <div class="user-avatar">${initial}</div>
            <span class="user-name-text">${user.name.split(' ')[0]}</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; margin-left: 2px;"></i>
          </button>
          <div class="user-dropdown" id="user-dropdown">
            <div style="padding: 0.5rem 0.9rem; border-bottom: 1px solid var(--border-color);">
              <div style="font-weight: 700; font-size: 0.92rem; color: var(--secondary);">${user.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${user.email}</div>
            </div>
            <a href="orders.html" class="dropdown-item"><i class="fa-solid fa-box"></i> My Orders</a>
            <a href="wishlist.html" class="dropdown-item"><i class="fa-solid fa-heart"></i> My Wishlist</a>
            <a href="cart.html" class="dropdown-item"><i class="fa-solid fa-cart-shopping"></i> My Cart</a>
            ${user.role === 'ADMIN' ? '<a href="admin.html" class="dropdown-item" style="color: var(--primary); font-weight: 600;"><i class="fa-solid fa-shield-halved"></i> Admin Portal</a>' : ''}
            <div class="dropdown-divider"></div>
            <a href="javascript:void(0)" onclick="Auth.logout()" class="dropdown-item" style="color: var(--danger);"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
          </div>
        </div>
      `;
    } else {
      userArea.innerHTML = `
        <a href="login.html" class="btn btn-outline btn-sm">
          <i class="fa-regular fa-user"></i> Sign In
        </a>
      `;
    }
  },

  // Guard protected routes
  requireLogin(redirectUrl = "login.html") {
    if (!this.isLoggedIn()) {
      showToast("Please sign in to proceed", "warning");
      setTimeout(() => {
        window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(window.location.href)}`;
      }, 800);
      return false;
    }
    return true;
  }
};

function toggleUserDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// Close dropdown on outside click
document.addEventListener("click", () => {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown && dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
  }
});
