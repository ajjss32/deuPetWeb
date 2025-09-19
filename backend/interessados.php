<?php
require_once 'conexao.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $pdo = $database->getConnection();

    // Seleciona todos os favoritos com dados do adotante e do pet
    $stmt = $pdo->prepare("
        SELECT 
            u.id AS adotante_id,
            u.nome AS adotante_nome,
            u.email AS adotante_email,
            u.foto AS adotante_foto,
            p.id AS pet_id,
            p.nome AS pet_nome,
            p.especie,
            p.raca,
            p.sexo,
            p.porte,
            p.temperamento,
            p.status AS pet_status,
            p.historia,
            pf.url AS pet_foto
        FROM Favorito f
        INNER JOIN Usuario u ON f.adotante_id = u.id
        INNER JOIN Pet p ON f.pet_id = p.id
        LEFT JOIN PetFoto pf ON pf.pet_id = p.id
        ORDER BY u.nome, p.nome
    ");
    $stmt->execute();
    $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar por usuário
    $result = [];
    foreach ($favoritos as $fav) {
        $adotanteId = $fav['adotante_id'];
        if (!isset($result[$adotanteId])) {
            $result[$adotanteId] = [
                'id' => $adotanteId,
                'nome' => $fav['adotante_nome'],
                'email' => $fav['adotante_email'],
                'foto' => $fav['adotante_foto'],
                'pets' => []
            ];
        }

        $result[$adotanteId]['pets'][] = [
            'id' => $fav['pet_id'],
            'nome' => $fav['pet_nome'],
            'especie' => $fav['especie'],
            'raca' => $fav['raca'],
            'sexo' => $fav['sexo'],
            'porte' => $fav['porte'],
            'temperamento' => $fav['temperamento'],
            'status' => $fav['pet_status'],
            'historia' => $fav['historia'],
            'foto' => $fav['pet_foto']
        ];
    }

    echo json_encode(['sucesso' => true, 'usuarios' => array_values($result)]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Erro ao listar favoritos: ' . $e->getMessage()]);
}
?>
