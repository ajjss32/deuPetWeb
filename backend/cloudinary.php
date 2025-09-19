<?php
const CLOUDINARY_CONFIG = [
    'cloud_name'    => 'elza2uolj',
    'upload_preset' => 'deu_pet',
    'api_key'    => '582974639156364',
    'api_secret' => '41nabTLg58DmnvxQqa0eiWNcDJo',
];

function uploadToCloudinary($fileTmpPath, $fileName) {
    $config = CLOUDINARY_CONFIG;
    $url = "https://api.cloudinary.com/v1_1/{$config['cloud_name']}/image/upload";
    $postFields = [
        'upload_preset' => $config['upload_preset'],
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

function cloudinary_delete($publicId) {
    $config = CLOUDINARY_CONFIG;
    $cloudName = $config['cloud_name'];
    $apiKey = $config['api_key'];
    $apiSecret = $config['api_secret'];

    $timestamp = time();
    $signatureString = "public_id=$publicId&timestamp=$timestamp$apiSecret";
    $signature = sha1($signatureString);

    $url = "https://api.cloudinary.com/v1_1/$cloudName/image/destroy";
    $data = [
        'public_id' => $publicId,
        'api_key' => $apiKey,
        'timestamp' => $timestamp,
        'signature' => $signature
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($result, true);
    return isset($json['result']) && $json['result'] === 'ok';
}

function getCloudinaryPublicId($url) {
    $parts = explode('/', parse_url($url, PHP_URL_PATH));
    $filename = end($parts);
    return pathinfo($filename, PATHINFO_FILENAME);
}
?>