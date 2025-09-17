<?php
require_once 'conexao.php';
require_once 'pet.php';

header('Content-Type: application/json');

try {
    $pet = new Pet();
    $filtro = [
        'especie' => $_GET['especie'] ?? null,
        'raca' => $_GET['raca'] ?? null,
        'sexo' => $_GET['sexo'] ?? null,
        'porte' => $_GET['porte'] ?? null,
        'temperamento' => $_GET['temperamento'] ?? null,
        'necessidades' => $_GET['necessidades'] ?? null
    ];
    $pets = $pet->listarPetsDisponiveis($filtro);
    echo json_encode(['sucesso' => true, 'pets' => $pets]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao listar pets: ' . $e->getMessage()]);
}
?>