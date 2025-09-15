<?php
require_once 'verifica_login.php';
require_once 'conexao.php';
require_once 'cloudinary.php';

$id = $_SESSION['usuario_id'];
$db = new Database();
$pdo = $db->getConnection();

$data = $_POST;
$fotoUrl = null;

if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
    $fotoUrl = uploadToCloudinary($_FILES['foto']['tmp_name'], $_FILES['foto']['name']);
}

$endereco = json_encode([
    'cep' => $data['cep'] ?? '',
    'logradouro' => $data['logradouro'] ?? '',
    'bairro' => $data['bairro'] ?? '',
    'cidade' => $data['cidade'] ?? '',
    'estado' => $data['estado'] ?? ''
]);

$senhaSql = '';
$params = [
    $data['nome'],
    $data['fone'],
    $data['data_nascimento'],
    $data['cpf_cnpj'],
    $endereco,
    $data['descricao'],
    $id
];

if (!empty($data['senha'])) {
    $senhaSql = ', senha = ?';
    $senhaHash = password_hash($data['senha'], PASSWORD_DEFAULT);
    array_splice($params, 5, 0, $senhaHash);
}

$fotoSql = '';
if ($fotoUrl) {
    $fotoSql = ', foto = ?';
    array_splice($params, -1, 0, $fotoUrl);
}

$sql = "UPDATE usuario SET nome = ?, telefone = ?, data_nascimento = ?, cpf_cnpj = ?, endereco = ?, descricao = ?$senhaSql$fotoSql WHERE id = ?";

$stmt = $pdo->prepare($sql);
$ok = $stmt->execute($params);

if ($ok) {
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao atualizar']);
}