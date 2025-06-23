<?php

include 'db.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        $id_grupo = $_POST['id_grupo'];

        if ($_POST['action'] == 'editar') {

            $nome = $_POST['nome'];
            $integrantes = $_POST['integrantes'];
            $numero_projeto = $_POST['numero_projeto'];

            $stmt = $pdo->prepare("UPDATE projetos SET nome = :nome, integrantes = :integrantes, numero_projeto = :numero_projeto WHERE id_grupo = :id_grupo");
            $stmt->execute([
                ':nome' => $nome,
                ':integrantes' => $integrantes,
                ':numero_projeto' => $numero_projeto,
                ':id_grupo' => $id_grupo
            ]);
        } elseif ($_POST['action'] == 'aprovar') {
     
            $stmt = $pdo->prepare("UPDATE projetos SET cadastro_concluido = 1 WHERE id_grupo = :id_grupo");
            $stmt->execute([':id_grupo' => $id_grupo]);
        }
    }
}

// Busca os projetos em espera (cadastro_concluido = false)
$stmt = $pdo->query("SELECT * FROM projetos WHERE cadastro_concluido = 0");
$projetos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tela de Espera - Projetos em Espera</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 20px; }
        .container { background: #fff; padding: 20px; max-width: 800px; margin: auto; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid #ccc; }
        th, td { padding: 10px; text-align: left; }
        .btn { padding: 5px 10px; text-decoration: none; border: none; border-radius: 3px; cursor: pointer; }
        .btn-editar { background-color: #f0ad4e; color: #fff; }
        .btn-aprovar { background-color: #5cb85c; color: #fff; }
        .btn-salvar { background-color: #0275d8; color: #fff; }
        .edit-form { display: none; margin-top: 10px; }
        input[type="text"] { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px; }
    </style>
    <script>
        function toggleEditForm(id) {
            var form = document.getElementById('edit-form-' + id);
            if (form.style.display === "none" || form.style.display === "") {
                form.style.display = "block";
            } else {
                form.style.display = "none";
            }
        }
    </script>
</head>
<body>
    <div class="container">
        <h2>Projetos em Espera</h2>
        <?php if (count($projetos) > 0): ?>
            <table>
                <tr>
                    <th>ID Grupo</th>
                    <th>Nome do Projeto</th>
                    <th>Integrantes</th>
                    <th>Código do Projeto</th>
                    <th>Ações</th>
                </tr>
                <?php foreach ($projetos as $projeto): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($projeto['id_grupo']); ?></td>
                        <td><?php echo htmlspecialchars($projeto['nome']); ?></td>
                        <td><?php echo nl2br(htmlspecialchars($projeto['integrantes'])); ?></td>
                        <td><?php echo htmlspecialchars($projeto['numero_projeto']); ?></td>
                        <td>
                            <button class="btn btn-editar" onclick="toggleEditForm(<?php echo $projeto['id_grupo']; ?>)">Editar</button>
                            <form style="display:inline;" method="post" action="">
                                <input type="hidden" name="id_grupo" value="<?php echo $projeto['id_grupo']; ?>">
                                <input type="hidden" name="action" value="aprovar">
                                <button type="submit" class="btn btn-aprovar">Aprovar</button>
                            </form>
                        </td>
                    </tr>
                    <tr id="edit-form-<?php echo $projeto['id_grupo']; ?>" class="edit-form">
                        <td colspan="5">
                            <form method="post" action="">
                                <input type="hidden" name="id_grupo" value="<?php echo $projeto['id_grupo']; ?>">
                                <input type="hidden" name="action" value="editar">
                                
                                <label for="nome-<?php echo $projeto['id_grupo']; ?>">Nome do Projeto:</label>
                                <input type="text" id="nome-<?php echo $projeto['id_grupo']; ?>" name="nome" value="<?php echo htmlspecialchars($projeto['nome']); ?>" required>
                                
                                <label for="integrantes-<?php echo $projeto['id_grupo']; ?>">Integrantes (separados por vírgula):</label>
                                <input type="text" id="integrantes-<?php echo $projeto['id_grupo']; ?>" name="integrantes" value="<?php echo htmlspecialchars($projeto['integrantes']); ?>" required>
                                
                                <label for="numero_projeto-<?php echo $projeto['id_grupo']; ?>">Código do Projeto:</label>
                                <input type="text" id="numero_projeto-<?php echo $projeto['id_grupo']; ?>" name="numero_projeto" value="<?php echo htmlspecialchars($projeto['numero_projeto']); ?>" required>
                                
                                <button type="submit" class="btn btn-salvar">Salvar Alterações</button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p>Nenhum projeto em espera.</p>
        <?php endif; ?>
        <a href="cadastrar_projeto.php">Cadastrar novo projeto</a>
    </div>
</body>
</html>
