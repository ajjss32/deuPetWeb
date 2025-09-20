document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('login-link');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            localStorage.clear();
            await fetch('/deuPetWeb/backend/logout.php', { method: 'POST' });
            window.location.href = '/deuPetWeb/pages/login.html';
        });
    }
});