<?php 
require_once '../../backend/verifica_login.php'; 
require_once '../../backend/pet.php';
require_once '../../backend/conexao.php';

$voluntario_id = $_SESSION['usuario_id'];

$pet = new Pet();
$pets_cadastrados = $pet->listarPetsPorVoluntario($voluntario_id);
?>
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
            <a href="../voluntario/interessados.php" >Interessados</a>
            <a href="../chat.php">Chat</a>
            <a href="../editarperfil.php">Perfil</a>
            <a href="../login.html" id="login-link">Sair</a>
        </nav>
    </div>
    <div id="title"><h2 class="title">Animais Cadastrados</h2></div>
    <main>
        <?php if (empty($pets_cadastrados)): ?>
            <div class="empty-state">
                <h3>Você ainda não cadastrou nenhum pet.</h3>
                <p>Clique em "Adicionar Pet" para começar.</p>
            </div>
        <?php else: ?>
            <div class="pet-grid">
                <?php foreach ($pets_cadastrados as $pet): ?>
                    <?php
                        // Calcule a idade do pet a partir da data de nascimento
                        $nascimento = new DateTime($pet['data_de_nascimento']);
                        $hoje = new DateTime();
                        $idade = $nascimento->diff($hoje);
                        $idadeFormatada = $idade->y > 0 ? $idade->y . ' ano(s)' : $idade->m . ' mês(es)';
                    ?>
                    <section class="card">
                        <b><?php echo htmlspecialchars($pet['status']); ?></b>
                        <img src="<?php echo htmlspecialchars($pet['foto']); ?>" alt="Foto do pet <?php echo htmlspecialchars($pet['nome']); ?>">
                        <p>
                            <?php echo htmlspecialchars($pet['nome']); ?>, <?php echo htmlspecialchars($idadeFormatada); ?>
                            <a href="../voluntario/editar-pet.php?id=<?php echo htmlspecialchars($pet['id']); ?>">
                                <i class="bi bi-pencil-square edit-icon"></i>
                            </a>
                        </p>
                    </section>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>
    <div id="toast-message" class="toast-container"></div>
    <script src="../../script/home_voluntario.js"></script>
</body>
</html>