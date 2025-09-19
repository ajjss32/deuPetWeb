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
                $petData['fotos'] = $pet->getPetImages($petId);
                $response['sucesso'] = true;
                $response['dados'] = $petData;
            } else {
                $response['erro'] = 'Pet não encontrado.';
            }
        } else {
            $response['erro'] = 'ID do pet não fornecido.';
        }
    } else if ($method === 'POST') {
        $id = $_POST['id'] ?? null;
        if (!$id) {
            throw new Exception('ID do pet não fornecido.');
        }

        $dados = [
            'id' => $id,
            'nome' => $_POST['nome'] ?? '',
            'data_de_nascimento' => $_POST['data_de_nascimento'] ?? '',
            'especie' => $_POST['especie'] ?? '',
            'raca' => $_POST['raca'] ?? '',
            'porte' => $_POST['porte'] ?? '',
            'sexo' => $_POST['sexo'] ?? '',
            'temperamento' => $_POST['temperamento'] ?? '',
            'estado_de_saude' => $_POST['estado_de_saude'] ?? '',
            'necessidades' => $_POST['necessidades'] ?? '',
            'historia' => $_POST['historia'] ?? '',
            'status' => $_POST['status'] ?? '',
        ];

        $dados['endereco'] = $_POST['endereco'] ?? '{}';
        $keepImages = json_decode($_POST['keepImages'] ?? '[]', true);
        $imagensAtuais = $pet->getPetImages($id);
        foreach ($imagensAtuais as $imgUrl) {
            if (!in_array($imgUrl, $keepImages)) {
                $pet->removerImagem($id, $imgUrl);
                $publicId = basename(parse_url($imgUrl, PHP_URL_PATH), '.' . pathinfo($imgUrl, PATHINFO_EXTENSION));
                cloudinary_delete($publicId);
            }
        }

        if (!empty($_FILES['imagens']['name'][0])) {
            foreach ($_FILES['imagens']['tmp_name'] as $i => $tmpName) {
                $fileName = $_FILES['imagens']['name'][$i];
                $url = uploadToCloudinary($tmpName, $fileName);
                if ($url) {
                    $pet->adicionarImagem($id, $url);
                }
            }
        }

        if ($pet->atualizarPet($dados)) {
            $response['sucesso'] = true;
            $response['mensagem'] = 'Pet atualizado com sucesso.';
        } else {
            $response['erro'] = 'Erro ao atualizar pet.';
        }
    } else if ($method === 'DELETE') {
        $dados = json_decode(file_get_contents('php://input'), true);
        if (isset($dados['id'])) {
            $imagens = $pet->getPetImages($dados['id']);
            foreach ($imagens as $imgUrl) {
                $publicId = basename(parse_url($imgUrl, PHP_URL_PATH), '.' . pathinfo($imgUrl, PATHINFO_EXTENSION));
                cloudinary_delete($publicId);
            }
            $result = $pet->excluirPet($dados['id']);
            if ($result === true) {
                $response['sucesso'] = true;
                $response['mensagem'] = 'Pet excluído com sucesso.';
            } else {
                $response['erro'] = 'Erro ao excluir pet.';
                $response['debug'] = $result;
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