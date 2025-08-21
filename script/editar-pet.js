$(function () {
    let images = [
        '../../assets/img/pet.png',
    ];
    const initialBreed = "Sem raça definida";

    updateBreedOptions(initialBreed);
    renderImages(images);
    const today = new Date().toISOString().split('T')[0];
    $('#birthdate').attr('max', today);

    $('#species').on('change', () => updateBreedOptions());

    $('#addPhotoBtn').on('click', () => $('#imageInput').click());

    $('#imageInput').on('change', function (e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                images.push(ev.target.result);
                renderImages(images);
            };
            reader.readAsDataURL(file);
        });
        $(this).val('');
        $('#imgError').addClass('d-none');
    });

    $('#imagePreviewRow').on('click', '.remove-img-btn', function () {
        const idx = $(this).data('idx');
        images.splice(idx, 1);
        renderImages(images);
    });
    
    $('#buscarCepBtn').on('click', function () {
        $('#logradouro').val('Rua Exemplo Alterada');
        $('#bairro').val('Bairro Novo');
        $('#cidade').val('Outra Cidade');
        $('#estado').val('OS');
    });

    $('#petForm').on('submit', function (e) {
        e.preventDefault();
        
        function handleSuccess() {
            showToast('Pet atualizado com sucesso!');
            this.classList.remove('was-validated');
        }

        validateAndSubmit(this, images, handleSuccess.bind(this));
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const confirmDeleteButton = document.getElementById('confirmDeleteBtn');

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function() {
            localStorage.setItem('petStatus', 'deleted');
            window.location.href = '../voluntario/home_voluntario.html';
        });
    }
});