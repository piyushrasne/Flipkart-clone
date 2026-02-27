document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('orders.html')) {
        renderOrders();
    }
});

function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    const user = Store.get('fk_currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const allOrders = Store.get('fk_orders') || [];
    // User filter
    const myOrders = allOrders.filter(o => o.userId === user.id);

    if (myOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white;">
                <h3>No orders yet</h3>
                <a href="products.html" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">Start Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = myOrders.map(order => {
        // Just show first item image for summary, or listing all items
        const firstItem = order.items[0];

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">ORDER ID: ${order.orderId}</span>
                        <span class="order-date">Placed on ${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                </div>
                
                ${order.items.map(item => `
                    <div class="order-item-row">
                        <div class="item-img">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="item-info">
                            <div class="item-title">${item.title}</div>
                            <div class="item-price">${formatCurrency(item.price)}</div>
                        </div>
                        <div class="item-status">
                            <div class="status-dot"></div> ${order.status}
                        </div>
                    </div>
                `).join('')}
                
                <div class="order-footer">
                    <span>Total: <strong>${formatCurrency(order.totalAmount)}</strong></span>
                </div>
            </div>
        `;
    }).join('');
}
