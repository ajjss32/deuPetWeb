$(function () {
    let images = [];

    updateBreedOptions();
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
        $('#logradouro').val('Rua Exemplo');
        $('#bairro').val('Centro');
        $('#cidade').val('São Paulo');
        $('#estado').val('SP');
    });
    
    $('#petForm').on('submit', function (e) {
        e.preventDefault();
        
        function handleSuccess() {
            showToast('Pet cadastrado com sucesso!');
            this.reset();
            images = [];
            renderImages(images);
            this.classList.remove('was-validated');
            updateBreedOptions();
        }

        validateAndSubmit(this, images, handleSuccess.bind(this));
    });
});