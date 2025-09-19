<?php
require_once 'conexao.php';

header('Content-Type: application/json');

$database = new Database();
$pdo = $database->getConnection();

$acao = $_POST['acao'] ?? null;
$adotanteId = $_POST['adotante_id'] ?? null;

if (!$adotanteId) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'ID do adotante é obrigatório']);
    exit;
}

try {
    if ($acao === 'salvar') {
        $petId = $_POST['pet_id'] ?? null;
        if (!$petId) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID do pet é obrigatório']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO Favorito (adotante_id, pet_id) VALUES (:adotante, :pet)
                               ON DUPLICATE KEY UPDATE pet_id = pet_id");
        $stmt->execute([
            ':adotante' => $adotanteId,
            ':pet' => $petId
        ]);

        echo json_encode(['sucesso' => true, 'mensagem' => 'Favorito salvo com sucesso']);
    } elseif ($acao === 'listar') {
        $stmt = $pdo->prepare("SELECT p.id, p.nome, p.especie, p.raca, p.sexo, p.porte, 
                                      p.temperamento, p.necessidades, p.data_de_nascimento, p.historia
                               FROM Favorito f
                               INNER JOIN Pet p ON f.pet_id = p.id
                               WHERE f.adotante_id = :adotante");
        $stmt->execute([':adotante' => $adotanteId]);
        $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['sucesso' => true, 'favoritos' => $favoritos]);
    } elseif ($acao === 'deletar') {
        $petId = $_POST['pet_id'] ?? null;
        if (!$petId) {
            echo json_encode(['sucesso' => false, 'mensagem' => 'ID do pet é obrigatório para deletar']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM Favorito WHERE adotante_id = :adotante AND pet_id = :pet");
        $stmt->execute([
            ':adotante' => $adotanteId,
            ':pet' => $petId
        ]);

        echo json_encode(['sucesso' => true, 'mensagem' => 'Favorito removido com sucesso']);

    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Ação inválida']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro no servidor: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
