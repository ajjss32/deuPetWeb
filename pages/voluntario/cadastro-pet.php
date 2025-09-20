<?php require_once '../../backend/verifica_login.php'; ?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/form-pet.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <title>Adicionar Pet</title>
</head>
<body>
    <div class="menu">
        <nav>
            <a href="../voluntario/home_voluntario.php">Animais Cadastrados</a>
            <a href="../voluntario/cadastro-pet.php" class="active">Adicionar Pet</a>
            <a href="../chat.php">Chat</a>
            <a href="../editarperfil.php">Perfil</a>
            <a href="#" id="login-link">Sair</a>
        </nav>
    </div>
    <main class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
                <div>
                    <div>
                        <div class="title">
                            <h2>Adicionar Pet</h2>
                        </div>
                        <form id="petForm" novalidate>
                            <div class="mb-4">
                                <label class="form-label">Imagens do Pet</label>
                                <div class="row g-2" id="imagePreviewRow">
                                    <div class="col-4 col-sm-3">
                                        <div class="add-photo" id="addPhotoBtn">
                                            <span class="bi bi-plus-lg"></span>
                                            <span class="visually-hidden">Adicionar foto</span>
                                        </div>
                                        <input type="file" id="imageInput" accept="image/*" multiple style="display:none">
                                    </div>
                                </div>
                                <div class="form-text text-danger d-none" id="imgError">Selecione ao menos uma imagem!</div>
                            </div>
                            <div class="mb-3">
                                <label for="petName" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="petName" required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="species" class="form-label">Espécie</label>
                                <select class="form-select" id="species" required>
                                    <option value="" disabled selected>Selecione</option>
                                    <option>Canino</option>
                                    <option>Felino</option>
                                </select>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="breed" class="form-label">Raça</label>
                                <select class="form-select" id="breed" required disabled>
                                    <option value="">Selecione a espécie primeiro</option>
                                </select>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="birthdate" class="form-label">Data de Nascimento</label>
                                <input type="date" class="form-control" id="birthdate" required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6 mb-3 mb-md-0">
                                    <label for="sex" class="form-label">Sexo</label>
                                    <select class="form-select" id="sex" required>
                                        <option value="" disabled selected>Selecione</option>
                                        <option>Macho</option>
                                        <option>Fêmea</option>
                                    </select>
                                    <div class="invalid-feedback">Campo obrigatório!</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="size" class="form-label">Porte</label>
                                    <select class="form-select" id="size" required>
                                        <option value="" disabled selected>Selecione</option>
                                        <option>Pequeno</option>
                                        <option>Médio</option>
                                        <option>Grande</option>
                                    </select>
                                    <div class="invalid-feedback">Campo obrigatório!</div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="temperament" class="form-label">Temperamento</label>
                                <select class="form-select" id="temperament" required>
                                    <option value="" disabled selected>Selecione</option>
                                    <option>Calmo</option>
                                    <option>Agitado</option>
                                    <option>Brincalhão</option>
                                    <option>Tímido</option>
                                </select>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="health" class="form-label">Estado de Saúde</label>
                                <input type="text" class="form-control" id="health" required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="row mb-4">
                                <div class="col-8">
                                    <label for="cep" class="form-label">CEP</label>
                                    <input type="text" class="form-control" id="cep" required pattern="\d{5}-?\d{3}">
                                    <div class="invalid-feedback">Campo obrigatório!</div>
                                    <div id="cepError" class="form-text text-danger d-none"></div>
                                </div>
                                <div class="col-4 d-flex align-items-end">
                                    <button type="button" class="btn btn-success w-100" id="buscarCepBtn">Buscar</button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="logradouro" class="form-label">Logradouro</label>
                                <input type="text" class="form-control" id="logradouro" readonly required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="bairro" class="form-label">Bairro</label>
                                <input type="text" class="form-control" id="bairro" readonly required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="cidade" class="form-label">Cidade</label>
                                <input type="text" class="form-control" id="cidade" readonly required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="estado" class="form-label">Estado</label>
                                <input type="text" class="form-control" id="estado" readonly required>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="specialNeeds" class="form-label">Possui Necessidades Especiais?</label>
                                <select class="form-select" id="specialNeeds" required>
                                    <option value="" disabled selected>Selecione</option>
                                    <option>Sim</option>
                                    <option>Não</option>
                                </select>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="mb-3">
                                <label for="history" class="form-label">História</label>
                                <textarea class="form-control" id="history" rows="2" required></textarea>
                                <div class="invalid-feedback">Campo obrigatório!</div>
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-success btn-lg">Cadastrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer class="bg-dark text-white text-center p-3">
        <p>&copy; 2025 - Desenvolvimento Web I. Todos os direitos reservados.</p>
    </footer>
    <div id="toast-message" class="toast-container">
        Pet cadastrado com sucesso!
    </div>
    <div id="loadingSpinner" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:rgba(255,255,255,0.7);align-items:center;justify-content:center;">
      <div class="spinner-border text-success" style="width: 4rem; height: 4rem;" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../script/form-pet.js"></script>
    <script src="../../script/cadastro-pet.js"></script>
    <script src="../../script/logout.js"></script>
</body>
</html>