document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const email = emailInput.value;

            errorMessage.classList.remove('active');

            if (email === 'adotante@email.com') {
                window.location.href = './adotante/listar-pets.html'; 
            } else if (email === 'voluntario@email.com') {
                window.location.href = './voluntario/home_voluntario.html';
            } else {
                errorMessage.textContent = 'Email ou senha incorretos. Tente novamente.';
                errorMessage.classList.add('active');
            }
        });
    }

    const hideErrorOnChange = () => {
        if (errorMessage.classList.contains('active')) {
            errorMessage.classList.remove('active');
        }
    };

    if (emailInput) {
        emailInput.addEventListener('input', hideErrorOnChange);
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', hideErrorOnChange);
    }
});