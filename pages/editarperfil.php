<?php require_once '../backend/verifica_login.php'; ?>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/card.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <title>Editar Perfil</title>
</head>
<body>
    <div class="menu" id="menu-adotante">
        <nav>
            <a href="../pages/adotante/listar-pets.php">Adotar</a>
            <a href="../pages/adotante/favoritos.php">Favoritos</a>
            <a href="chat.php">Chat</a>
            <a href="editarperfil.php" class="active">Perfil</a>
            <a href="login.html" id="login-link">Sair</a>
        </nav>
    </div>

    <div class="menu" id="menu-voluntario">
        <nav>
            <a href="voluntario/home_voluntario.php">Animais Cadastrados</a>
            <a href="voluntario/cadastro-pet.php">Adicionar Pet</a>
            <a href="../pages/voluntario/interessados.php" >Interessados</a>
            <a href="chat.php">Chat</a>
            <a href="editarperfil.php" class="active">Perfil</a>
            <a href="login.html" id="login-link">Sair</a>
        </nav>
    </div>
<main class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="col-lg-6 col-md-8">
        <div class="title text-center mb-4">
            <h2>Editar perfil</h2>
        </div>
        <div id="alerts" class="mb-3"></div>
        <form id="editProfileForm">
            <div class="mb-4">
                <label class="form-label d-block">Foto de Perfil</label>
                <div class="d-flex align-items-center gap-3">
                <img id="avatarPreview" src="https://cdn.jsdelivr.net/gh/creotiv/files@main/avatar_placeholder.png" alt="Foto de perfil" class="rounded-circle border shadow-sm" width="96" height="96">
                <div>
                    <input type="file" id="avatarFile" accept="image/*" class="form-control">
                    <div class="form-text">Opcional. PNG ou JPG de até 10MB.</div>
                </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="nome" class="form-label">Nome completo</label>
                <input type="text" class="form-control" id="nome" maxlength="40">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" readonly>
            </div>
            <div class="mb-3">
                <label for="senha" class="form-label">Nova Senha</label>
                <input type="password" class="form-control" id="senha" minlength="6" placeholder="Deixe em branco para não alterar">
            </div>
            <div class="mb-3">
                <label for="fone" class="form-label">Telefone</label>
                <input type="tel" class="form-control" id="fone">
            </div>
            <div class="mb-3">
                <label for="nasc" class="form-label">Data de Nascimento</label>
                <input type="date" class="form-control" id="nasc">
            </div>
            <div class="mb-3">
                <label for="cpfCnpj" class="form-label">CPF/CNPJ</label>
                <input type="text" class="form-control" id="cpfCnpj" readonly>
            </div>
            <div class="mb-3">
                <label for="cep" class="form-label">CEP</label>
                <div class="input-group">
                <input type="text" class="form-control" id="cep" placeholder="00000-000" required>
                <button class="btn btn-success" type="button" id="buscarCep">Buscar</button>
                </div>
            </div>
            <div class="mb-3">
                <label for="logradouro" class="form-label">Logradouro</label>
                <input type="text" class="form-control" id="logradouro" readonly>
            </div>
            <div class="row g-3">
                <div class="col-md-4">
                <label for="bairro" class="form-label">Bairro</label>
                <input type="text" class="form-control" id="bairro" readonly>
                </div>
                <div class="col-md-4">
                <label for="cidade" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="cidade" readonly>
                </div>
                <div class="col-md-4">
                <label for="estado" class="form-label">Estado</label>
                <input type="text" class="form-control" id="estado" readonly>
                </div>
            </div>
            <div class="mb-3">
                <label for="descricao" class="form-label">Descrição</label>
                <textarea class="form-control" id="descricao" rows="4"></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2 mt-4">
                <button type="submit" class="btn btn-primary">Salvar alterações</button>
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#meuModalID">
                    Excluir perfil
                </button>
            </div>
        </form>
    </div>
        </div>


        <div class="modal fade" id="meuModalID">
        <div class="modal-dialog">
            <div class="modal-content">
            
            <div class="modal-header">
            <h5 class="modal-title" id="tituloModal">Exclusão de perfil</h5>
            </div>

            <div class="modal-body">
            <p>Se você continuar, seu perfil será totalmente excluído definitivamente.
                Você tem certeza que deseja continuar?
            </p>
            </div>

            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger">Excluir perfil</button>
            </div>
            </div>
        </div>
    </div>
    </main>
    
    <footer class="bg-dark text-white text-center p-3">
        <p>&copy; 2025 - Desenvolvimento Web I. Todos os direitos reservados.</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
    <script src="../script/menu.js"></script>
    <script src="../script/editar-perfil.js"></script>
</body>
</html>