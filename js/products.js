document.addEventListener('DOMContentLoaded', () => {
    initProductsPage();
});

let currentProducts = [];
let activeFilters = {
    categories: [],
    price: null,
    rating: null,
    search: ''
};
let currentSort = 'relevance';

function initProductsPage() {
    // 1. Render Filters
    renderCategoryFilters();

    // 2. Read URL params (search query or category)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('q');

    if (categoryParam) {
        activeFilters.categories.push(categoryParam);
        // Check the checkbox
        setTimeout(() => {
            const cb = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
            if (cb) cb.checked = true;
        }, 100);
    }

    if (searchParam) {
        activeFilters.search = searchParam.toLowerCase();
        document.getElementById('product-count').textContent = `Showing results for "${searchParam}"`;
    }

    // 3. Setup Event Listeners
    setupFilterListeners();
    setupSortListeners();

    // 4. Initial Filter & Render
    applyFilters();
}

function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (container && typeof CATEGORIES !== 'undefined') {
        const uniqueCategories = [...new Set(PRODUCTS.map(p => p.category))];

        container.innerHTML = uniqueCategories.map(cat => `
            <label>
                <input type="checkbox" name="category" value="${cat}"> ${cat}
            </label>
        `).join('');
    }
}

function setupFilterListeners() {
    // Categories
    document.getElementById('category-filters').addEventListener('change', (e) => {
        if (e.target.name === 'category') {
            const value = e.target.value;
            if (e.target.checked) {
                activeFilters.categories.push(value);
            } else {
                activeFilters.categories = activeFilters.categories.filter(c => c !== value);
            }
            applyFilters();
        }
    });

    // Price (Radio)
    document.querySelectorAll('input[name="price"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            activeFilters.price = e.target.value;
            applyFilters();
        });
    });

    // Rating
    document.querySelectorAll('input[name="rating"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            // Only allow one rating filter at a time for simplicity, or max logic
            document.querySelectorAll('input[name="rating"]').forEach(c => {
                if (c !== e.target) c.checked = false;
            });
            activeFilters.rating = e.target.checked ? parseInt(e.target.value) : null;
            applyFilters();
        });
    });
}

function setupSortListeners() {
    document.querySelectorAll('.sort-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sort-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentSort = item.dataset.sort;
            applySort();
        });
    });
}

function clearFilters() {
    // Reset inputs
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => el.checked = false);

    // Reset state
    activeFilters = {
        categories: [],
        price: null,
        rating: null,
        search: ''
    };

    // Clear URL params without reload
    window.history.pushState({}, document.title, window.location.pathname);

    applyFilters();
}


function applyFilters() {
    if (typeof PRODUCTS === 'undefined') return;

    let filtered = [...PRODUCTS];

    // 1. Search Query
    if (activeFilters.search) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(activeFilters.search) ||
            p.category.toLowerCase().includes(activeFilters.search) ||
            p.brand.toLowerCase().includes(activeFilters.search)
        );
    }

    // 2. Categories
    if (activeFilters.categories.length > 0) {
        filtered = filtered.filter(p => activeFilters.categories.includes(p.category));
    }

    // 3. Price
    if (activeFilters.price) {
        if (activeFilters.price === 'under_10000') {
            filtered = filtered.filter(p => p.price < 10000);
        } else if (activeFilters.price === '10000_20000') {
            filtered = filtered.filter(p => p.price >= 10000 && p.price <= 20000);
        } else if (activeFilters.price === '20000_plus') {
            filtered = filtered.filter(p => p.price > 20000);
        }
    }

    // 4. Rating
    if (activeFilters.rating) {
        filtered = filtered.filter(p => p.rating >= activeFilters.rating);
    }

    currentProducts = filtered;

    // Update count text
    const countEl = document.getElementById('product-count');
    if (countEl) countEl.innerText = `Showing ${filtered.length} products` + (activeFilters.search ? ` for "${activeFilters.search}"` : '');

    applySort(); // Sort then Render
}

function applySort() {
    let sorted = [...currentProducts];

    switch (currentSort) {
        case 'price_low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'relevance':
        default:
            // Original order
            break;
    }

    renderProducts(sorted);
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fa fa-search" style="font-size: 60px; opacity: 0.3; margin-bottom: 20px;"></i>
                <h3>No products found</h3>
                <p>Try changing the filters.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <div class="wishlist-icon" onclick="event.stopPropagation(); toggleWishlist('${product.id}')">
                <i class="fa fa-heart ${isInWishlist(product.id) ? 'active' : ''}"></i>
            </div>
            <div class="img-container">
                <img src="${getImagePath(product.image)}" loading="lazy" alt="${product.title}">
            </div>
            <div class="title" title="${product.title}">${product.title}</div>
            <div style="margin-bottom: 4px; display:flex; gap:6px; align-items:center; justify-content:center;">
                <span class="rating-box">${product.rating} <i class="fa fa-star" style="font-size: 10px;"></i></span>
                <span class="reviews">(${product.reviewCount})</span>
            </div>
            <div class="price-row">
                <span class="price">${formatCurrency(product.price)}</span>
                <span class="mrp">${formatCurrency(product.mrp)}</span>
                <span class="discount">${product.discount}% off</span>
            </div>
        </div>
    `).join('');
}


// --- Wishlist Helper Stub (Full logic in wishlist.js) ---
function isInWishlist(id) {
    const list = Store.get('fk_wishlist') || [];
    return list.includes(id);
}

function toggleWishlist(id) {
    let list = Store.get('fk_wishlist') || [];
    if (list.includes(id)) {
        list = list.filter(i => i !== id);
        showToast('Removed from Wishlist');
    } else {
        list.push(id);
        showToast('Added to Wishlist', 'success');
    }
    Store.set('fk_wishlist', list);
    applyFilters(); // Re-render to update icon
}
