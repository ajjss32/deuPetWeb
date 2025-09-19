$(function () {
    let keepImages = [];
    let images = [];
    let imageFiles = [];
    let pet = null;

    const petId = new URLSearchParams(window.location.search).get('id');
    const petForm = $('#petForm');
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    const confirmDeleteBtn = $('#confirmDeleteBtn');

    function updateBreedOptions(selectedBreed = '') {
        if (typeof window.updateBreedOptions === 'function') {
            window.updateBreedOptions(selectedBreed);
        }
    }

    function renderImages() {
        const $row = $('#imagePreviewRow');
        $row.find('.image-grid').remove();

        keepImages.forEach((img, idx) => {
            const col = $(`
                <div class="col-4 col-sm-3 image-grid">
                    <button type="button" class="remove-img-btn" data-type="old" data-idx="${idx}">&times;</button>
                    <img src="${img}" class="image-thumb" alt="Pet">
                </div>
            `);
            $row.prepend(col);
        });

        images.forEach((img, idx) => {
            const col = $(`
                <div class="col-4 col-sm-3 image-grid">
                    <button type="button" class="remove-img-btn" data-type="new" data-idx="${idx}">&times;</button>
                    <img src="${img}" class="image-thumb" alt="Pet">
                </div>
            `);
            $row.prepend(col);
        });
    }

    async function fetchPetData() {
        if (!petId) return;
        try {
            const res = await fetch(`/deuPetWeb/backend/editar-pet.php?id=${petId}`);
            const data = await res.json();
            if (res.ok && data.sucesso) {
                pet = data.dados;
                $('#petName').val(pet.nome);
                $('#status').val(pet.status);
                $('#species').val(pet.especie).change();
                updateBreedOptions(pet.raca);
                $('#birthdate').val(pet.data_de_nascimento);
                $('#sex').val(pet.sexo);
                $('#size').val(pet.porte);
                $('#temperament').val(pet.temperamento);
                $('#health').val(pet.estado_de_saude);

                let endereco = {};
                try { endereco = pet.endereco ? JSON.parse(pet.endereco) : {}; } catch (e) {}
                $('#cep').val(endereco.cep || '');
                $('#logradouro').val(endereco.logradouro || '');
                $('#bairro').val(endereco.bairro || '');
                $('#cidade').val(endereco.cidade || '');
                $('#estado').val(endereco.estado || '');

                $('#specialNeeds').val(pet.necessidades);
                $('#history').val(pet.historia);

                keepImages = pet.fotos || [];
                images = [];
                imageFiles = [];
                renderImages();
            } else {
                alert('Erro ao carregar dados do pet.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        }
    }

    fetchPetData();

    $('#addPhotoBtn').on('click', () => $('#imageInput').click());
    $('#imageInput').on('change', function (e) {
        const files = Array.from(e.target.files);
        let valid = true;
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                $('#imgError').removeClass('d-none').text('Cada imagem deve ter no máximo 10MB.');
                valid = false;
            }
        });
        if (!valid) {
            $(this).val('');
            return;
        }
        $('#imgError').addClass('d-none');
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                images.push(ev.target.result);
                imageFiles.push(file);
                renderImages();
            };
            reader.readAsDataURL(file);
        });
        $(this).val('');
    });

    $('#imagePreviewRow').on('click', '.remove-img-btn', function () {
        const idx = $(this).data('idx');
        const type = $(this).data('type');
        if (type === 'old') {
            keepImages.splice(idx, 1);
        } else {
            images.splice(idx, 1);
            imageFiles.splice(idx, 1);
        }
        renderImages();
    });

    $('#buscarCepBtn').on('click', async function () {
        const cep = ($('#cep').val() || '').replace(/\D/g, '');
        $('#cepError').addClass('d-none').text('');
        if (cep.length !== 8) {
            $('#cepError').removeClass('d-none').text('CEP inválido.');
            return;
        }
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                $('#cepError').removeClass('d-none').text('CEP não encontrado.');
                return;
            }
            $('#cepError').addClass('d-none').text('');
            $('#logradouro').val(data.logradouro || '');
            $('#bairro').val(data.bairro || '');
            $('#cidade').val(data.localidade || '');
            $('#estado').val(data.uf || '');
        } catch (err) {
            $('#cepError').removeClass('d-none').text('Erro ao buscar CEP.');
        }
    });

    petForm.on('submit', async function (e) {
        e.preventDefault();
        let valid = true;
        const requiredFields = [
            'petName', 'birthdate', 'species', 'breed', 'size', 'sex', 'temperament', 'health',
            'cep', 'logradouro', 'bairro', 'cidade', 'estado', 'specialNeeds', 'history'
        ];
        requiredFields.forEach(id => {
            const el = $('#' + id);
            if (!el.val() || el.val() === '' || el.val() === null) {
                el.addClass('is-invalid');
                valid = false;
            } else {
                el.removeClass('is-invalid');
            }
        });
        const cep = ($('#cep').val() || '').replace(/\D/g, '');
        if (cep.length !== 8) {
            $('#cep').addClass('is-invalid');
            $('#cepError').removeClass('d-none').text('CEP inválido.');
            valid = false;
        } else {
            $('#cep').removeClass('is-invalid');
            $('#cepError').addClass('d-none').text('');
        }
        if ((keepImages.length + imageFiles.length) === 0) {
            $('#imgError').removeClass('d-none').text('Selecione ao menos uma imagem!');
            valid = false;
        } else {
            $('#imgError').addClass('d-none');
        }
        if (!valid) {
            $('.is-invalid').first()[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const formData = new FormData();
        formData.append('id', petId);
        formData.append('nome', $('#petName').val());
        formData.append('status', $('#status').val());
        formData.append('especie', $('#species').val());
        formData.append('raca', $('#breed').val());
        formData.append('data_de_nascimento', $('#birthdate').val());
        formData.append('sexo', $('#sex').val());
        formData.append('porte', $('#size').val());
        formData.append('temperamento', $('#temperament').val());
        formData.append('estado_de_saude', $('#health').val());
        const endereco = {
            cep: $('#cep').val(),
            logradouro: $('#logradouro').val(),
            bairro: $('#bairro').val(),
            cidade: $('#cidade').val(),
            estado: $('#estado').val()
        };
        formData.append('endereco', JSON.stringify(endereco));
        formData.append('necessidades', $('#specialNeeds').val());
        formData.append('historia', $('#history').val());
        formData.append('keepImages', JSON.stringify(keepImages));
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('imagens[]', imageFiles[i]);
        }

        try {
            const res = await fetch('/deuPetWeb/backend/editar-pet.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.sucesso) {
                showToast('Pet atualizado com sucesso!');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showToast(data.erro || 'Erro ao atualizar o pet!');
            }
        } catch (err) {
            showToast('Erro de conexão com o servidor!');
        }
    });

    confirmDeleteBtn.on('click', async () => {
        try {
            const res = await fetch('/deuPetWeb/backend/editar-pet.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: petId })
            });
            const data = await res.json();
            console.log(data);
            if (res.ok && data.sucesso) {
                localStorage.setItem('petStatus', 'deleted');
                window.location.href = './home_voluntario.php';
            } else {
                showToast(data.erro || 'Erro ao excluir o pet.');
            }
        } catch (err) {
            showToast('Erro de conexão com o servidor.');
        } finally {
            deleteConfirmationModal.hide();
        }
    });

    function showToast(msg) {
        let toast = $('#toast-message');
        if (!toast.length) {
            toast = $('<div id="toast-message" class="toast-container"></div>').appendTo('body');
        }
        toast.text(msg).addClass('show');
        setTimeout(() => toast.removeClass('show'), 3000);
    }
});