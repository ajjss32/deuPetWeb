$(document).ready(function() {
    const cardDeck = $('#card-deck');
    let allPets = [];
    let currentPets = [];
    let activeCard = null;
    let startX = 0, currentX = 0;
    let isDragging = false, isMouseDown = false;

    // Mapeia as raças por espécie
    const breeds = {
        'Canino': [
            'Sem raça definida', 'Labrador', 'Bulldog', 'Pinscher', 'Beagle', 'Poodle', 'Chihuahua', 'Rottweiler', 'Dachshund', 'Boxer', 'Pastor Alemão', 'Golden Retriever', 'Shih Tzu', 'Cocker Spaniel', 'Pug', 'Border Collie', 'Akita', 'Husky Siberiano', 'São Bernardo', 'Maltês', 'Schnauzer', 'Spitz Alemão', 'Buldogue Francês', 'Dálmata', 'Basset Hound', 'Shiba Inu', 'Outra'
        ],
        'Felino': [
            'Sem raça definida', 'Siamês', 'Persa', 'Maine Coon', 'Ragdoll', 'Bengal', 'Sphinx', 'Outra'
        ]
    };
    
    // Filtros
    const filterOptions = {
        species: ['Canino', 'Felino'],
        size: ['Pequeno', 'Médio', 'Grande'],
        gender: ['Macho', 'Fêmea'],
        temperament: ['Calmo', 'Agitado', 'Brincalhão', 'Tímido'],
        specialNeeds: ['Sim', 'Não']
    };

    // Função para calcular a idade do pet
    function getAge(birthDate) {
        const today = new Date();
        const petBirth = new Date(birthDate);
        let age = today.getFullYear() - petBirth.getFullYear();
        const m = today.getMonth() - petBirth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < petBirth.getDate())) {
            age--;
        }
        return age > 1 ? `${age} anos` : `${age} ano`;
    }

    // Função para buscar e carregar os pets da API
    async function fetchAndLoadPets(filters = {}) {
        const urlParams = new URLSearchParams(filters).toString();
        try {
            const res = await fetch(`../../backend/listar-pets.php?${urlParams}`);
            const data = await res.json();
            if (res.ok && data.sucesso) {
                allPets = data.pets;
                currentPets = [...allPets];
                loadCards(currentPets);
            } else {
                console.error('Erro ao carregar pets:', data.erro);
                showNoMoreCards(true);
            }
        } catch (err) {
            console.error('Erro de conexão com o servidor ao carregar pets:', err);
            showNoMoreCards(true);
        }
    }

    // Botão de like
    $('#likeBtn').on('click', function() {
        const pet = getTopPet();
        if (pet) salvarFavorito(pet);
        if (cardDeck.children().last().length) dismissCard(cardDeck.children().last(), 'right');
    });

    // Botão de rejeitar
    $('#rejectBtn').on('click', function() {
        if (cardDeck.children().last().length) dismissCard(cardDeck.children().last(), 'left');
    });

    function getTopPet() {
        const idx = cardDeck.children().length - 1;
        if (idx < 0) return null;
        const petName = cardDeck.children().eq(idx).find('.card-title').text().split(',')[0].trim();
        return allPets.find(p => p.name === petName);
    }
    
    function salvarFavorito(pet) {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        if (!favoritos.some(fav => fav.id === pet.id)) {
            favoritos.push(pet);
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
        }
    }

    // Filtros dinâmicos
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
            especie: $('#filterSpecies').val(),
            raca: $('#filterBreed').val(),
            sexo: $('#filterGender').val(),
            porte: $('#filterSize').val(),
            temperamento: $('#filterTemperament').val(),
            necessidades: $('#filterSpecialNeeds').val()
        };
        fetchAndLoadPets(filters);
        $('#collapseOne').removeClass('show');
    });

    $('#clearFiltersBtn').on('click', function() {
        $('#filterForm')[0].reset();
        $('#filterBreed').prop('disabled', true).html('<option value="">Selecione a espécie</option>');
        fetchAndLoadPets();
        $('#collapseOne').removeClass('show');
    });

    // Carregar cards
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

    // Criar card
    function createCard(pet) {
        const age = getAge(pet.data_de_nascimento);
        return `
        <div class="swipe-card" data-pet-id="${pet.id}">
            <img src="${pet.foto}" class="card-img-top" alt="${pet.nome}">
            <div class="card-img-overlay text-white">
                <div class="status-badge badge-like" style="opacity:0;">LIKE</div>
                <div class="status-badge badge-nope" style="opacity:0;">NOPE</div>
                <div>
                    <h2 class="card-title">${pet.nome}, ${age}</h2>
                    <p class="card-text">${pet.historia}</p>
                </div>
            </div>
        </div>
        `;
    }

    // === Código de Swipe ===
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
        startX = 0;
        currentX = 0;
    });

    function dismissCard(card, direction) {
        if (direction === 'right') {
            card.find('.badge-like').css('opacity', 1);
            // Salva no Match ou Favoritos
        } else {
            card.find('.badge-nope').css('opacity', 1);
            // Salva no Rejeição
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

    function displayNoPetsAvailableMessage() {
        $('.filter-container').hide();
        $('.content-wrapper').hide();
        $('#no-pets-message').removeClass('d-none');
        $('main').addClass('justify-content-center');
    }

    // Inicialização
    populateFilters();
    fetchAndLoadPets();
});