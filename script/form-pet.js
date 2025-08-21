const breeds = {
    'Canino': [
        'Sem raça definida', 'Labrador', 'Bulldog', 'Pinscher', 'Beagle', 'Poodle', 'Chihuahua', 'Rottweiler', 'Dachshund', 'Boxer', 'Pastor Alemão', 'Golden Retriever', 'Shih Tzu', 'Cocker Spaniel', 'Pug', 'Border Collie', 'Akita', 'Husky Siberiano', 'São Bernardo', 'Maltês', 'Schnauzer', 'Spitz Alemão', 'Buldogue Francês', 'Dálmata', 'Basset Hound', 'Shiba Inu', 'Outra'
    ],
    'Felino': [
        'Sem raça definida', 'Siamês', 'Persa', 'Maine Coon', 'Ragdoll', 'Bengal', 'Sphynx', 'Outra'
    ]
};

function updateBreedOptions(selectedBreed = '') {
    const species = $('#species').val();
    const $breed = $('#breed');
    $breed.empty();
    
    if (!species) {
        $breed.append('<option value="" disabled selected>Selecione a espécie primeiro</option>');
        $breed.prop('disabled', true);
    } else {
        $breed.append(`<option value="" disabled ${!selectedBreed ? 'selected' : ''}>Selecione</option>`);
        breeds[species].forEach(b => {
            const isSelected = b === selectedBreed ? 'selected' : '';
            $breed.append(`<option ${isSelected}>${b}</option>`);
        });
        $breed.prop('disabled', false);
    }
}

function renderImages(images) {
    const $row = $('#imagePreviewRow');
    $row.find('.image-grid').remove();
    images.forEach((img, idx) => {
        const col = $(`
            <div class="col-4 col-sm-3 image-grid">
                <button type="button" class="remove-img-btn" data-idx="${idx}">&times;</button>
                <img src="${img}" class="image-thumb" alt="Pet">
            </div>
        `);
        $row.prepend(col);
    });
}

function showToast(message) {
    const toast = $('#toast-message');
    toast.text(message);
    toast.addClass('show');

    setTimeout(() => {
        toast.removeClass('show');
    }, 3000);
}

function validateAndSubmit(form, images, onSuccess) {
    form.classList.add('was-validated');
    let valid = true;

    if (images.length === 0) {
        $('#imgError').removeClass('d-none');
        valid = false;
    } else {
        $('#imgError').addClass('d-none');
    }
    
    if (!form.checkValidity()) {
        valid = false;
    }

    if (valid) {
        onSuccess();
    }
}