<?php
require_once 'verifica_login.php';
require_once 'conexao.php';
header('Content-Type: application/json');

$id = $_SESSION['usuario_id'];
$db = new Database();
$pdo = $db->getConnection();
$stmt = $pdo->prepare("DELETE FROM usuario WHERE id = ?");

if ($stmt->execute([$id])) {
    session_destroy();
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao excluir usuário']);
}
?>