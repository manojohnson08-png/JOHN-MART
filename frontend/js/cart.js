/**
 * JOHN MART - Cart Page Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.getUser();
  if (!user) {
    showEmptyCartState("Please sign in to view your shopping cart.");
    return;
  }

  loadUserCart();
});

async function loadUserCart() {
  const user = Auth.getUser();
  if (!user) return;

  const tableBody = document.getElementById("cart-items-body");
  const summaryContainer = document.getElementById("cart-summary-container");
  const cartContent = document.getElementById("cart-content-wrapper");
  const emptyState = document.getElementById("cart-empty-state");

  try {
    const res = await API.getCart(user.id);
    const cart = res.data;

    if (!cart || !cart.items || cart.items.length === 0) {
      if (cartContent) cartContent.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      syncHeaderCounters();
      return;
    }

    if (cartContent) cartContent.style.display = "grid";
    if (emptyState) emptyState.style.display = "none";

    // Render cart items
    if (tableBody) {
      tableBody.innerHTML = cart.items.map(item => `
        <tr class="cart-item-row" id="cart-item-${item.id}">
          <td class="cart-product-cell">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img src="${item.product.image}" alt="${item.product.name}" class="cart-product-img">
              <div>
                <a href="product-details.html?id=${item.product.id}" class="cart-product-title">${item.product.name}</a>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                  ${item.product.category ? item.product.category.name : ''}
                </div>
              </div>
            </div>
          </td>
          <td class="cart-price-cell">${formatPrice(item.price)}</td>
          <td class="cart-qty-cell">
            <div class="qty-counter-cart">
              <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
          </td>
          <td class="cart-total-cell" style="font-weight: 700; color: var(--secondary);">
            ${formatPrice(item.itemTotal)}
          </td>
          <td class="cart-action-cell">
            <button class="cart-remove-btn" title="Remove item" onclick="removeCartItem(${item.id})">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Render Order Summary
    updateSummaryView(cart);
    syncHeaderCounters();
  } catch (error) {
    showToast(error.message || "Failed to load cart", "error");
  }
}

function updateSummaryView(cart) {
  document.getElementById("summary-subtotal").textContent = formatPrice(cart.subtotal);
  
  const discountRow = document.getElementById("summary-discount-row");
  const discountEl = document.getElementById("summary-discount");
  if (discountRow && discountEl) {
    if (cart.discount && cart.discount > 0) {
      discountEl.textContent = `-${formatPrice(cart.discount)}`;
      discountRow.style.display = "flex";
    } else {
      discountRow.style.display = "none";
    }
  }

  const deliveryEl = document.getElementById("summary-delivery");
  if (deliveryEl) {
    deliveryEl.textContent = cart.deliveryCharge === 0 || cart.deliveryCharge === "0.00" || cart.deliveryCharge === 0.0 ? "FREE" : formatPrice(cart.deliveryCharge);
    if (deliveryEl.textContent === "FREE") {
      deliveryEl.style.color = "var(--success)";
      deliveryEl.style.fontWeight = "700";
    } else {
      deliveryEl.style.color = "var(--text-primary)";
    }
  }

  document.getElementById("summary-grand-total").textContent = formatPrice(cart.grandTotal);
}

async function updateItemQuantity(cartItemId, newQty) {
  try {
    const res = await API.updateCartItem(cartItemId, newQty);
    if (res.data) {
      loadUserCart();
    }
  } catch (error) {
    showToast(error.message || "Could not update quantity", "error");
  }
}

async function removeCartItem(cartItemId) {
  try {
    const res = await API.removeCartItem(cartItemId);
    showToast("Item removed from cart", "info");
    loadUserCart();
  } catch (error) {
    showToast(error.message || "Could not remove item", "error");
  }
}

function showEmptyCartState(message) {
  const cartContent = document.getElementById("cart-content-wrapper");
  const emptyState = document.getElementById("cart-empty-state");
  if (cartContent) cartContent.style.display = "none";
  if (emptyState) {
    emptyState.style.display = "block";
    if (message) {
      const p = emptyState.querySelector("p");
      if (p) p.textContent = message;
    }
  }
}
