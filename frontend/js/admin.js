/**
 * JOHN MART - Admin Dashboard Controller
 */

let allProductsList = [];
let allCategoriesList = [];
let editingProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  // Load initial stats and data
  loadDashboardData();
  loadCategoriesForSelect();

  // Setup tab navigation
  initAdminNavigation();

  // Setup product form submit listener
  initProductForm();
});

// Switch between Admin Sections
function initAdminNavigation() {
  document.querySelectorAll(".admin-nav-item[data-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      document.querySelectorAll(".admin-nav-item").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".admin-tab-content").forEach(panel => {
        panel.style.display = panel.id === targetId ? "block" : "none";
      });

      if (targetId === "tab-products") loadAdminProducts();
      if (targetId === "tab-orders") loadAdminOrders();
      if (targetId === "tab-users") loadAdminUsers();
      if (targetId === "tab-dashboard") loadDashboardData();
    });
  });
}

// 1. Load Dashboard Metrics
async function loadDashboardData() {
  try {
    const res = await API.getAdminStats();
    const stats = res.data;

    document.getElementById("stat-products-count").textContent = stats.totalProducts || "0";
    document.getElementById("stat-orders-count").textContent = stats.totalOrders || "0";
    document.getElementById("stat-users-count").textContent = stats.totalUsers || "0";
    document.getElementById("stat-revenue-value").textContent = formatPrice(stats.totalRevenue || 0);

    // Recent orders in dashboard table
    const recentTable = document.getElementById("admin-recent-orders-body");
    if (recentTable && stats.recentOrders) {
      recentTable.innerHTML = stats.recentOrders.map(order => `
        <tr>
          <td><strong>#JM-${order.id}</strong></td>
          <td>${order.shippingName}</td>
          <td>${formatPrice(order.totalAmount)}</td>
          <td>${order.paymentMethod}</td>
          <td><span class="badge badge-status ${order.status}">${order.status}</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error("Failed to load admin stats", error);
  }
}

// Load Categories for Add/Edit Product Modal Select
async function loadCategoriesForSelect() {
  try {
    const res = await API.getCategories();
    allCategoriesList = res.data || [];
    const select = document.getElementById("product-category-select");
    if (select) {
      select.innerHTML = `<option value="">Select Category</option>` + 
        allCategoriesList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
  } catch (e) {
    console.warn("Could not load categories for modal select", e);
  }
}

// 2. Load Products Management Table
async function loadAdminProducts() {
  const tableBody = document.getElementById("admin-products-table-body");
  if (!tableBody) return;

  try {
    const res = await API.getProducts();
    allProductsList = res.data || [];

    tableBody.innerHTML = allProductsList.map(p => `
      <tr>
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-img" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'">
        </td>
        <td>
          <div style="font-weight: 600; color: var(--secondary); max-width: 250px;">${p.name}</div>
        </td>
        <td>${p.category ? p.category.name : 'N/A'}</td>
        <td style="font-weight: 700;">${formatPrice(p.price)}</td>
        <td>${p.stock > 0 ? `<span style="color: var(--success); font-weight: 600;">${p.stock}</span>` : `<span style="color: var(--danger); font-weight: 600;">Out of Stock</span>`}</td>
        <td>
          ${p.isFeatured ? '<span class="badge badge-featured">Featured</span>' : ''}
          ${p.isTrending ? '<span class="badge badge-trending">Trending</span>' : ''}
        </td>
        <td>
          <div class="table-actions">
            <button class="table-btn edit" title="Edit Product" onclick="openEditProductModal(${p.id})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="table-btn delete" title="Delete Product" onclick="deleteProductItem(${p.id})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--danger);">Error loading products: ${error.message}</td></tr>`;
  }
}

// 3. Load Orders Management Table
async function loadAdminOrders() {
  const tableBody = document.getElementById("admin-orders-table-body");
  if (!tableBody) return;

  try {
    const res = await API.getAllOrders();
    const orders = res.data || [];

    tableBody.innerHTML = orders.map(order => `
      <tr>
        <td><strong>#JM-${order.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${order.shippingName}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${order.shippingEmail} • ${order.shippingPhone}</div>
        </td>
        <td style="font-weight: 700; color: var(--secondary);">${formatPrice(order.totalAmount)}</td>
        <td>${order.paymentMethod}</td>
        <td>
          <select class="status-select" onchange="changeOrderStatus(${order.id}, this.value)">
            <option value="PLACED" ${order.status === 'PLACED' ? 'selected' : ''}>PLACED</option>
            <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
            <option value="SHIPPED" ${order.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
            <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
            <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
          </select>
        </td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger);">Error loading orders: ${error.message}</td></tr>`;
  }
}

// 4. Load Users Management Table
async function loadAdminUsers() {
  const tableBody = document.getElementById("admin-users-table-body");
  if (!tableBody) return;

  try {
    const res = await API.getAllUsers();
    const users = res.data || [];

    tableBody.innerHTML = users.map(u => `
      <tr>
        <td>#${u.id}</td>
        <td style="font-weight: 600;">${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td><span class="badge ${u.role === 'ADMIN' ? 'badge-trending' : 'badge-discount'}">${u.role}</span></td>
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
      </tr>
    `).join('');
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger);">Error loading users: ${error.message}</td></tr>`;
  }
}

// Order Status Update
async function changeOrderStatus(orderId, newStatus) {
  try {
    await API.updateOrderStatus(orderId, newStatus);
    showToast(`Order #JM-${orderId} status updated to ${newStatus}`, "success");
    loadDashboardData();
  } catch (error) {
    showToast(error.message || "Failed to update order status", "error");
  }
}

// Delete Product
async function deleteProductItem(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await API.deleteProduct(productId);
    showToast("Product deleted successfully", "info");
    loadAdminProducts();
    loadDashboardData();
  } catch (error) {
    showToast(error.message || "Failed to delete product", "error");
  }
}

