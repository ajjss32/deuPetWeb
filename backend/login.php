<?php
require_once 'usuario.php';
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email'], $data['senha'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados inválidos']);
    exit;
}

$usuario = new Usuario();
$user = $usuario->buscarPorEmail($data['email']);

if ($user && password_verify($data['senha'], $user['senha'])) {
    $_SESSION['usuario_id'] = $user['id'];
    $_SESSION['usuario_nome'] = $user['nome'];
    $_SESSION['usuario_tipo'] = $user['tipo'];
    unset($user['senha']);

    $streamApiSecret = '5ybdnxv26rnu8waqrqtapfgptuuu3bhqpg245nfegdcdtd2zarzr57yty9bc63mk';
    $jwt = generateStreamJWT($user['id'], $streamApiSecret);

    echo json_encode([
        'sucesso' => true,
        'usuario' => $user,
        'stream_jwt' => $jwt
    ]);
} else {
    http_response_code(401);
    echo json_encode(['erro' => 'Email ou senha inválidos']);
}

function generateStreamJWT($userId, $apiSecret) {
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode(['user_id' => $userId, 'iat' => time()]));
    $signature = hash_hmac('sha256', "$header.$payload", $apiSecret, true);
    $jwt = "$header.$payload." . base64_encode($signature);
    return $jwt;
}
?>