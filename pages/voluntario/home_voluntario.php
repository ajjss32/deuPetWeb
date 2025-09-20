<?php require_once '../../backend/verifica_login.php'; ?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/card.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <title>Animais Cadastrados</title>
</head>
<body>
    <div class="menu">
        <nav>
            <a href="../voluntario/home_voluntario.php" class="active">Animais Cadastrados</a>
            <a href="../voluntario/cadastro-pet.php">Adicionar Pet</a>
            <a href="../chat.php">Chat</a>
            <a href="../editarperfil.php">Perfil</a>
            <a href="#" id="login-link">Sair</a>
        </nav>
    </div>
    <div id="title"><h2 class="title">Animais Cadastrados</h2></div>
    <main>
        <div id="pet-list"></div>
    </main>
    <div id="toast-message" class="toast-container"></div>
    <script src="../../script/home_voluntario.js"></script>
    <script src="../../script/logout.js"></script>
</body>
</html>