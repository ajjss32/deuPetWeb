<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Location: /deuPetWeb/pages/login.html');
    exit;
}
?>