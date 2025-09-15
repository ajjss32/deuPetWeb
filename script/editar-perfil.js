document.addEventListener('DOMContentLoaded', async () => {
    const alerts = document.getElementById('alerts');

    function showAlert(msg, type = 'danger') {
        alerts.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    }

    try {
        const res = await fetch('/deuPetWeb/backend/get_usuario.php');
        const data = await res.json();
        if (data.sucesso) {
            const u = data.usuario;
            document.getElementById('nome').value = u.nome || '';
            document.getElementById('email').value = u.email || '';
            document.getElementById('fone').value = u.telefone || '';
            document.getElementById('nasc').value = u.data_nascimento || '';
            document.getElementById('cpfCnpj').value = u.cpf_cnpj || '';
            document.getElementById('cep').value = u.cep || '';
            document.getElementById('logradouro').value = u.logradouro || '';
            document.getElementById('bairro').value = u.bairro || '';
            document.getElementById('cidade').value = u.cidade || '';
            document.getElementById('estado').value = u.estado || '';
            document.getElementById('descricao').value = u.descricao || '';
            if (u.foto) {
                document.getElementById('avatarPreview').src = u.foto;
            }
        }
    } catch (e) {
        showAlert('Erro ao carregar dados do perfil.');
    }

    const avatarFileInput = document.getElementById('avatarFile');
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarFileInput && avatarPreview) {
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) {
                showAlert('A imagem deve ter no máximo 10MB.');
                avatarFileInput.value = '';
                return;
            }
            avatarPreview.src = URL.createObjectURL(file);
        });
    }

    const buscarCepBtn = document.getElementById('buscarCep');
    if (buscarCepBtn) {
        buscarCepBtn.addEventListener('click', async () => {
            const cepEl = document.getElementById('cep');
            const cep = (cepEl.value || '').replace(/\D/g, '');
            if (cep.length !== 8) {
                showAlert('CEP inválido.');
                return;
            }
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                if (data.erro) {
                    showAlert('CEP não encontrado.');
                    return;
                }
                document.getElementById('logradouro').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('estado').value = data.uf || '';
            } catch (err) {
                showAlert('Erro ao buscar CEP.');
            }
        });
    }

    const form = document.getElementById('editProfileForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('nome', document.getElementById('nome').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('fone', document.getElementById('fone').value);
            formData.append('senha', document.getElementById('senha').value);
            formData.append('data_nascimento', document.getElementById('nasc').value);
            formData.append('cpf_cnpj', document.getElementById('cpfCnpj').value);
            formData.append('cep', document.getElementById('cep').value);
            formData.append('logradouro', document.getElementById('logradouro').value);
            formData.append('bairro', document.getElementById('bairro').value);
            formData.append('cidade', document.getElementById('cidade').value);
            formData.append('estado', document.getElementById('estado').value);
            formData.append('descricao', document.getElementById('descricao').value);
            const fotoInput = document.getElementById('avatarFile');
            if (fotoInput && fotoInput.files.length > 0) {
                formData.append('foto', fotoInput.files[0]);
            }
            try {
                const res = await fetch('/deuPetWeb/backend/atualizar_usuario.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.sucesso) {
                    alerts.innerHTML = `<div class="alert alert-success">Perfil atualizado com sucesso!</div>`;
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    alerts.innerHTML = `<div class="alert alert-danger">${data.erro || 'Erro ao atualizar perfil.'}</div>`;
                }
            } catch (err) {
                alerts.innerHTML = `<div class="alert alert-danger">Erro de conexão com o servidor.</div>`;
            }
        });
    }

    const excluirBtn = document.querySelector('#meuModalID .btn-danger');
    if (excluirBtn) {
        excluirBtn.addEventListener('click', async () => {
            excluirBtn.disabled = true;
            try {
                const res = await fetch('/deuPetWeb/backend/excluir_usuario.php', { method: 'POST' });
                const data = await res.json();
                if (data.sucesso) {
                    window.location.href = 'login.html';
                } else {
                    alerts.innerHTML = `<div class="alert alert-danger">${data.erro || 'Erro ao excluir perfil.'}</div>`;
                }
            } catch (err) {
                alerts.innerHTML = `<div class="alert alert-danger">Erro de conexão ao excluir perfil.</div>`;
            }
            excluirBtn.disabled = false;
        });
    }
});