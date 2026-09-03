/**
 * JOHN MART - Products Catalog Page Controller
 */

let currentFilters = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "newest"
};

document.addEventListener("DOMContentLoaded", () => {
  // Read parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("search")) currentFilters.search = urlParams.get("search");
  if (urlParams.has("categoryId")) currentFilters.categoryId = urlParams.get("categoryId");
  if (urlParams.has("minPrice")) currentFilters.minPrice = urlParams.get("minPrice");
  if (urlParams.has("maxPrice")) currentFilters.maxPrice = urlParams.get("maxPrice");
  if (urlParams.has("sortBy")) currentFilters.sortBy = urlParams.get("sortBy");

  // Populate categories in filter sidebar
  loadSidebarCategories();

  // Setup event listeners for filters & sort
  initFilterControls();

  // Fetch and display products
  fetchCatalogProducts();
});

async function loadSidebarCategories() {
  const container = document.getElementById("category-filter-list");
  if (!container) return;

  try {
    const res = await API.getCategories();
    if (res.data) {
      let html = `
        <label class="filter-radio-label">
          <input type="radio" name="categoryFilter" value="" ${!currentFilters.categoryId ? 'checked' : ''} onchange="onCategoryFilterChange('')">
          <span>All Categories</span>
        </label>
      `;

      res.data.forEach(cat => {
        const isChecked = currentFilters.categoryId == cat.id;
        html += `
          <label class="filter-radio-label">
            <input type="radio" name="categoryFilter" value="${cat.id}" ${isChecked ? 'checked' : ''} onchange="onCategoryFilterChange('${cat.id}')">
            <span>${cat.name}</span>
          </label>
        `;
      });

      container.innerHTML = html;
    }
  } catch (e) {
    console.error("Failed to load categories in sidebar", e);
  }
}

function initFilterControls() {
  // Sort Dropdown
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.value = currentFilters.sortBy;
    sortSelect.addEventListener("change", (e) => {
      currentFilters.sortBy = e.target.value;
      updateUrlAndFetch();
    });
  }

  // Price Filter form
  const priceFilterBtn = document.getElementById("apply-price-filter-btn");
  const minPriceInput = document.getElementById("min-price-input");
  const maxPriceInput = document.getElementById("max-price-input");

  if (minPriceInput && currentFilters.minPrice) minPriceInput.value = currentFilters.minPrice;
  if (maxPriceInput && currentFilters.maxPrice) maxPriceInput.value = currentFilters.maxPrice;

  if (priceFilterBtn) {
    priceFilterBtn.addEventListener("click", () => {
      currentFilters.minPrice = minPriceInput ? minPriceInput.value : "";
      currentFilters.maxPrice = maxPriceInput ? maxPriceInput.value : "";
      updateUrlAndFetch();
    });
  }

  // Clear All Filters
  const clearBtn = document.getElementById("clear-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      currentFilters = { search: "", categoryId: "", minPrice: "", maxPrice: "", sortBy: "newest" };
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
      if (sortSelect) sortSelect.value = "newest";
      document.querySelectorAll("input[name='categoryFilter']").forEach(r => r.checked = (r.value === ""));
      updateUrlAndFetch();
    });
  }
}

function onCategoryFilterChange(categoryId) {
  currentFilters.categoryId = categoryId;
  updateUrlAndFetch();
}

function updateUrlAndFetch() {
  const url = new URL(window.location.href);
  Object.keys(currentFilters).forEach(key => {
    if (currentFilters[key]) {
      url.searchParams.set(key, currentFilters[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url);
  fetchCatalogProducts();
}

async function fetchCatalogProducts() {
  const grid = document.getElementById("products-catalog-grid");
  const countLabel = document.getElementById("products-count-label");
  const pageTitle = document.getElementById("catalog-heading");

  if (!grid) return;

  // Show Skeleton loader
  grid.innerHTML = Array(8).fill(`
    <div class="product-card">
      <div class="product-image-container skeleton"></div>
      <div class="product-info">
        <div class="skeleton" style="height: 14px; width: 40%; margin-bottom: 8px;"></div>
        <div class="skeleton" style="height: 20px; width: 90%; margin-bottom: 8px;"></div>
        <div class="skeleton" style="height: 16px; width: 50%; margin-bottom: 12px;"></div>
        <div class="skeleton" style="height: 24px; width: 60%; margin-top: auto;"></div>
      </div>
    </div>
  `).join('');

  try {
    const res = await API.getProducts(currentFilters);
    const products = res.data || [];

    if (countLabel) {
      countLabel.textContent = `Showing ${products.length} products`;
    }

    if (pageTitle && currentFilters.search) {
      pageTitle.textContent = `Search Results for "${currentFilters.search}"`;
    } else if (pageTitle) {
      pageTitle.textContent = `Explore All Products`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: white; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <h3 style="margin-bottom: 0.5rem;">No Products Found</h3>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your search criteria or price filters.</p>
          <button class="btn btn-primary" onclick="document.getElementById('clear-filters-btn').click()">Reset Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => renderProductCard(p)).join('');
  } catch (error) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: var(--radius-md);">
        <p style="color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Error loading products: ${error.message}</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 1rem;" onclick="fetchCatalogProducts()">Try Again</button>
      </div>
    `;
  }
}
