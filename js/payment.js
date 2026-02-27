document.addEventListener('DOMContentLoaded', () => {
    const address = sessionStorage.getItem('temp_address');
    if (!address) {
        window.location.href = 'checkout.html';
        return;
    }

    renderPaymentSummary();
    setupPaymentTabs();
});

function renderPaymentSummary() {
    const totals = Cart.calculateTotals();
    document.getElementById('pay-btn-text').innerText = `PAY ${formatCurrency(totals.total)}`;
    document.getElementById('payable-amount').innerText = formatCurrency(totals.total);
}

function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.payment-tab');
    const methods = document.querySelectorAll('.payment-method-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all
            tabs.forEach(t => t.classList.remove('active'));
            methods.forEach(m => m.classList.remove('active'));

            // Activate current
            tab.classList.add('active');
            const target = tab.dataset.target;
            document.getElementById(target).classList.add('active');
        });
    });
}

function processPayment() {
    // 1. Show processing loader
    const modal = document.getElementById('payment-processing-modal');
    modal.style.display = 'flex';

    setTimeout(() => {
        // 2. Generate Order
        createOrder();
    }, 2000); // 2 seconds delay simulation
}

function createOrder() {
    const cart = Cart.get();
    const totals = Cart.calculateTotals();
    const address = JSON.parse(sessionStorage.getItem('temp_address'));
    const user = Store.get('fk_currentUser');

    const orderId = generateId('OD');

    const newOrder = {
        orderId: orderId,
        userId: user.id || 'guest',
        items: cart,
        totalAmount: totals.total,
        address: address,
        status: 'Confirmed',
        date: new Date().toISOString(),
        paymentMethod: document.querySelector('.payment-tab.active').innerText
    };

    // Save to Orders List
    let orders = Store.get('fk_orders') || [];
    orders.unshift(newOrder); // Add to top
    Store.set('fk_orders', orders);

    // Clear Cart
    Cart.clear();
    sessionStorage.removeItem('temp_address');

    // Redirect to success
    window.location.href = `order-confirmation.html?orderId=${orderId}`;
}
