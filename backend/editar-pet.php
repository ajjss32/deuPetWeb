<?php
require_once 'conexao.php';
require_once 'pet.php';
require_once 'cloudinary.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$pet = new Pet();
$response = ['sucesso' => false];

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $petId = $_GET['id'];
            $petData = $pet->getPetById($petId);
            if ($petData) {
                $response['sucesso'] = true;
                $response['dados'] = $petData;
            } else {
                $response['erro'] = 'Pet não encontrado.';
            }
        } else {
            $response['erro'] = 'ID do pet não fornecido.';
        }
    } else if ($method === 'POST') {
        $dados = json_decode(file_get_contents('php://input'), true);
        if ($pet->atualizarPet($dados)) {
            $response['sucesso'] = true;
            $response['mensagem'] = 'Pet atualizado com sucesso.';
        } else {
            $response['erro'] = 'Erro ao atualizar pet.';
        }
    } else if ($method === 'DELETE') {
        $dados = json_decode(file_get_contents('php://input'), true);
        if (isset($dados['id'])) {
            if ($pet->excluirPet($dados['id'])) {
                $response['sucesso'] = true;
                $response['mensagem'] = 'Pet excluído com sucesso.';
            } else {
                $response['erro'] = 'Erro ao excluir pet.';
            }
        } else {
            $response['erro'] = 'ID do pet não fornecido.';
        }
    } else {
        http_response_code(405);
        $response['erro'] = 'Método não permitido.';
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['erro'] = $e->getMessage();
}

echo json_encode($response);
?>