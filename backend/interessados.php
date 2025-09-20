<?php
require_once 'conexao.php';
header('Content-Type: application/json');

try {
    $database = new Database();
    $pdo = $database->getConnection();

    $pet_id = $_GET['pet_id'] ?? null;
    if (!$pet_id) {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Pet não informado']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT 
            u.id, u.nome, u.foto, u.descricao, u.endereco
        FROM Favorito f
        INNER JOIN Usuario u ON f.adotante_id = u.id
        WHERE f.pet_id = :pet_id
    ");
    $stmt->execute([':pet_id' => $pet_id]);
    $interessados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($interessados as &$user) {
        $endereco = json_decode($user['endereco'], true);
        $user['cidade'] = $endereco['cidade'] ?? '';
        unset($user['endereco']);

        $matchStmt = $pdo->prepare("SELECT 1 FROM MatchPet WHERE adotante_id = :adotante_id AND pet_id = :pet_id AND status = 'match' LIMIT 1");
        $matchStmt->execute([
            ':adotante_id' => $user['id'],
            ':pet_id' => $pet_id
        ]);
        $user['match'] = $matchStmt->fetchColumn() ? true : false;
    }

    echo json_encode(['sucesso' => true, 'interessados' => $interessados]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao listar interessados: ' . $e->getMessage()]);
}
?>