/**
 * JOHN MART - Checkout Page Controller
 */

let userCartData = null;

document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.getUser();
  if (!user) {
    showToast("Please sign in to complete checkout", "warning");
    setTimeout(() => {
      window.location.href = "login.html?redirect=checkout.html";
    }, 800);
    return;
  }

  // Pre-fill user data into form
  prefillUserInfo(user);

  // Load cart summary
  loadCheckoutSummary(user.id);

  // Form submit handler
  initCheckoutForm();
});

function prefillUserInfo(user) {
  if (document.getElementById("shipping-name")) document.getElementById("shipping-name").value = user.name || "";
  if (document.getElementById("shipping-email")) document.getElementById("shipping-email").value = user.email || "";
  if (document.getElementById("shipping-phone")) document.getElementById("shipping-phone").value = user.phone || "";
}

async function loadCheckoutSummary(userId) {
  try {
    const res = await API.getCart(userId);
    userCartData = res.data;

    if (!userCartData || !userCartData.items || userCartData.items.length === 0) {
      showToast("Your cart is empty. Please add items before checking out.", "warning");
      setTimeout(() => window.location.href = "products.html", 1500);
      return;
    }

    // Render items preview
    const itemsPreview = document.getElementById("checkout-items-preview");
    if (itemsPreview) {
      itemsPreview.innerHTML = userCartData.items.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${item.product.image}" alt="${item.product.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
            <div>
              <div style="font-size: 0.88rem; font-weight: 600; color: var(--secondary); max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${item.product.name}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Qty: ${item.quantity} × ${formatPrice(item.price)}</div>
            </div>
          </div>
          <div style="font-weight: 700; font-size: 0.92rem; color: var(--secondary);">${formatPrice(item.itemTotal)}</div>
        </div>
      `).join('');
    }

    // Render numbers
    document.getElementById("checkout-subtotal").textContent = formatPrice(userCartData.subtotal);
    
    const deliveryEl = document.getElementById("checkout-delivery");
    if (deliveryEl) {
      deliveryEl.textContent = userCartData.deliveryCharge === 0 || userCartData.deliveryCharge === "0.00" || userCartData.deliveryCharge === 0.0 ? "FREE" : formatPrice(userCartData.deliveryCharge);
    }

    document.getElementById("checkout-grand-total").textContent = formatPrice(userCartData.grandTotal);
  } catch (error) {
    showToast("Error loading order summary: " + error.message, "error");
  }
}

function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = Auth.getUser();
    if (!user) return;

    const name = document.getElementById("shipping-name").value.trim();
    const email = document.getElementById("shipping-email").value.trim();
    const phone = document.getElementById("shipping-phone").value.trim();
    const address = document.getElementById("shipping-address").value.trim();
    const city = document.getElementById("shipping-city").value.trim();
    const state = document.getElementById("shipping-state").value.trim();
    const pincode = document.getElementById("shipping-pincode").value.trim();
    
    const paymentMethodEl = document.querySelector("input[name='paymentMethod']:checked");
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "Cash on Delivery";

    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      showToast("Please fill in all required shipping address fields.", "warning");
      return;
    }

    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `<span class="spinner"></span> Processing Order...`;
    }

    try {
      const orderPayload = {
        userId: user.id,
        shippingName: name,
        shippingEmail: email,
        shippingPhone: phone,
        shippingAddress: address,
        shippingCity: city,
        shippingState: state,
        shippingPincode: pincode,
        paymentMethod: paymentMethod
      };

      const res = await API.createOrder(orderPayload);
      const createdOrder = res.data;

      showOrderSuccessModal(createdOrder);
      syncHeaderCounters();
    } catch (error) {
      showToast(error.message || "Failed to place order. Please try again.", "error");
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order`;
      }
    }
  });
}

function showOrderSuccessModal(order) {
  const modal = document.getElementById("order-success-modal");
  if (!modal) {
    window.location.href = "orders.html";
    return;
  }

  document.getElementById("modal-order-id").textContent = `#JM-${order.id}`;
  document.getElementById("modal-order-total").textContent = formatPrice(order.totalAmount);
  document.getElementById("modal-payment-method").textContent = order.paymentMethod;

  modal.classList.add("show");
}
