/**
 * JOHN MART - Wishlist Page Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.getUser();
  if (!user) {
    showToast("Please sign in to view your wishlist", "warning");
    setTimeout(() => window.location.href = "login.html?redirect=wishlist.html", 800);
    return;
  }

  loadUserWishlist(user.id);
});

async function loadUserWishlist(userId) {
  const grid = document.getElementById("wishlist-grid");
  const emptyState = document.getElementById("wishlist-empty-state");
  if (!grid) return;

  try {
    const res = await API.getWishlist(userId);
    const wishlistItems = res.data || [];

    if (wishlistItems.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      grid.innerHTML = "";
      syncHeaderCounters();
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    grid.innerHTML = wishlistItems.map(item => {
      const product = item.product;
      const starsHtml = '★'.repeat(Math.round(product.rating || 4.5)) + '☆'.repeat(5 - Math.round(product.rating || 4.5));

      return `
        <div class="product-card" id="wishlist-item-${item.id}">
          <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}">
            <button class="wishlist-btn-card active" title="Remove from wishlist" onclick="deleteWishlistItem(${item.id})">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
          <div class="product-info">
            <span class="product-category">${product.category ? product.category.name : 'Category'}</span>
            <h4 class="product-title">${product.name}</h4>
            <div class="product-rating">
              <span>${starsHtml}</span>
              <span>(${product.reviewCount || 0})</span>
            </div>
            <div class="product-pricing">
              <span class="product-price">${formatPrice(product.price)}</span>
              ${product.originalPrice && product.originalPrice > product.price ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>` : ''}
            </div>
            <div class="product-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <button class="btn btn-primary btn-sm" onclick="moveToCart(${item.id}, ${product.id})">
                <i class="fa-solid fa-cart-shopping"></i> Move to Cart
              </button>
              <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);" onclick="deleteWishlistItem(${item.id})">
                <i class="fa-regular fa-trash-can"></i> Remove
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    syncHeaderCounters();
  } catch (error) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-md);">
        <p style="color: var(--danger);">Error loading wishlist: ${error.message}</p>
      </div>
    `;
  }
}

async function moveToCart(wishlistId, productId) {
  const user = Auth.getUser();
  if (!user) return;

  try {
    await API.addToCart(user.id, productId, 1);
    await API.removeFromWishlist(wishlistId);
    showToast("Moved to cart!", "success");
    loadUserWishlist(user.id);
    syncHeaderCounters();
  } catch (error) {
    showToast(error.message || "Failed to move item to cart", "error");
  }
}

async function deleteWishlistItem(wishlistId) {
  const user = Auth.getUser();
  if (!user) return;

  try {
    await API.removeFromWishlist(wishlistId);
    showToast("Removed from wishlist", "info");
    loadUserWishlist(user.id);
    syncHeaderCounters();
  } catch (error) {
    showToast(error.message || "Failed to remove item", "error");
  }
}
