function checkAdminAccess() {
    const user = Store.get('fk_currentUser');
    if (!user || user.role !== 'admin') {
        alert('Access Denied: Admins Only');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

// Global Products Array (Persisted in localStorage, fallback to static data)
let adminProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) return;

    // Initialize Products
    const stored = Store.get('fk_products');
    if (stored) {
        adminProducts = stored;
    } else {
        adminProducts = PRODUCTS; // from data/products-data.js
        Store.set('fk_products', adminProducts);
    }

    // Page Router
    const path = window.location.pathname;
    if (path.includes('dashboard.html')) {
        renderDashboardStats();
    } else if (path.includes('manage-products.html')) {
        renderProductTable();
        document.getElementById('product-form').addEventListener('submit', handleProductSave);
    } else if (path.includes('manage-orders.html')) {
        renderOrderTable();
    } else if (path.includes('manage-users.html')) {
        renderUserTable();
    }
});

// --- Dashboard Logic ---
function renderDashboardStats() {
    const orders = Store.get('fk_orders') || [];
    const users = Store.get('fk_users') || [];
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    setText('stat-total-products', adminProducts.length);
    setText('stat-total-orders', orders.length);
    setText('stat-total-users', users.length);
    setText('stat-total-revenue', formatCurrency(revenue));
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

// --- Product CRUD ---
function renderProductTable() {
    const tbody = document.getElementById('product-table-body');
    if (!tbody) return;

    tbody.innerHTML = adminProducts.map(p => `
        <tr>
            <td><img src="${p.image}" style="width: 40px; height: 40px; object-fit: contain;"></td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.title}</td>
            <td>${p.category}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.inStock ? 'In Stock' : 'Out of Stock'}</td>
            <td>
                <button class="btn-small btn-edit" onclick="openEditProduct('${p.id}')"><i class="fa fa-edit"></i></button>
                <button class="btn-small btn-delete" onclick="deleteProduct('${p.id}')"><i class="fa fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openAddProductModal() {
    document.getElementById('modal-title').innerText = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-modal').style.display = 'flex';
}

function openEditProduct(id) {
    const p = adminProducts.find(x => x.id === id);
    if (!p) return;

    document.getElementById('modal-title').innerText = 'Edit Product';
    document.getElementById('product-id').value = p.id;
    document.getElementById('p-title').value = p.title;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-mrp').value = p.mrp;
    document.getElementById('p-image').value = p.image;
    document.getElementById('p-desc').value = p.description;

    document.getElementById('product-modal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function handleProductSave(e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const title = document.getElementById('p-title').value;
    const category = document.getElementById('p-category').value;
    const price = parseFloat(document.getElementById('p-price').value);
    const mrp = parseFloat(document.getElementById('p-mrp').value);
    const image = document.getElementById('p-image').value;
    const desc = document.getElementById('p-desc').value;

    if (id) {
        // Edit
        const idx = adminProducts.findIndex(p => p.id === id);
        if (idx !== -1) {
            adminProducts[idx] = { ...adminProducts[idx], title, category, price, mrp, image, description: desc };
        }
    } else {
        // Add
        const newProduct = {
            id: generateId('P'),
            title, category, price, mrp, image, description: desc,
            rating: 0, reviewCount: 0, inStock: true, discount: Math.round(((mrp - price) / mrp) * 100),
            images: [image], specifications: {}
        };
        adminProducts.push(newProduct);
    }

    Store.set('fk_products', adminProducts);
    renderProductTable();
    closeProductModal();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        adminProducts = adminProducts.filter(p => p.id !== id);
        Store.set('fk_products', adminProducts);
        renderProductTable();
    }
}

// --- Order Management ---
function renderOrderTable() {
    const tbody = document.getElementById('order-table-body');
    if (!tbody) return;

    const orders = Store.get('fk_orders') || [];

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderId}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.address.name}</td>
            <td>${formatCurrency(order.totalAmount)}</td>
            <td>
                <select onchange="updateOrderStatus('${order.orderId}', this.value)" style="padding: 4px; border-radius: 4px;">
                    <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, status) {
    let orders = Store.get('fk_orders') || [];
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        order.status = status;
        Store.set('fk_orders', orders);
        showToast(`Order status updated to ${status}`, 'success');
    }
}

// --- User Management ---
function renderUserTable() {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;

    const users = Store.get('fk_users') || [];

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}
