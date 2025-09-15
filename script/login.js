document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('password').value;

            errorMessage.classList.remove('active');
            try {
                const res = await fetch('/deuPetWeb/backend/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                const data = await res.json();
                if (res.ok && data.sucesso) {
                    localStorage.setItem('stream_jwt', data.stream_jwt);
                    localStorage.setItem('user_id', data.usuario.id);
                    localStorage.setItem('user_name', data.usuario.nome);
                    localStorage.setItem('tipoAcesso', data.usuario.tipo);
                    if (data.usuario.tipo === 'adotante') {
                        window.location.href = './adotante/listar-pets.php';
                    } else if (data.usuario.tipo === 'voluntario') {
                        window.location.href = './voluntario/home_voluntario.php';
                    } else {
                        window.location.href = './index.html';
                    }
                } else {
                    errorMessage.textContent = data.erro || 'Erro ao fazer login.';
                    errorMessage.classList.add('active');
                }
            } catch (err) {
                errorMessage.textContent = 'Erro de conexão com o servidor.';
                errorMessage.classList.add('active');
            }
        });
    }
});