/**
 * JOHN MART - Product Details Page Controller
 */

let currentProduct = null;
let selectedQuantity = 1;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    showToast("No product specified", "error");
    setTimeout(() => window.location.href = "products.html", 1500);
    return;
  }

  loadProductDetails(productId);
});

async function loadProductDetails(id) {
  const container = document.getElementById("product-details-container");
  if (!container) return;

  try {
    const res = await API.getProductById(id);
    currentProduct = res.data;

    if (!currentProduct) {
      throw new Error("Product not found");
    }

    renderProductView(currentProduct);
    loadRelatedProducts(currentProduct.category ? currentProduct.category.id : null, currentProduct.id);
  } catch (error) {
    container.innerHTML = `
      <div style="text-align: center; padding: 5rem 1rem;">
        <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;"></i>
        <h2>Product Not Found</h2>
        <p style="color: var(--text-muted); margin: 1rem 0 2rem;">The requested product could not be loaded.</p>
        <a href="products.html" class="btn btn-primary">Browse All Products</a>
      </div>
    `;
  }
}

function renderProductView(product) {
  // Breadcrumb
  const breadcrumb = document.getElementById("product-breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="index.html">Home</a> &nbsp;/&nbsp; 
      <a href="products.html">Products</a> &nbsp;/&nbsp; 
      <a href="products.html?categoryId=${product.category ? product.category.id : ''}">${product.category ? product.category.name : 'Category'}</a> &nbsp;/&nbsp; 
      <span>${product.name}</span>
    `;
  }

  // Main Image
  const mainImg = document.getElementById("main-product-image");
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
  }

  // Thumbnails Gallery
  const thumbContainer = document.getElementById("image-thumbnails");
  if (thumbContainer) {
    // Generate 3 alternate angle previews for interactive UI
    const images = [
      product.image,
      product.image + '&auto=format&fit=crop&w=400&q=70',
      product.image + '&auto=format&fit=crop&w=500&q=70'
    ];

    thumbContainer.innerHTML = images.map((img, idx) => `
      <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchMainImage('${img}', this)">
        <img src="${img}" alt="Thumbnail ${idx + 1}">
      </div>
    `).join('');
  }

  // Details text
  document.getElementById("detail-category").textContent = product.category ? product.category.name : "Category";
  document.getElementById("detail-title").textContent = product.name;
  
  const starsHtml = '★'.repeat(Math.round(product.rating || 4.5)) + '☆'.repeat(5 - Math.round(product.rating || 4.5));
  document.getElementById("detail-stars").innerHTML = starsHtml;
  document.getElementById("detail-rating-text").textContent = `${product.rating || 4.5} (${product.reviewCount || 0} customer reviews)`;

  document.getElementById("detail-price").textContent = formatPrice(product.price);
  
  const origPriceEl = document.getElementById("detail-original-price");
  if (origPriceEl) {
    if (product.originalPrice && product.originalPrice > product.price) {
      origPriceEl.textContent = formatPrice(product.originalPrice);
      origPriceEl.style.display = "inline";
    } else {
      origPriceEl.style.display = "none";
    }
  }

  const discountBadgeEl = document.getElementById("detail-discount-badge");
  if (discountBadgeEl) {
    if (product.discount > 0) {
      discountBadgeEl.textContent = `${product.discount}% OFF`;
      discountBadgeEl.style.display = "inline-flex";
    } else {
      discountBadgeEl.style.display = "none";
    }
  }

  document.getElementById("detail-description").textContent = product.description;

  // Stock status
  const stockEl = document.getElementById("detail-stock-status");
  if (stockEl) {
    if (product.stock > 0) {
      stockEl.innerHTML = `<span style="color: var(--success); font-weight: 600;"><i class="fa-solid fa-check-circle"></i> In Stock (${product.stock} units available)</span>`;
    } else {
      stockEl.innerHTML = `<span style="color: var(--danger); font-weight: 600;"><i class="fa-solid fa-times-circle"></i> Out of Stock</span>`;
    }
  }

  // Set quantity limit
  selectedQuantity = 1;
  const qtyInput = document.getElementById("detail-qty-input");
  if (qtyInput) qtyInput.value = "1";
}

function switchMainImage(url, element) {
  const mainImg = document.getElementById("main-product-image");
  if (mainImg) mainImg.src = url;

  document.querySelectorAll(".thumb-item").forEach(el => el.classList.remove("active"));
  if (element) element.classList.add("active");
}

function changeQuantity(delta) {
  const qtyInput = document.getElementById("detail-qty-input");
  if (!qtyInput) return;

  let current = parseInt(qtyInput.value, 10) || 1;
  current += delta;

  const max = currentProduct ? currentProduct.stock : 99;
  if (current < 1) current = 1;
  if (current > max) {
    current = max;
    showToast(`Maximum available stock is ${max}`, "warning");
  }

  qtyInput.value = current;
  selectedQuantity = current;
}

async function addCurrentProductToCart() {
  if (!currentProduct) return;
  const qtyInput = document.getElementById("detail-qty-input");
  const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
  await handleAddToCart(currentProduct.id, qty);
}

async function buyNowCurrentProduct() {
  if (!currentProduct) return;
  const user = Auth.getUser();
  if (!user) {
    showToast("Please sign in to proceed to checkout", "warning");
    setTimeout(() => {
      window.location.href = `login.html?redirect=checkout.html`;
    }, 800);
    return;
  }

  const qtyInput = document.getElementById("detail-qty-input");
  const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;

  try {
    await API.addToCart(user.id, currentProduct.id, qty);
    window.location.href = "checkout.html";
  } catch (e) {
    showToast("Failed to proceed: " + e.getMessage(), "error");
  }
}

async function addCurrentProductToWishlist() {
  if (!currentProduct) return;
  await handleToggleWishlist(currentProduct.id, null);
}

// Load recommendations from same category
async function loadRelatedProducts(categoryId, excludeId) {
  const grid = document.getElementById("related-products-grid");
  if (!grid) return;

  try {
    const res = await API.getProducts({ categoryId: categoryId || "" });
    let related = (res.data || []).filter(p => p.id !== excludeId);
    if (related.length > 4) related = related.slice(0, 4);

    if (related.length > 0) {
      grid.innerHTML = related.map(p => renderProductCard(p)).join('');
    } else {
      document.getElementById("related-products-section").style.display = "none";
    }
  } catch (e) {
    console.warn("Could not load related products", e);
  }
}
