<?php
require_once 'verifica_login.php';
require_once 'pet.php';

header('Content-Type: application/json');

$voluntario_id = $_SESSION['usuario_id'] ?? null;
if (!$voluntario_id) {
    echo json_encode(['sucesso' => false, 'mensagem' => 'Não autenticado']);
    exit;
}

$pet = new Pet();
$pets_cadastrados = $pet->listarPetsPorVoluntario($voluntario_id);

echo json_encode(['sucesso' => true, 'pets' => $pets_cadastrados]);