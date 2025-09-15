$(function () {
    let images = [];
    let imageFiles = [];

    if (!window.usuarioId) {
        window.usuarioId = localStorage.getItem('user_id');
    }

    const spinner = document.getElementById('loadingSpinner');

    updateBreedOptions();
    const today = new Date().toISOString().split('T')[0];
    $('#birthdate').attr('max', today);
    
    $('#species').on('change', () => updateBreedOptions());

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
                renderImages(images);
            };
            reader.readAsDataURL(file);
        });
        $(this).val('');
    });

    $('#imagePreviewRow').on('click', '.remove-img-btn', function () {
        const idx = $(this).data('idx');
        images.splice(idx, 1);
        imageFiles.splice(idx, 1);
        renderImages(images);
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

    $('#petForm').on('submit', function (e) {
        e.preventDefault();

        let valid = true;
        const requiredFields = [
            'petName', 'birthdate', 'species', 'breed', 'size', 'sex',
            'temperament', 'health', 'cep', 'logradouro', 'bairro', 'cidade', 'estado',
            'specialNeeds', 'history'
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

        if (!images || images.length === 0) {
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
        formData.append('nome', $('#petName').val());
        formData.append('data_de_nascimento', $('#birthdate').val());
        formData.append('especie', $('#species').val());
        formData.append('raca', $('#breed').val());
        formData.append('porte', $('#size').val());
        formData.append('sexo', $('#sex').val());
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
        formData.append('voluntario_id', window.usuarioId);

        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('imagens[]', imageFiles[i]);
        }

        spinner.style.display = 'flex'; 

        $.ajax({
            url: '/deuPetWeb/backend/cadastrar_pet.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (resp) {
                spinner.style.display = 'none';
                if (typeof resp === 'string') {
                    try { resp = JSON.parse(resp); } catch (e) {}
                }
                if (resp.sucesso) {
                    showToast('Pet cadastrado com sucesso!');
                    $('#petForm')[0].reset();
                    images = [];
                    imageFiles = [];
                    renderImages(images);
                } else {
                    showToast('Erro ao cadastrar pet!');
                }
            },
            error: function () {
                spinner.style.display = 'none';
                showToast('Erro ao conectar com o servidor!');
            }
        });
    });
});