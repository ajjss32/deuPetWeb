$(function () {
    const petForm = $('#petForm');
    const deleteConfirmationModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    const confirmDeleteBtn = $('#confirmDeleteBtn');
    const petId = new URLSearchParams(window.location.search).get('id');

    // Mapeia as raças por espécie
    const speciesBreeds = {
        'Canino': ['Sem raça definida', 'Labrador', 'Golden Retriever', 'Pastor Alemão', 'Poodle', 'Outra'],
        'Felino': ['Sem raça definida', 'Siamês', 'Persa', 'Maine Coon', 'Sphynx', 'Outra']
    };

    // Função para atualizar as opções de raça
    function updateBreedOptions(selectedBreed = 'Sem raça definida') {
        const species = $('#species').val();
        const breeds = speciesBreeds[species] || [];
        const breedSelect = $('#breed');
        breedSelect.empty();
        breeds.forEach(breed => {
            const option = $('<option>').val(breed).text(breed);
            if (breed === selectedBreed) {
                option.prop('selected', true);
            }
            breedSelect.append(option);
        });
    }

    // Função para renderizar as imagens
    function renderImages(images) {
        const imageContainer = $('#imagePreviewRow');
        imageContainer.find('.pet-img-thumb, .remove-img-btn').remove();
        images.forEach((imgSrc, idx) => {
            const imgHtml = `
                <div class="col-4 col-sm-3 pet-img-thumb" style="background-image: url(${imgSrc})">
                    <button type="button" class="remove-img-btn" data-idx="${idx}">
                        <i class="bi bi-x-circle-fill"></i>
                    </button>
                </div>`;
            imageContainer.prepend(imgHtml);
        });
        $('#imgError').toggleClass('d-none', images.length > 0);
    }

    // Função para buscar os dados do pet e preencher o formulário
    const fetchPetData = async () => {
        if (!petId) {
            console.error('ID do pet não encontrado na URL.');
            return;
        }

        try {
            const res = await fetch(`../../backend/editar-pet.php?id=${petId}`);
            const data = await res.json();
            if (res.ok && data.sucesso) {
                const pet = data.dados;
                $('#petName').val(pet.nome);
                $('#status').val(pet.status);
                $('#species').val(pet.especie).change(); // Força a atualização da raça
                updateBreedOptions(pet.raca);
                $('#birthdate').val(pet.data_de_nascimento);
                $('#sex').val(pet.sexo);
                $('#size').val(pet.porte);
                $('#temperament').val(pet.temperamento);
                $('#health').val(pet.estado_de_saude);
                $('#cep').val(pet.cep);
                $('#logradouro').val(pet.logradouro);
                $('#bairro').val(pet.bairro);
                $('#cidade').val(pet.cidade);
                $('#estado').val(pet.estado);
                $('#specialNeeds').val(pet.necessidades);
                $('#history').val(pet.historia);
                
                // Renderiza as imagens do pet
                renderImages(pet.fotos);
            } else {
                console.error('Erro ao buscar dados do pet:', data.erro);
                alert('Erro ao carregar dados do pet.');
            }
        } catch (err) {
            console.error('Erro de conexão com o servidor ao buscar dados.', err);
            alert('Erro de conexão com o servidor.');
        }
    };

    // Carrega os dados do pet quando a página é carregada
    fetchPetData();

    // Eventos
    $('#species').on('change', () => updateBreedOptions());
    $('#addPhotoBtn').on('click', () => $('#imageInput').click());
    $('#imageInput').on('change', function (e) {
        // ... (código para adicionar imagem, como no seu original)
    });
    $('#imagePreviewRow').on('click', '.remove-img-btn', function () {
        // ... (código para remover imagem, como no seu original)
    });

    $('#buscarCepBtn').on('click', function () {
        // Implemente a chamada à API de CEP aqui
        // No momento, seu código tem valores fixos.
    });

    // Evento de envio do formulário
    petForm.on('submit', async (e) => {
        e.preventDefault();
        const dados = {
            id: petId,
            nome: $('#petName').val(),
            status: $('#status').val(),
            especie: $('#species').val(),
            raca: $('#breed').val(),
            data_de_nascimento: $('#birthdate').val(),
            sexo: $('#sex').val(),
            porte: $('#size').val(),
            temperamento: $('#temperament').val(),
            estado_de_saude: $('#health').val(),
            cep: $('#cep').val(),
            logradouro: $('#logradouro').val(),
            bairro: $('#bairro').val(),
            cidade: $('#cidade').val(),
            estado: $('#estado').val(),
            necessidades: $('#specialNeeds').val(),
            historia: $('#history').val()
        };

        try {
            const res = await fetch('../../backend/editar-pet.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const data = await res.json();
            if (res.ok && data.sucesso) {
                alert(data.mensagem);
                // Você pode recarregar a página ou redirecionar aqui
            } else {
                alert(data.erro || 'Erro ao atualizar o pet.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        }
    });

    confirmDeleteBtn.on('click', async () => {
        try {
            const res = await fetch('../../backend/editar-pet.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: petId })
            });
            const data = await res.json();
            if (res.ok && data.sucesso) {
                alert(data.mensagem);
                window.location.href = './home_voluntario.php';
            } else {
                alert(data.erro || 'Erro ao excluir o pet.');
            }
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        } finally {
            deleteConfirmationModal.hide();
        }
    });
});