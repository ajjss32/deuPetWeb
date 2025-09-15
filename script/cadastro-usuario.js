document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.getElementById('loadingSpinner');
  const form = document.getElementById('registrationForm');
  const alerts = document.getElementById('alerts');

  const inputData = document.getElementById('dataNascimento');
  if (inputData) inputData.max = new Date().toISOString().split('T')[0];

  const avatarFileInput = document.getElementById('avatarFile');
  const avatarPreview = document.getElementById('avatarPreview');
  if (avatarFileInput && avatarPreview) {
    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        alerts.innerHTML = `<div class="alert alert-danger">A imagem deve ter no máximo 10MB.</div>`;
        avatarFileInput.value = '';
        avatarPreview.src = "https://cdn.jsdelivr.net/gh/creotiv/files@main/avatar_placeholder.png";
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
        alert('CEP inválido.');
        return;
      }
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) {
          alert('CEP não encontrado.');
          return;
        }
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
      } catch (err) {
        alert('Erro ao buscar CEP.');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.classList.add('was-validated');
      alerts.innerHTML = '';
      if (!form.checkValidity()) {
        return;
      }
      spinner.style.display = 'flex';
      const formData = new FormData(form);
      formData.append('nome', document.getElementById('nome').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('telefone', document.getElementById('telefone').value);
      formData.append('senha', document.getElementById('senha').value);
      formData.append('data_nascimento', document.getElementById('dataNascimento').value);
      formData.append('cpf_cnpj', document.getElementById('cpfCnpj').value);
      formData.append('tipo', document.getElementById('tipo').value);
      formData.append('endereco', JSON.stringify({
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
      }));
      formData.append('descricao', document.getElementById('descricao').value);

      const fotoInput = document.getElementById('avatarFile');
      if (fotoInput && fotoInput.files.length > 0) {
        formData.append('foto', fotoInput.files[0]);
      }

      try {
        const res = await fetch('/deuPetWeb/backend/cadastrar_usuario.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        spinner.style.display = 'none';
        if (res.ok && data.sucesso) {
          window.location.href = 'login.html';
        } else {
          alerts.innerHTML = `<div class="alert alert-danger">${data.erro || 'Erro ao cadastrar.'}</div>`;
        }
      } catch (err) {
        spinner.style.display = 'none';
        alerts.innerHTML = `<div class="alert alert-danger">Erro de conexão com o servidor.</div>`;
      }
    });
  }
});