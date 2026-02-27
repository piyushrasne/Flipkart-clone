const Cart = {
    get() {
        return Store.get('fk_cart') || [];
    },

    add(product, quantity = 1) {
        let cart = this.get();
        const existing = cart.find(item => item.productId === product.id);

        if (existing) {
            existing.quantity += quantity;
            showToast('Quantity updated in cart');
        } else {
            cart.push({
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image, // Use first image or main image
                quantity: quantity,
                mrp: product.mrp,
                discount: product.discount
            });
            showToast('Item added to cart', 'success');
        }

        Store.set('fk_cart', cart);
        updateCartCount(); // Global app.js function
    },

    remove(productId) {
        let cart = this.get();
        cart = cart.filter(item => item.productId !== productId);
        Store.set('fk_cart', cart);
        updateCartCount();
        showToast('Item removed from cart');
        // If on cart page, re-render
        if (typeof renderCartItems === 'function') renderCartItems();
    },

    updateQuantity(productId, delta) {
        let cart = this.get();
        const item = cart.find(i => i.productId === productId);

        if (item) {
            const newQty = item.quantity + delta;
            if (newQty < 1) {
                // Confirm remove? For now just remove or stay at 1
                return;
            }
            if (newQty > 10) {
                showToast('Max quantity limit reached', 'error');
                return;
            }
            item.quantity = newQty;
            Store.set('fk_cart', cart);
            // If on cart page, re-render
            if (typeof renderCartItems === 'function') renderCartItems();
        }
    },

    clear() {
        Store.set('fk_cart', []);
        updateCartCount();
    },

    calculateTotals() {
        const cart = this.get();
        const price = cart.reduce((sum, item) => sum + ((item.mrp || item.price) * item.quantity), 0);
        const discount = cart.reduce((sum, item) => sum + (((item.mrp || item.price) - item.price) * item.quantity), 0);
        const delivery = price > 500 ? 0 : 40;
        const total = price - discount + delivery;

        return {
            price,
            discount,
            delivery,
            total,
            count: cart.length
        };
    }
};

// If on cart page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
});

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');
    const cartLayout = document.getElementById('cart-layout');

    if (!container) return;

    const cart = Cart.get();

    if (cart.length === 0) {
        cartLayout.style.display = 'none';
        emptyCart.style.display = 'flex';
        return;
    }

    cartLayout.style.display = 'flex';
    emptyCart.style.display = 'none';

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="item-details">
                <div class="item-title">${item.title}</div>
                <div class="item-price-row">
                    <span class="item-price">${formatCurrency(item.price)}</span>
                    <span class="item-mrp">${formatCurrency(item.mrp)}</span>
                    <span class="item-discount">${item.discount}% Off</span>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button onclick="Cart.updateQuantity('${item.productId}', -1)" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                        <input type="text" value="${item.quantity}" readonly>
                        <button onclick="Cart.updateQuantity('${item.productId}', 1)">+</button>
                    </div>
                    <button class="action-btn" onclick="Cart.remove('${item.productId}')">REMOVE</button>
                </div>
            </div>
        </div>
    `).join('');

    renderPriceDetails();
}

function renderPriceDetails() {
    const totals = Cart.calculateTotals();
    const container = document.getElementById('price-details');

    if (!container) return;

    container.innerHTML = `
        <div class="price-row">
            <span>Price (${totals.count} items)</span>
            <span>${formatCurrency(totals.price)}</span>
        </div>
        <div class="price-row">
            <span>Discount</span>
            <span class="success">-${formatCurrency(totals.discount)}</span>
        </div>
        <div class="price-row">
            <span>Delivery Charges</span>
            <span class="success">${totals.delivery === 0 ? 'Free' : formatCurrency(totals.delivery)}</span>
        </div>
        <div class="total-row">
            <span>Total Amount</span>
            <span>${formatCurrency(totals.total)}</span>
        </div>
        <div style="color: var(--success-color); font-weight: 500; margin-top: 10px;">
            You will save ${formatCurrency(totals.discount)} on this order
        </div>
    `;
}
