<?php
require_once 'conexao.php';
require_once 'pet.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $pdo = $database->getConnection();

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

    if (!empty($_GET['adotante_id'])) {
        $sql = "SELECT pet_id FROM Favorito WHERE adotante_id = :adotante";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':adotante' => $_GET['adotante_id']]);
        $favoritados = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (!empty($favoritados)) {
            $pets = array_filter($pets, function($pet) use ($favoritados) {
                return !in_array($pet['id'], $favoritados);
            });
        }
    }

    echo json_encode(['sucesso' => true, 'pets' => array_values($pets)]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao listar pets: ' . $e->getMessage()]);
}
