<?php
require 'vendor/autoload.php';
require_once 'conexao.php';
header('Content-Type: application/json');

use GetStream\StreamChat\Client;

$data = json_decode(file_get_contents('php://input'), true);
$adotante_id = $data['adotante_id'];
$pet_id = $data['pet_id'];

try {
    $db = new Database();
    $pdo = $db->getConnection();

    $stmt = $pdo->prepare("SELECT voluntario_id, nome FROM Pet WHERE id = :pet_id");
    $stmt->execute([':pet_id' => $pet_id]);
    $pet = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$pet) throw new Exception('Pet não encontrado');

    $stmt = $pdo->prepare("SELECT url FROM PetFoto WHERE pet_id = :pet_id ORDER BY id ASC LIMIT 1");
    $stmt->execute([':pet_id' => $pet_id]);
    $pet_foto = $stmt->fetch(PDO::FETCH_ASSOC);
    $pet_image = $pet_foto ? $pet_foto['url'] : null;

    $voluntario_id = $pet['voluntario_id'];
    $pet_name = $pet['nome'];

    $stmt = $pdo->prepare("SELECT nome, foto FROM Usuario WHERE id = :id");
    $stmt->execute([':id' => $adotante_id]);
    $adotante = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$adotante) throw new Exception('Adotante não encontrado');

    $stmt = $pdo->prepare("INSERT INTO MatchPet (adotante_id, pet_id, status, data) VALUES (:adotante, :pet, 'match', NOW()) ON DUPLICATE KEY UPDATE status='match', data=NOW()");
    $stmt->execute([':adotante' => $adotante_id, ':pet' => $pet_id]);

    $apiKey = 'gjp3ycatuazs';
    $apiSecret = '5ybdnxv26rnu8waqrqtapfgptuuu3bhqpg245nfegdcdtd2zarzr57yty9bc63mk';
    $client = new Client($apiKey, $apiSecret);

    $channelId = $voluntario_id . '_' . $adotante_id . '_' . $pet_id;
    $channel = $client->Channel('messaging', $channelId, [
        'name' => "Conexão: $pet_name e {$adotante['nome']}",
        'members' => [(string)$voluntario_id, (string)$adotante_id],
        'image' => $pet_image,
        'pet_image' => $pet_image,
        'creator_id' => (string)$voluntario_id
    ]);
    $channel->create((string)$voluntario_id);

    echo json_encode(['sucesso' => true, 'canal' => $channelId]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>