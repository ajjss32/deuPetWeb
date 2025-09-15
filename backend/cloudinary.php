<?php
function uploadToCloudinary($fileTmpPath, $fileName) {
    $cloudName = 'elza2uolj';
    $uploadPreset = 'deu_pet';

    $url = "https://api.cloudinary.com/v1_1/$cloudName/image/upload";
    $postFields = [
        'upload_preset' => $uploadPreset,
        'file' => new CURLFile($fileTmpPath, mime_content_type($fileTmpPath), $fileName)
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($response, true);
    return $json['secure_url'] ?? null;
}
?>