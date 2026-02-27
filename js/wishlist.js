const Wishlist = {
    get() {
        return Store.get('fk_wishlist') || [];
    },

    add(productId) {
        let list = this.get();
        if (!list.includes(productId)) {
            list.push(productId);
            Store.set('fk_wishlist', list);
            showToast('Added to Wishlist', 'success');
        }
    },

    remove(productId) {
        let list = this.get();
        list = list.filter(id => id !== productId);
        Store.set('fk_wishlist', list);
        showToast('Removed from Wishlist');
        // If on wishlist page, re-render
        if (typeof renderWishlistItems === 'function') renderWishlistItems();
    },

    toggle(productId) {
        const list = this.get();
        if (list.includes(productId)) {
            this.remove(productId);
            return false;
        } else {
            this.add(productId);
            return true;
        }
    }
};

// If on wishlist page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('wishlist.html')) {
        renderWishlistItems();
    }
});

function renderWishlistItems() {
    const container = document.getElementById('wishlist-grid');
    const emptyState = document.getElementById('empty-wishlist');

    if (!container) return;

    const list = Wishlist.get();

    if (list.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';

    // Fetch full product details
    const wishlistProducts = PRODUCTS.filter(p => list.includes(p.id));

    container.innerHTML = wishlistProducts.map(product => `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <div class="wishlist-icon active" onclick="event.stopPropagation(); Wishlist.remove('${product.id}')">
                <i class="fa fa-trash"></i>
            </div>
            <div class="img-container">
                <img src="${product.image}" loading="lazy" alt="${product.title}">
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
