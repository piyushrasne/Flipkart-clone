// Main App Logic

// Helper to figure out relative path prefix based on current page depth
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/admin/')) {
        return '../../';
    } else if (path.includes('/pages/')) {
        return '../';
    }
    return './';
}

// Helper to resolve image paths - prefixes local paths with base path
function getImagePath(src) {
    if (!src) return '';
    // External URLs (http/https/data) stay as-is
    if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) {
        return src;
    }
    // Local paths get prefixed with base path
    return getBasePath() + src;
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('Flipkart Clone Initialized');

    // Check if we are in Admin Panel
    if (window.location.pathname.includes('/admin/')) {
        // Do not render consumer navbar/footer for admin pages
        return;
    }

    renderNavbar();
    renderFooter();
    updateCartCount();
    checkUserSession();
}

// Render Header/Navbar
function renderNavbar() {
    const base = getBasePath();
    const navbarHTML = `
    <header>
        <div class="navbar-container container">
            <div class="nav-left">
                <a href="${base}index.html" class="logo">
                     <span style="font-size:22px; font-weight:bold; color:white; font-style:italic;">Flipkart</span>
                     <span class="explore-plus">Explore <span class="plus">Plus</span> <i class="fa fa-plus" style="font-size:8px;color:#ffe500;"></i></span>
                </a>
                <div class="search-bar">
                    <input type="text" placeholder="Search for products, brands and more" id="searchInput">
                    <button class="search-btn"><i class="fa fa-search"></i></button>
                    <div id="searchResults" class="search-results"></div>
                </div>
            </div>
            
            <div class="nav-right">
                <div class="user-menu">
                    <button class="login-btn" id="loginBtn">Login</button>
                    <div class="dropdown-menu" id="userDropdown">
                        <!-- Populated by JS -->
                    </div>
                </div>
                <a href="${base}pages/products.html" class="nav-link">Products</a>
                <a href="${base}pages/deals.html" class="nav-link">Deals</a>
                <a href="${base}pages/cart.html" class="nav-cart">
                    <i class="fa fa-shopping-cart"></i>
                    <span>Cart</span>
                    <span class="cart-count" id="cartCount">0</span>
                </a>
            </div>
        </div>
    </header>
    `;

    // Inject navbar if a placeholder exists, or prepend to body
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = navbarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    }

    // Attach event listeners for search, etc.
    setupSearch();
}


function renderFooter() {
    const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>ABOUT</h4>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>HELP</h4>
                    <ul>
                        <li><a href="#">Payments</a></li>
                        <li><a href="#">Shipping</a></li>
                        <li><a href="#">Cancellation</a></li>
                        <li><a href="#">Returns</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>POLICY</h4>
                    <ul>
                        <li><a href="#">Return Policy</a></li>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Security</a></li>
                        <li><a href="#">Privacy</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>SOCIAL</h4>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Flipkart Clone. For Academic Demonstration Only.</p>
            </div>
        </div>
    </footer>
    `;

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

function updateCartCount() {
    if (typeof Store !== 'undefined') {
        const cart = Store.get('fk_cart') || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('cartCount');
        if (badge) badge.textContent = count;
    }
}

function checkUserSession() {
    if (typeof Store !== 'undefined') {
        const base = getBasePath();
        const user = Store.get('fk_currentUser');
        const loginBtn = document.getElementById('loginBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (user && loginBtn) {
            loginBtn.textContent = user.name.split(' ')[0]; // Show first name
            loginBtn.classList.add('logged-in');
            // Create user menu
            userDropdown.innerHTML = `
                <a href="${base}pages/profile.html"><i class="fa fa-user"></i> My Profile</a>
                <a href="${base}pages/orders.html"><i class="fa fa-gift"></i> Orders</a>
                <a href="${base}pages/wishlist.html"><i class="fa fa-heart"></i> Wishlist</a>
                <div class="divider"></div>
                <a href="#" onclick="logout()"><i class="fa fa-sign-out"></i> Logout</a>
            `;

            // Add admin link if applicable
            if (user.role === 'admin') {
                userDropdown.innerHTML = `<a href="${base}pages/admin/dashboard.html"><i class="fa fa-dashboard"></i> Admin Panel</a>` + userDropdown.innerHTML;
            }
        } else if (loginBtn) {
            loginBtn.onclick = () => window.location.href = base + 'pages/login.html';
        }
    }
}

function logout() {
    if (typeof Store !== 'undefined') {
        const base = getBasePath();
        Store.remove('fk_currentUser');
        showToast('Logged out successfully');
        setTimeout(() => window.location.href = base + 'index.html', 1000);
    }
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    const base = getBasePath();
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) window.location.href = `${base}pages/products.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}
