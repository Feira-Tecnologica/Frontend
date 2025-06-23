<?php

include 'db.php';

$message = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $nome = $_POST['nome'];

    $turma = $_POST['turma'];

    $integrantesArr = isset($_POST['integrantes']) ? $_POST['integrantes'] : [];
    $integrantes = implode(', ', $integrantesArr);
    $numero_projeto = $_POST['numero_projeto'];

    
    $stmt = $pdo->prepare("INSERT INTO projetos (nome, integrantes, numero_projeto, cadastro_concluido) VALUES (:nome, :integrantes, :numero_projeto, 0)");
    if ($stmt->execute([
        ':nome' => $nome,
        ':integrantes' => $integrantes,
        ':numero_projeto' => $numero_projeto
    ])) {
        $message = "Projeto pré-cadastrado com sucesso! Aguardando aprovação.";
    } else {
        $message = "Erro ao cadastrar projeto.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cadastrar Projeto</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 20px; }
        .container { background: #fff; padding: 20px; max-width: 600px; margin: auto; border-radius: 5px; }
        input[type="text"], input[type="number"], select { width: 100%; padding: 8px; margin: 5px 0 15px; border: 1px solid #ccc; border-radius: 4px; }
        input[type="submit"] { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        input[type="submit"]:hover { background-color: #45a049; }
        .message { padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; background: #e7ffe7; }
    </style>
    <script>
 
        const integrantesPorTurma = {
            '3A': ['João', 'Maria', 'Carlos'],
            '3B': ['Ana', 'Pedro', 'Fernanda'],
            '3C': ['Ricardo', 'Sofia', 'Bruno']
        };

        function atualizaIntegrantes() {
            const turmaSelect = document.getElementById('turma');
            const integrantesSelect = document.getElementById('integrantes');
            const turma = turmaSelect.value;

            // Limpa as opções anteriores
            integrantesSelect.innerHTML = '';

          
            if (integrantesPorTurma[turma]) {
                integrantesPorTurma[turma].forEach(function(nome) {
                    const option = document.createElement('option');
                    option.value = nome;
                    option.text = nome;
                    integrantesSelect.appendChild(option);
                });
            }
        }

        window.onload = function() {
            atualizaIntegrantes();
        };
    </script>
</head>
<body>
    <div class="container">
        <h2>Cadastrar Novo Projeto</h2>
        <?php if ($message): ?>
            <div class="message"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>
        <form method="post" action="">
            <label for="nome">Nome do Projeto:</label>
            <input type="text" id="nome" name="nome" required>

            <label for="turma">Turma:</label>
            <select id="turma" name="turma" onchange="atualizaIntegrantes()">
                <option value="3A">3A</option>
                <option value="3B">3B</option>
                <option value="3C">3C</option>
            </select>

            <label for="integrantes">Integrantes:</label>
   
            <select id="integrantes" name="integrantes[]" multiple size="4" required></select>

            <label for="numero_projeto">Código do Projeto:</label>
            <input type="text" id="numero_projeto" name="numero_projeto" required>

            <input type="submit" value="Pré-cadastrar Projeto">
        </form>
        <br>
        <a href="tela_espera.php">Ir para a Tela de Espera</a>
    </div>
</body>
</html>
