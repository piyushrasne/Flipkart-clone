// Utility Functions

// LocalStorage Store Wrapper
const Store = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            // Dispatch event for reactive updates in other components
            window.dispatchEvent(new CustomEvent('store-updated', { detail: { key, value } }));
        } catch (e) {
            console.error('Error writing to localStorage', e);
        }
    },
    remove(key) {
        localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent('store-updated', { detail: { key, value: null } }));
    }
};

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Generate Random ID
function generateId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Show Toast Notification
function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.backgroundColor = type === 'error' ? 'var(--error-color)' :
        type === 'success' ? 'var(--success-color)' : '#333';

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Get URL Parameter
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Toggle Password Visibility
function togglePasswordVisibility(inputId, iconElement) {
    const passwordInput = document.getElementById(inputId);
    if (!passwordInput) return;

    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle eye icon
    if (iconElement) {
        iconElement.classList.toggle('fa-eye');
        iconElement.classList.toggle('fa-eye-slash');
    }
}
