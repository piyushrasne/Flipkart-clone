document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        renderProductDetail(productId);
    } else {
        document.getElementById('product-content').innerHTML = '<h2>Product not found</h2>';
    }
});

function renderProductDetail(id) {
    const product = PRODUCTS.find(p => p.id === id);

    if (!product) {
        document.getElementById('product-content').innerHTML = '<h2>Product not found</h2>';
        return;
    }

    const container = document.getElementById('product-content');

    // Specs HTML
    const specsHTML = Object.entries(product.specifications).map(([key, val]) => `
        <tr>
            <td class="spec-key">${key}</td>
            <td>${val}</td>
        </tr>
    `).join('');

    // Thumbnails HTML
    const thumbnailsHTML = product.images.map((img, idx) => `
        <img src="${getImagePath(img)}" class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeImage('${getImagePath(img)}', this)">
    `).join('');

    container.innerHTML = `
        <div class="image-gallery">
            <div class="main-image">
                <img id="mainImg" src="${getImagePath(product.image)}" alt="${product.title}">
            </div>
            <div class="thumbnail-row">
                ${thumbnailsHTML}
            </div>
            <div class="action-buttons">
                <button class="btn-large btn-cart" onclick="addToCart('${product.id}')">
                    <i class="fa fa-shopping-cart"></i> ADD TO CART
                </button>
                <button class="btn-large btn-buy" onclick="buyNow('${product.id}')">
                    <i class="fa fa-bolt"></i> BUY NOW
                </button>
            </div>
        </div>

        <div class="product-info">
            <h1>${product.title}</h1>
            <div>
                <span class="rating-badge">${product.rating} <i class="fa fa-star" style="font-size:10px"></i></span>
                <span style="color:#878787; margin-left:8px; font-weight:500;">${product.reviewCount} Ratings & Reviews</span>
            </div>
            
            <div class="price-info">
                <span class="curr-price">${formatCurrency(product.price)}</span>
                <span class="original-price">${formatCurrency(product.mrp)}</span>
                <span class="off-percentage">${product.discount}% off</span>
            </div>

            <div style="margin-top: 20px;">
                <h4>Available Offers</h4>
                <ul style="font-size: 14px; margin-top: 10px; line-height: 2;">
                    <li><i class="fa fa-tag" style="color:var(--success-color)"></i> Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</li>
                    <li><i class="fa fa-tag" style="color:var(--success-color)"></i> Bank Offer 10% Off on SBI Credit Card, up to ₹1,500</li>
                    <li><i class="fa fa-tag" style="color:var(--success-color)"></i> Special Price Get extra ₹3000 off (price inclusive of discount)</li>
                </ul>
            </div>

            <div style="margin-top: 20px; border: 1px solid #f0f0f0; padding: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px;">Specifications</h3>
                <table class="specs-table">
                    ${specsHTML}
                </table>
            </div>
            
            <div style="margin-top: 20px; border: 1px solid #f0f0f0; padding: 20px;">
                <h3 style="font-size: 18px; margin-bottom: 10px;">Product Description</h3>
                <p style="font-size: 14px; color: #555;">${product.description}</p>
            </div>
        </div>
    `;
}

function changeImage(src, thumb) {
    document.getElementById('mainImg').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

function addToCart(productId) {
    if (!checkLogin()) return;

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    let cart = Store.get('fk_cart') || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Quantity updated in cart');
    } else {
        cart.push({
            productId: product.id,
            title: product.title,
            price: product.price,
            mrp: product.mrp,
            discount: product.discount,
            image: product.image,
            quantity: 1
        });
        showToast('Added to cart successfully', 'success');
    }

    Store.set('fk_cart', cart);
    updateCartCount(); // from app.js
}

function buyNow(productId) {
    addToCart(productId);
    window.location.href = 'cart.html';
}

function checkLogin() {
    const user = Store.get('fk_currentUser');
    if (!user) {
        showToast('Please login to continue', 'error');
        setTimeout(() => window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href), 1000);
        return false;
    }
    return true;
}
