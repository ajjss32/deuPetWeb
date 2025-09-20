<?php require_once '../../backend/verifica_login.php'; ?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adotar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/listar-pets.css">
</head>
<body>

    <div class="menu">
        <nav>
            <a href="../adotante/listar-pets.php" class="active">Adotar</a>
            <a href="../adotante/favoritos.php">Favoritos</a>
            <a href="../chat.php">Chat</a>
            <a href="../editarperfil.php">Perfil</a>
            <a href="#" id="login-link">Sair</a>
        </nav>
    </div>

    <main class="container d-flex flex-column justify-content-center align-items-center flex-grow-1 py-4">
        
        <div id="no-pets-message" class="d-none text-center p-5">
            <i class="bi-emoji-frown" style="font-size: 4rem; color: #6c757d;"></i>
            <h3 class="mt-4">Nenhum animal disponível no momento</h3>
            <p class="text-muted">Por favor, volte mais tarde. Novos amiguinhos chegam sempre!</p>
        </div>

        <div class="filter-container w-100 mb-3">
            <div class="accordion" id="filterAccordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            <i class="bi bi-funnel-fill me-2"></i> Filtrar
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#filterAccordion">
                        <div class="accordion-body">
                            <form id="filterForm" class="row g-3">
                                <div class="col-md-6 col-lg-4">
                                    <label for="filterSpecies" class="form-label">Espécie</label>
                                    <select id="filterSpecies" class="form-select"></select>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <label for="filterBreed" class="form-label">Raça</label>
                                    <select id="filterBreed" class="form-select" disabled>
                                        <option value="">Selecione a espécie</option>
                                    </select>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <label for="filterGender" class="form-label">Sexo</label>
                                    <select id="filterGender" class="form-select"></select>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <label for="filterSize" class="form-label">Porte</label>
                                    <select id="filterSize" class="form-select"></select>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <label for="filterTemperament" class="form-label">Temperamento</label>
                                    <select id="filterTemperament" class="form-select"></select>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <label for="filterSpecialNeeds" class="form-label">Necessidades Especiais</label>
                                    <select id="filterSpecialNeeds" class="form-select"></select>
                                </div>
                                <div class="col-12 d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" id="clearFiltersBtn" class="btn btn-secondary">Limpar</button>
                                    <button type="submit" class="btn btn-primary">Aplicar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="content-wrapper">
            <div class="swipe-card-wrapper">
                <div id="card-deck" class="card-deck"></div>
            </div>

            <div id="no-more-cards" class="no-more-cards d-none">
                <i class="bi bi-search-heart"></i>
                <h3>Nenhum pet encontrado</h3>
                <p>Tente alterar os filtros ou limpar a busca.</p>
            </div>
            
            <div id="card-actions" class="swipe-actions mt-4">
                <button id="rejectBtn" class="action-btn btn-reject">
                    <i class="bi bi-x-lg"></i>
                </button>
                <button id="likeBtn" class="action-btn btn-like">
                    <i class="bi bi-heart-fill"></i>
                </button>
            </div> 
        </div>

    </main>

    <footer class="bg-dark text-white text-center p-3">
        <p class="m-0">&copy; 2025 - Desenvolvimento Web I. Todos os direitos reservados.</p>
    </footer>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../script/listar-pets.js"></script>
    <script src="../../script/logout.js"></script>
</body>
</html>