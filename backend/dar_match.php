<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once 'conexao.php';
header('Content-Type: application/json');

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

    $stmt = $pdo->prepare("SELECT foto FROM PetFoto WHERE pet_id = :pet_id ORDER BY id ASC LIMIT 1");
    $stmt->execute([':pet_id' => $pet_id]);
    $pet_foto = $stmt->fetch(PDO::FETCH_ASSOC);
    $pet_image = $pet_foto ? $pet_foto['url'] : null;

    $voluntario_id = $pet['voluntario_id'];
    $pet_name = $pet['nome'];

    $stmt = $pdo->prepare("SELECT nome FROM Usuario WHERE id = :id");
    $stmt->execute([':id' => $adotante_id]);
    $adotante = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$adotante) throw new Exception('Adotante não encontrado');

    $stmt = $pdo->prepare("INSERT INTO MatchPet (adotante_id, pet_id, status, data) VALUES (:adotante, :pet, 'match', NOW()) ON DUPLICATE KEY UPDATE status='match', data=NOW()");
    $stmt->execute([':adotante' => $adotante_id, ':pet' => $pet_id]);

    $apiKey = 'gjp3ycatuazs';
    $apiSecret = '5ybdnxv26rnu8waqrqtapfgptuuu3bhqpg245nfegdcdtd2zarzr57yty9bc63mk';
    $channelId = $voluntario_id . '_' . $adotante_id . '_' . $pet_id;
    $jwt = generateStreamJWT($voluntario_id, $apiSecret);

    $payload = [
        'id' => $channelId,
        'data' => [
            'members' => [$voluntario_id, $adotante_id],
            'name' => "Conexão: $pet_name e {$adotante['nome']}",
            'pet_image' => $pet_image
        ]
    ];

    $ch = curl_init("https://chat.stream-io-api.com/channels/messaging?api_key=$apiKey");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: $jwt",
        "Content-Type: application/json",
        "stream-auth-type: jwt"
    ]);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);

    if ($result === false) {
        $error = curl_error($ch);
        throw new Exception("Erro CURL: $error");
    }
    curl_close($ch);

    echo json_encode(['sucesso' => true, 'canal' => $channelId]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}

function generateStreamJWT($userId, $apiSecret) {
    $base64UrlEncode = function ($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    };
    $header = $base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = $base64UrlEncode(json_encode(['user_id' => $userId]));
    $signature = hash_hmac('sha256', "$header.$payload", $apiSecret, true);
    $encodedSignature = $base64UrlEncode($signature);
    return "$header.$payload.$encodedSignature";
}
?>