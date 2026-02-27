document.addEventListener('DOMContentLoaded', () => {
    // Check if on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Check if on signup page
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    let users = Store.get('fk_users') || [];

    // Check existing
    if (users.find(u => u.email === email)) {
        showToast('User already exists with this email', 'error');
        return;
    }

    const newUser = {
        id: generateId('USR'),
        name,
        email,
        password, // stored plain text for demo
        role: 'user', // default
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    Store.set('fk_users', users);

    // Auto login
    Store.set('fk_currentUser', newUser);

    showToast('Signup successful! Redirecting...', 'success');

    setTimeout(() => {
        // Check for redirect param
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        window.location.href = redirect || '../index.html';
    }, 1500);
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let users = Store.get('fk_users') || [];

    // Add default admin if not exists
    const adminEmail = 'admin@flipkart.com';
    if (!users.find(u => u.email === adminEmail)) {
        users.push({
            id: 'ADMIN-001',
            name: 'Admin User',
            email: adminEmail,
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        Store.set('fk_users', users);
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        Store.set('fk_currentUser', user);
        showToast('Login successful!', 'success');
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location.href = redirect || '../index.html';
        }, 1000);
    } else {
        showToast('Invalid email or password', 'error');
    }
}
