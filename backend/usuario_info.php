<?php
session_start();
header('Content-Type: application/json');
if (isset($_SESSION['usuario_id'])) {
    echo json_encode([
        'id' => $_SESSION['usuario_id'],
        'nome' => $_SESSION['usuario_nome'],
        'tipo' => $_SESSION['usuario_tipo']
    ]);
} else {
    echo json_encode(['erro' => 'Não autenticado']);
}