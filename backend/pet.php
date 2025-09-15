<?php
require_once 'conexao.php';

class Pet {
    private $conn;
    private $table = "Pet";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function cadastrar($dados) {
        $sql = "INSERT INTO {$this->table} 
            (nome, data_de_nascimento, especie, raca, porte, sexo, temperamento, estado_de_saude, endereco, necessidades, historia, status, voluntario_id, data_criacao, data_atualizacao)
            VALUES (:nome, :data_de_nascimento, :especie, :raca, :porte, :sexo, :temperamento, :estado_de_saude, :endereco, :necessidades, :historia, :status, :voluntario_id, NOW(), NOW())";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($dados);
        return $this->conn->lastInsertId();
    }
}
?>