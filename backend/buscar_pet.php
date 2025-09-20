<?php
require_once 'conexao.php';
header('Content-Type: application/json');
$pet_id = $_GET['pet_id'] ?? null;
if (!$pet_id) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Pet não informado']);
    exit;
}
try {
    $database = new Database();
    $pdo = $database->getConnection();
    $stmt = $pdo->prepare("SELECT nome FROM Pet WHERE id = :id");
    $stmt->execute([':id' => $pet_id]);
    $pet = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($pet) {
        echo json_encode(['sucesso' => true, 'pet' => $pet]);
    } else {
        echo json_encode(['sucesso' => false, 'mensagem' => 'Pet não encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['sucesso' => false, 'mensagem' => $e->getMessage()]);
}
?>