document.addEventListener('DOMContentLoaded', () => {
    const user = Store.get('fk_currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Populate Form
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('display-name').innerText = user.name;

    // Address (if saved in previous order or profile - for now just empty or mock)
    // We didn't persist address in user object during checkout, but we could have.
    // For this academic project, we'll just leave address blank or let them save it now.

    document.getElementById('profile-form').addEventListener('submit', updateProfile);
});

function updateProfile(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value; // Optional to change

    let user = Store.get('fk_currentUser');
    let users = Store.get('fk_users');

    user.name = name;
    if (password) {
        user.password = password;
    }

    // Update in users array
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
        users[idx] = user;
    }

    Store.set('fk_users', users);
    Store.set('fk_currentUser', user);

    document.getElementById('display-name').innerText = name;
    showToast('Profile Updated Successfully', 'success');
}
