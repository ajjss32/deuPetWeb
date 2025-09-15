<?php
require_once 'pet.php';
require_once 'cloudinary.php';

header('Content-Type: application/json');
$data = $_POST;
$images = [];

if (isset($_FILES['imagens'])) {
    foreach ($_FILES['imagens']['tmp_name'] as $idx => $tmpName) {
        $url = uploadToCloudinary($tmpName, $_FILES['imagens']['name'][$idx]);
        if ($url) $images[] = $url;
    }
}

$pet = new Pet();
try {
    $data['status'] = 'Disponível';
    $petId = $pet->cadastrar($data);

    $database = new Database();
    $conn = $database->getConnection();
    foreach ($images as $imgUrl) {
        $stmt = $conn->prepare("INSERT INTO PetFoto (pet_id, url) VALUES (:pet_id, :url)");
        $stmt->execute(['pet_id' => $petId, 'url' => $imgUrl]);
    }

    echo json_encode(['sucesso' => true, 'id' => $petId]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar pet']);
}
?>