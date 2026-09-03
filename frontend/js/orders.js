/**
 * JOHN MART - Orders History Page Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const user = Auth.getUser();
  if (!user) {
    showToast("Please sign in to view your orders", "warning");
    setTimeout(() => window.location.href = "login.html?redirect=orders.html", 800);
    return;
  }

  loadUserOrders(user.id);
});

async function loadUserOrders(userId) {
  const container = document.getElementById("orders-list-container");
  const emptyState = document.getElementById("orders-empty-state");
  if (!container) return;

  try {
    const res = await API.getUserOrders(userId);
    const orders = res.data || [];

    if (orders.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      container.innerHTML = "";
      return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = orders.map(order => renderOrderCard(order)).join('');
  } catch (error) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: var(--radius-md);">
        <p style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Error loading orders: ${error.message}</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="loadUserOrders(${userId})">Try Again</button>
      </div>
    `;
  }
}

function renderOrderCard(order) {
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recently';

  const canCancel = order.status === "PLACED" || order.status === "CONFIRMED";

  const itemsHtml = (order.items || []).map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <img src="${item.product ? item.product.image : ''}" alt="${item.product ? item.product.name : ''}" style="width: 52px; height: 52px; border-radius: var(--radius-sm); object-fit: cover; background: var(--bg-muted);">
        <div>
          <a href="product-details.html?id=${item.product ? item.product.id : '#'}" style="font-weight: 600; color: var(--secondary); font-size: 0.95rem;">
            ${item.product ? item.product.name : 'Product'}
          </a>
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">
            Qty: ${item.quantity} × ${formatPrice(item.price)}
          </div>
        </div>
      </div>
      <div style="font-weight: 700; color: var(--secondary); font-size: 0.95rem;">
        ${formatPrice(item.price * item.quantity)}
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-card" style="margin-bottom: 1.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
            <h3 style="font-size: 1.15rem; color: var(--secondary);">Order #JM-${order.id}</h3>
            <span class="badge badge-status ${order.status}">${order.status}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Placed on ${dateStr} • Payment: <strong>${order.paymentMethod}</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.82rem; color: var(--text-muted);">Total Amount</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--secondary); font-family: 'Outfit', sans-serif;">
            ${formatPrice(order.totalAmount)}
          </div>
        </div>
      </div>

      <div style="padding: 1rem 0;">
        ${itemsHtml}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem;">
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          <i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> Shipping to: 
          <strong>${order.shippingName}</strong>, ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}
        </div>
        <div>
          ${canCancel ? `
            <button class="btn btn-outline btn-sm" style="color: var(--danger); border-color: var(--danger);" onclick="cancelUserOrder(${order.id})">
              <i class="fa-solid fa-ban"></i> Cancel Order
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

async function cancelUserOrder(orderId) {
  const user = Auth.getUser();
  if (!user) return;

  if (!confirm(`Are you sure you want to cancel Order #JM-${orderId}?`)) {
    return;
  }

  try {
    const res = await API.cancelOrder(orderId, user.id);
    showToast("Order cancelled successfully", "info");
    loadUserOrders(user.id);
  } catch (error) {
    showToast(error.message || "Could not cancel order", "error");
  }
}
