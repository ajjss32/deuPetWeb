<?php
require_once 'conexao.php';

class Usuario {
    private $conn;
    private $table = "Usuario";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    function generateUuidV4() {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function cadastrar($dados) {
        $sql = "INSERT INTO {$this->table} (id, nome, email, telefone, senha, data_nascimento, cpf_cnpj, tipo, foto, endereco, descricao, data_criacao, data_atualizacao)
                VALUES (:id, :nome, :email, :telefone, :senha, :data_nascimento, :cpf_cnpj, :tipo, :foto, :endereco, :descricao, NOW(), NOW())";
        $stmt = $this->conn->prepare($sql);
        $dados['id'] = $this->generateUuidV4();
        $dados['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
        $stmt->execute($dados);
        return $dados['id'];
    }

    public function buscarPorEmail($email) {
        $sql = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function buscarPorId($id) {
        $sql = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>