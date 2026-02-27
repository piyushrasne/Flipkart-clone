document.addEventListener('DOMContentLoaded', () => {
    // Check if cart is empty
    const cart = Cart.get();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // Check login
    const user = Store.get('fk_currentUser');
    if (!user) {
        window.location.href = 'login.html?redirect=checkout.html';
        return;
    }

    renderCheckoutSummary();

    document.getElementById('address-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAddressAndProceed();
    });
});

function renderCheckoutSummary() {
    const totals = Cart.calculateTotals();
    const cart = Cart.get();

    // Order Summary
    const summaryContainer = document.getElementById('checkout-items');
    summaryContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div style="width: 50px;">
                <img src="${item.image}" style="width: 100%;">
            </div>
            <div style="flex: 1; padding-left: 10px;">
                <div style="font-size: 14px; font-weight: 500;">${item.title}</div>
                <div style="font-size: 12px; color: #878787;">Qty: ${item.quantity}</div>
                <div style="font-size: 14px; margin-top: 4px;">${formatCurrency(item.price)}</div>
            </div>
        </div>
    `).join('');

    // Price Details
    document.getElementById('price-details-checkout').innerHTML = `
        <div class="price-row"><span>Price (${totals.count} items)</span> <span>${formatCurrency(totals.price)}</span></div>
        <div class="price-row"><span>Discount</span> <span class="success">-${formatCurrency(totals.discount)}</span></div>
        <div class="price-row"><span>Delivery</span> <span class="success">${totals.delivery === 0 ? 'FREE' : formatCurrency(totals.delivery)}</span></div>
        <div class="total-row"><span>Total Payable</span> <span>${formatCurrency(totals.total)}</span></div>
    `;
}

function saveAddressAndProceed() {
    // Basic validation is handled by HTML 'required' attributes
    const address = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        pincode: document.getElementById('pincode').value,
        details: document.getElementById('address').value,
        city: document.getElementById('city').value,
        type: document.querySelector('input[name="addressType"]:checked').value
    };

    // Save to session storage for payment page
    sessionStorage.setItem('temp_address', JSON.stringify(address));

    // Redirect
    window.location.href = 'payment.html';
}
