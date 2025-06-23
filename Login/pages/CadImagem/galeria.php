<?php
require('conexao.php');
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galeria de Fotos</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .galeria {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }
        .item {
            text-align: center;
        }
        .item img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ccc;
            border-radius: 8px;
        }
        .item h1 {
            font-size: 16px;
            margin: 10px 0 5px;
        }
        @media (max-width: 768px) {
            .galeria {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (max-width: 480px) {
            .galeria {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
<header>
        <ul><a href='index.php'>Cadastrar Foto</a>
    </header>
    <h2>Galeria de Fotos</h2>
    <div class="galeria">
        <?php
        $sql = "SELECT * FROM imagem";
        $consulta = $conn->query($sql);

        if ($consulta && $consulta->num_rows > 0) {
            while($dados = $consulta->fetch_assoc()) {
                echo "<div class='item'>";
                echo "<h1>" .$dados['sala']. "</h1>";
                echo "<img src='" .$dados['imagem']. "' alt='Foto da sala'>";
                echo "</div>";
            }
        } else {
            echo "<p>Nenhuma foto encontrada.</p>";
        }
        ?>
    </div>
</body>
</html>
