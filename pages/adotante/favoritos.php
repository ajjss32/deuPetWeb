<?php require_once '../../backend/verifica_login.php'; ?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/card.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <title>Favoritos</title>
</head>
<body>
    <div class="menu">
        <nav>
            <a href="../adotante/listar-pets.php">Adotar</a>
            <a href="../adotante/favoritos.php" class="active">Favoritos</a>
            <a href="../chat.php">Chat</a>
            <a href="../editarperfil.php">Perfil</a>
            <a href="../login.html" id="login-link">Sair</a>
        </nav>
    </div>
    
<div id="title"><h2 class="title">Favoritos</h2></div>
    <main id="favoritos-container" class="d-flex justify-content-center align-items-center">
         
    </main>

    <script src="../../script/favoritos.js"></script>
    <div id="toast-message" class="toast-container"></div>
    <script src="../../script/home_voluntario.js"></script>
</body>
</html>