<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../api/Config/connection.php';
require_once '../api/Config/cors.php';

try {
    // Verificar se é uma requisição POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["erro" => "Método não permitido"]);
        exit;
    }

    // Capturar dados do formulário
    $projetoId = $_POST['projetoId'] ?? '';
    $nomeProjeto = $_POST['nomeProjeto'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $objetivo = $_POST['objetivo'] ?? '';
    $justificativa = $_POST['justificativa'] ?? '';
    $odsJson = $_POST['ods'] ?? '[]';
    $integrantes = $_POST['integrantes'] ?? [];

    // Decodificar ODS
    $ods_selecionados = json_decode($odsJson, true) ?? [];

    // Validação dos campos obrigatórios
    if (empty($projetoId) || empty($nomeProjeto) || empty($descricao)) {
        http_response_code(400);
        echo json_encode(["erro" => "Preencha todos os campos obrigatórios."]);
        exit;
    }

    // Validar se há pelo menos um integrante
    if (empty($integrantes)) {
        http_response_code(400);
        echo json_encode(["erro" => "Selecione pelo menos um integrante para o projeto."]);
        exit;
    }

    $conn->beginTransaction();

    // Atualizar dados do projeto
    $stmt = $conn->prepare("
        UPDATE projeto 
        SET titulo_projeto = :titulo_projeto, 
            descricao = :descricao
        WHERE id_projeto = :projeto_id OR id = :projeto_id
    ");
    
    $stmt->bindParam(':titulo_projeto', $nomeProjeto);
    $stmt->bindParam(':descricao', $descricao);
    $stmt->bindParam(':projeto_id', $projetoId);
    
    if (!$stmt->execute()) {
        throw new Exception("Erro ao atualizar o projeto");
    }

    // Verificar se existem as colunas objetivo e justificativa
    try {
        $stmt_update_extra = $conn->prepare("
            UPDATE projeto 
            SET objetivo = :objetivo, 
                justificativa = :justificativa
            WHERE id_projeto = :projeto_id OR id = :projeto_id
        ");
        $stmt_update_extra->bindParam(':objetivo', $objetivo);
        $stmt_update_extra->bindParam(':justificativa', $justificativa);
        $stmt_update_extra->bindParam(':projeto_id', $projetoId);
        $stmt_update_extra->execute();
    } catch (Exception $e) {
        // Se as colunas não existirem, continuar sem erro
        error_log("Aviso: Campos objetivo/justificativa não encontrados - " . $e->getMessage());
    }

    // Remover integrantes antigos
    $stmt_remove = $conn->prepare("DELETE FROM projeto_aluno WHERE id_projeto = :projeto_id");
    $stmt_remove->bindParam(':projeto_id', $projetoId);
    $stmt_remove->execute();

    // Adicionar novos integrantes
    if (!empty($integrantes)) {
        foreach ($integrantes as $nome_integrante) {
            // Primeiro, tentar buscar na estrutura atual (id_aluno, nome_aluno)
            $stmt_aluno = $conn->prepare("SELECT id_aluno FROM aluno WHERE nome_aluno = :nome LIMIT 1");
            $stmt_aluno->bindParam(':nome', $nome_integrante);
            $stmt_aluno->execute();
            
            $aluno = $stmt_aluno->fetch();
            
            if (!$aluno) {
                // Se não encontrou, tentar na nova estrutura (id, nome)
                $stmt_aluno2 = $conn->prepare("SELECT id_aluno FROM aluno WHERE nome = :nome LIMIT 1");
                $stmt_aluno2->bindParam(':nome', $nome_integrante);
                $stmt_aluno2->execute();
                $aluno = $stmt_aluno2->fetch();
            }
            
            if (!$aluno) {
                // Se o aluno não existe, criar um novo registro
                $id_aluno = 'ALU_' . uniqid();
                $stmt_criar_aluno = $conn->prepare("INSERT INTO aluno (id_aluno, nome_aluno, email_institucional) VALUES (:id_aluno, :nome, :email)");
                $email_temp = strtolower(str_replace(' ', '.', $nome_integrante)) . '@temp.com';
                $stmt_criar_aluno->bindParam(':id_aluno', $id_aluno);
                $stmt_criar_aluno->bindParam(':nome', $nome_integrante);
                $stmt_criar_aluno->bindParam(':email', $email_temp);
                $stmt_criar_aluno->execute();
            } else {
                $id_aluno = $aluno['id_aluno'];
            }

            // Associar aluno ao projeto
            $stmt_associar = $conn->prepare("INSERT INTO projeto_aluno (id_projeto, id_aluno) VALUES (:id_projeto, :id_aluno)");
            $stmt_associar->bindParam(':id_projeto', $projetoId);
            $stmt_associar->bindParam(':id_aluno', $id_aluno);
            $stmt_associar->execute();
        }
    }

    // Atualizar ODS (se a tabela existir)
    try {
        // Remover ODS antigos
        $stmt_remove_ods = $conn->prepare("DELETE FROM projeto_ods WHERE id_projeto = :projeto_id");
        $stmt_remove_ods->bindParam(':projeto_id', $projetoId);
        $stmt_remove_ods->execute();

        // Adicionar novos ODS
        if (!empty($ods_selecionados)) {
            foreach ($ods_selecionados as $ods_numero) {
                $stmt_ods = $conn->prepare("INSERT INTO projeto_ods (id_projeto, numero_ods) VALUES (:id_projeto, :numero_ods)");
                $stmt_ods->bindParam(':id_projeto', $projetoId);
                $stmt_ods->bindParam(':numero_ods', $ods_numero);
                $stmt_ods->execute();
            }
        }
    } catch (Exception $e) {
        // Se a tabela projeto_ods não existir, continuar sem erro
        error_log("Aviso: Tabela projeto_ods não encontrada - " . $e->getMessage());
    }

    $conn->commit();

    // Resposta de sucesso
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Projeto atualizado com sucesso!",
        "projeto_id" => $projetoId
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        "erro" => "Erro interno do servidor: " . $e->getMessage()
    ]);
    
    error_log("Erro ao atualizar projeto: " . $e->getMessage());
}
?>
