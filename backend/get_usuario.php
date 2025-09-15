<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'verifica_login.php';
require_once 'conexao.php';

$id = $_SESSION['usuario_id'];
$db = new Database();
$pdo = $db->getConnection();

$stmt = $pdo->prepare("SELECT nome, email, telefone, data_nascimento, cpf_cnpj, tipo, foto, endereco, descricao FROM usuario WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $endereco = json_decode($user['endereco'], true);
    $user['cep'] = $endereco['cep'] ?? '';
    $user['logradouro'] = $endereco['logradouro'] ?? '';
    $user['bairro'] = $endereco['bairro'] ?? '';
    $user['cidade'] = $endereco['cidade'] ?? '';
    $user['estado'] = $endereco['estado'] ?? '';
    unset($user['endereco']);
    echo json_encode(['sucesso' => true, 'usuario' => $user]);
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Usuário não encontrado']);
}