// Open Add Product Modal
function openAddProductModal() {
  editingProductId = null;
  document.getElementById("product-modal-title").textContent = "Add New Product";
  document.getElementById("product-form").reset();
  document.getElementById("product-modal").classList.add("show");
}

// Open Edit Product Modal
function openEditProductModal(productId) {
  const product = allProductsList.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;
  document.getElementById("product-modal-title").textContent = "Edit Product";

  document.getElementById("product-name-input").value = product.name;
  document.getElementById("product-desc-input").value = product.description || "";
  document.getElementById("product-price-input").value = product.price;
  document.getElementById("product-original-price-input").value = product.originalPrice || product.price;
  document.getElementById("product-stock-input").value = product.stock;
  document.getElementById("product-image-input").value = product.image || "";
  document.getElementById("product-category-select").value = product.category ? product.category.id : "";
  document.getElementById("product-featured-check").checked = !!product.isFeatured;
  document.getElementById("product-trending-check").checked = !!product.isTrending;

  document.getElementById("product-modal").classList.add("show");
}

function closeProductModal() {
  document.getElementById("product-modal").classList.remove("show");
}

// Submit Product Form (Add / Edit)
function initProductForm() {
  const form = document.getElementById("product-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("product-name-input").value.trim();
    const description = document.getElementById("product-desc-input").value.trim();
    const price = parseFloat(document.getElementById("product-price-input").value);
    const originalPrice = parseFloat(document.getElementById("product-original-price-input").value) || price;
    const stock = parseInt(document.getElementById("product-stock-input").value, 10) || 10;
    const image = document.getElementById("product-image-input").value.trim() || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
    const categoryId = document.getElementById("product-category-select").value;
    const isFeatured = document.getElementById("product-featured-check").checked;
    const isTrending = document.getElementById("product-trending-check").checked;

    if (!name || isNaN(price) || !categoryId) {
      showToast("Please provide valid product name, price, and category.", "warning");
      return;
    }

    const payload = {
      name,
      description,
      price,
      originalPrice,
      stock,
      image,
      category: { id: parseInt(categoryId, 10) },
      isFeatured,
      isTrending
    };

    try {
      if (editingProductId) {
        await API.updateProduct(editingProductId, payload);
        showToast("Product updated successfully!", "success");
      } else {
        await API.createProduct(payload);
        showToast("Product created successfully!", "success");
      }

      closeProductModal();
      loadAdminProducts();
      loadDashboardData();
    } catch (error) {
      showToast(error.message || "Failed to save product", "error");
    }
  });
}
