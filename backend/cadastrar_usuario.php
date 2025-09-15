<?php
require_once 'usuario.php';
require_once 'cloudinary.php';

header('Content-Type: application/json');
$data = $_POST;

if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
    $fotoUrl = uploadToCloudinary($_FILES['foto']['tmp_name'], $_FILES['foto']['name']);
    $data['foto'] = $fotoUrl;
} else {
    $data['foto'] = null;
}

$usuario = new Usuario();
if ($usuario->buscarPorEmail($data['email'])) {
    http_response_code(409);
    echo json_encode(['erro' => 'Email já cadastrado']);
    exit;
}

try {
    $id = $usuario->cadastrar($data);

    $streamApiKey = 'gjp3ycatuazs';
    $streamApiSecret = '5ybdnxv26rnu8waqrqtapfgptuuu3bhqpg245nfegdcdtd2zarzr57yty9bc63mk';

    $userPayload = [
        'id'    => $id,
        'name'  => $data['nome'],
        'email' => $data['email'],
        'image' => $data['foto']
    ];

    $jwt = generateStreamJWT($id, $streamApiSecret);

    $ch = curl_init("https://chat.stream-io-api.com/users");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: $jwt",
        "Content-Type: application/json",
        "stream-auth-type: jwt"
    ]);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['users' => [$userPayload]]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);

    echo json_encode([
        'sucesso'    => true,
        'id'         => $id,
        'stream_jwt' => $jwt 
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar usuário', 'detalhe' => $e->getMessage()]);
}

function generateStreamJWT($userId, $apiSecret) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode(['user_id' => $userId, 'iat' => time()]));
    $signature = hash_hmac('sha256', "$header.$payload", $apiSecret, true);
    $jwt = "$header.$payload." . base64_encode($signature);
    return $jwt;
}
?>