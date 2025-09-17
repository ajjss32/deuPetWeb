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
    
    public function getPetById($petId) {
        $query = "SELECT p.*, pf.url as foto FROM " . $this->table . " p
                  LEFT JOIN PetFoto pf ON p.id = pf.pet_id
                  WHERE p.id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $petId);
        $stmt->execute();
        
        $petData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($petData) {
            $petData['fotos'] = $this->getPetImages($petId);
        }
        return $petData;
    }

    public function getPetImages($petId) {
        $query = "SELECT url FROM PetFoto WHERE pet_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $petId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    public function atualizarPet($dados) {
        $query = "UPDATE " . $this->table . " SET 
                  nome = :nome, data_de_nascimento = :data_de_nascimento, especie = :especie,
                  raca = :raca, porte = :porte, sexo = :sexo, temperamento = :temperamento,
                  estado_de_saude = :estado_de_saude, necessidades = :necessidades, 
                  historia = :historia, status = :status, data_atualizacao = NOW()
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $dados['id']);
        $stmt->bindParam(':nome', $dados['nome']);
        $stmt->bindParam(':data_de_nascimento', $dados['data_de_nascimento']);
        $stmt->bindParam(':especie', $dados['especie']);
        $stmt->bindParam(':raca', $dados['raca']);
        $stmt->bindParam(':porte', $dados['porte']);
        $stmt->bindParam(':sexo', $dados['sexo']);
        $stmt->bindParam(':temperamento', $dados['temperamento']);
        $stmt->bindParam(':estado_de_saude', $dados['estado_de_saude']);
        $stmt->bindParam(':necessidades', $dados['necessidades']);
        $stmt->bindParam(':historia', $dados['historia']);
        $stmt->bindParam(':status', $dados['status']);
        
        return $stmt->execute();
    }
    
    public function excluirPet($petId) {
        $this->conn->beginTransaction();
        try {
            $queryImagens = "DELETE FROM PetFoto WHERE pet_id = :id";
            $stmtImagens = $this->conn->prepare($queryImagens);
            $stmtImagens->bindParam(':id', $petId);
            $stmtImagens->execute();
            
            $queryPet = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmtPet = $this->conn->prepare($queryPet);
            $stmtPet->bindParam(':id', $petId);
            $stmtPet->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function listarPetsPorVoluntario($voluntarioId) {
        $sql = "SELECT p.*, pf.url as foto FROM Pet p
                LEFT JOIN PetFoto pf ON p.id = pf.pet_id
                WHERE p.voluntario_id = :voluntario_id
                ORDER BY p.data_criacao DESC";
                
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':voluntario_id', $voluntarioId);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function listarPetsDisponiveis($filtro = []) {
        $sql = "SELECT p.*, pf.url as foto FROM Pet p
                LEFT JOIN PetFoto pf ON p.id = pf.pet_id
                WHERE p.status = 'Disponível' ";
        
        $params = [];
        $conditions = [];

        if (!empty($filtro['especie'])) {
            $conditions[] = "p.especie = :especie";
            $params[':especie'] = $filtro['especie'];
        }
        if (!empty($filtro['raca'])) {
            $conditions[] = "p.raca = :raca";
            $params[':raca'] = $filtro['raca'];
        }
        if (!empty($filtro['sexo'])) {
            $conditions[] = "p.sexo = :sexo";
            $params[':sexo'] = $filtro['sexo'];
        }
        if (!empty($filtro['porte'])) {
            $conditions[] = "p.porte = :porte";
            $params[':porte'] = $filtro['porte'];
        }
        if (!empty($filtro['temperamento'])) {
            $conditions[] = "p.temperamento = :temperamento";
            $params[':temperamento'] = $filtro['temperamento'];
        }
        if (!empty($filtro['necessidades'])) {
            $conditions[] = "p.necessidades = :necessidades";
            $params[':necessidades'] = $filtro['necessidades'];
        }

        if (!empty($conditions)) {
            $sql .= " AND " . implode(' AND ', $conditions);
        }
        
        $sql .= " ORDER BY p.data_criacao DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $petsRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pets = [];
        $petIds = [];
        foreach ($petsRaw as $row) {
            if (!in_array($row['id'], $petIds)) {
                $petIds[] = $row['id'];
                $pets[] = [
                    'id' => $row['id'],
                    'nome' => $row['nome'],
                    'historia' => $row['historia'],
                    'data_de_nascimento' => $row['data_de_nascimento'],
                    'especie' => $row['especie'],
                    'raca' => $row['raca'],
                    'porte' => $row['porte'],
                    'sexo' => $row['sexo'],
                    'temperamento' => $row['temperamento'],
                    'estado_de_saude' => $row['estado_de_saude'],
                    'necessidades' => $row['necessidades'],
                    'status' => $row['status'],
                    'data_criacao' => $row['data_criacao'],
                    'foto' => $row['foto'] ?? null
                ];
            }
        }
        return $pets;
    }
}