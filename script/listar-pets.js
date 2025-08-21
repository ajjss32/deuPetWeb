$(document).ready(function() {
    const allPets = [
        { name: 'Bob', age: '2 anos', story: 'Adora brincar e correr no parque.', image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', species: 'Canino', size: 'Médio', gender: 'Macho', breed: 'Beagle', temperament: 'Brincalhão', specialNeeds: 'Não' },
        { name: 'Mel', age: '5 anos', story: 'Uma companheira leal e calma.', image: 'https://images.pexels.com/photos/4587959/pexels-photo-4587959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', species: 'Felino', size: 'Pequeno', gender: 'Fêmea', breed: 'Sem raça definida', temperament: 'Calmo', specialNeeds: 'Não' },
        { name: 'Thor', age: '1 ano', story: 'Cheio de energia e muito inteligente.', image: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', species: 'Canino', size: 'Grande', gender: 'Macho', breed: 'Golden Retriever', temperament: 'Agitado', specialNeeds: 'Não' },
        { name: 'Miau', age: '2 anos', story: 'Independente e carinhoso nas horas vagas.', image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', species: 'Felino', size: 'Pequeno', gender: 'Macho', breed: 'Siamês', temperament: 'Tímido', specialNeeds: 'Sim' },
        { name: 'Frajola', age: '4 anos', story: 'Um mestre na arte de tirar sonecas ao sol.', image: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', species: 'Felino', size: 'Médio', gender: 'Macho', breed: 'Sem raça definida', temperament: 'Calmo', specialNeeds: 'Não' },
        { name: 'Max', age: '4 anos', story: 'Um aventureiro nato, adora trilhas.', image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', species: 'Canino', size: 'Médio', gender: 'Macho', breed: 'Pastor Alemão', temperament: 'Agitado', specialNeeds: 'Não' }
    ];

    function displayNoPetsAvailableMessage() {
        $('.filter-container').hide();
        $('.content-wrapper').hide();
        $('#no-pets-message').removeClass('d-none');
        $('main').addClass('justify-content-center');
    }

    if (!allPets || allPets.length === 0) {
        displayNoPetsAvailableMessage();
        return;
    }

    const filterOptions = {
        species: ['Canino', 'Felino'],
        size: ['Pequeno', 'Médio', 'Grande'],
        gender: ['Macho', 'Fêmea'],
        temperament: ['Calmo', 'Agitado', 'Brincalhão', 'Tímido'],
        specialNeeds: ['Sim', 'Não']
    };
    
    const breeds = {
        'Canino': ['Sem raça definida', 'Labrador', 'Bulldog', 'Pinscher', 'Beagle', 'Poodle', 'Chihuahua', 'Rottweiler', 'Dachshund', 'Boxer', 'Pastor Alemão', 'Golden Retriever', 'Shih Tzu', 'Cocker Spaniel', 'Pug', 'Border Collie', 'Akita', 'Husky Siberiano', 'São Bernardo', 'Maltês', 'Schnauzer', 'Spitz Alemão', 'Buldogue Francês', 'Dálmata', 'Basset Hound', 'Shiba Inu', 'Outra'],
        'Felino': ['Sem raça definida', 'Siamês', 'Persa', 'Maine Coon', 'Ragdoll', 'Bengal', 'Sphinx', 'Outra']
    };

    let currentPets = [...allPets];
    const cardDeck = $('#card-deck');
    let activeCard = null;
    let startX = 0, currentX = 0;
    let isDragging = false, isMouseDown = false;
    
    function populateFilters() {
        for (const key in filterOptions) {
            const select = $(`#filter${key.charAt(0).toUpperCase() + key.slice(1)}`);
            select.html('<option value="">Todos</option>');
            filterOptions[key].forEach(value => {
                select.append(`<option value="${value}">${value}</option>`);
            });
        }
    }

    $('#filterSpecies').on('change', function() {
        const species = $(this).val();
        const $breedSelect = $('#filterBreed');
        $breedSelect.empty().append('<option value="">Todas</option>');

        if (species && breeds[species]) {
            breeds[species].forEach(breed => {
                $breedSelect.append(`<option value="${breed}">${breed}</option>`);
            });
            $breedSelect.prop('disabled', false);
        } else {
            $breedSelect.prop('disabled', true).html('<option value="">Selecione a espécie</option>');
        }
    });

    $('#filterForm').on('submit', function(e) {
        e.preventDefault();
        const filters = {
            species: $('#filterSpecies').val(),
            breed: $('#filterBreed').val(),
            gender: $('#filterGender').val(),
            size: $('#filterSize').val(),
            temperament: $('#filterTemperament').val(),
            specialNeeds: $('#filterSpecialNeeds').val()
        };

        currentPets = allPets.filter(pet => {
            return Object.keys(filters).every(key => {
                return !filters[key] || pet[key] === filters[key];
            });
        });
        
        loadCards(currentPets);
        $('#collapseOne').removeClass('show');
    });

    $('#clearFiltersBtn').on('click', function() {
        $('#filterForm')[0].reset();
        $('#filterBreed').prop('disabled', true).html('<option value="">Selecione a espécie</option>');
        currentPets = [...allPets];
        loadCards(currentPets);
        $('#collapseOne').removeClass('show');
    });

    function loadCards(petsToLoad) {
        cardDeck.empty();
        if (petsToLoad.length === 0) {
            showNoMoreCards(true);
            return;
        }
        showNoMoreCards(false);
        petsToLoad.forEach(pet => cardDeck.append(createCard(pet)));
        initSwipe();
    }
    
    function createCard(pet) {
        return `
            <div class="swipe-card">
                <img src="${pet.image}" class="card-img-top" alt="${pet.name}">
                <div class="card-img-overlay text-white">
                    <div class="status-badge badge-like">LIKE</div>
                    <div class="status-badge badge-nope">NOPE</div>
                    <div>
                        <h2 class="card-title">${pet.name}, ${pet.age}</h2>
                        <p class="card-text">${pet.story}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function initSwipe() {
        activeCard = cardDeck.children().last();
        if (activeCard.length) {
            activeCard.on('mousedown touchstart', e => {
                e.preventDefault();
                isMouseDown = true;
                startX = e.type === 'mousedown' ? e.pageX : e.originalEvent.touches[0].pageX;
            });
        }
    }
    
    $(document).on('mousemove touchmove', e => {
        if (!isMouseDown || !activeCard) return;
        if (!isDragging) {
            isDragging = true;
            activeCard.addClass('dragging');
        }
        
        currentX = e.type === 'mousemove' ? e.pageX : e.originalEvent.touches[0].pageX;
        const deltaX = currentX - startX, rotation = deltaX / 20;
        activeCard.css('transform', `translateX(${deltaX}px) rotate(${rotation}deg)`);
        if (deltaX > 20) activeCard.find('.badge-like').css('opacity', Math.min(deltaX / 100, 1));
        else if (deltaX < -20) activeCard.find('.badge-nope').css('opacity', Math.min(Math.abs(deltaX) / 100, 1));

    }).on('mouseup touchend', () => {
        if (!isMouseDown || !activeCard) return;

        if (isDragging) {
            activeCard.removeClass('dragging');
            const deltaX = currentX - startX;
            if (Math.abs(deltaX) > 100) {
                dismissCard(activeCard, deltaX > 0 ? 'right' : 'left');
            } else {
                activeCard.css('transform', '');
                activeCard.find('.status-badge').css('opacity', 0);
            }
        }
        
        isMouseDown = false;
        isDragging = false;
        startX = 0; currentX = 0;
    });

    function dismissCard(card, direction) {
        if (direction === 'right') {
            card.find('.badge-like').css('opacity', 1);
        } else {
            card.find('.badge-nope').css('opacity', 1);
        }
        
        card.addClass('dismissing');
        const endX = direction === 'right' ? 500 : -500, rotation = direction === 'right' ? 30 : -30;
        card.css('transform', `translateX(${endX}px) rotate(${rotation}deg)`);
        
        setTimeout(() => {
            card.remove();
            if (cardDeck.children().length > 0) {
                initSwipe();
            } else {
                displayNoPetsAvailableMessage();
            }
        }, 500);
    }
    
    function showNoMoreCards(show) {
        if (show) {
            $('.swipe-card-wrapper').hide();
            $('#card-actions').hide();
            $('#no-more-cards').removeClass('d-none');
        } else {
            $('.swipe-card-wrapper').show();
            $('#card-actions').show();
            $('#no-more-cards').addClass('d-none');
        }
    }

    $('#likeBtn').on('click', () => cardDeck.children().last().length && dismissCard(cardDeck.children().last(), 'right'));
    $('#rejectBtn').on('click', () => cardDeck.children().last().length && dismissCard(cardDeck.children().last(), 'left'));

    populateFilters();
    loadCards(currentPets);
});