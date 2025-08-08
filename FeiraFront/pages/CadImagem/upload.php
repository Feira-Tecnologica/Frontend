<?php
require('conexao.php');
$sala = $_POST["sala"];

if (isset($_FILES["foto"]) && !empty($_FILES["foto"])){
    $imagem = "./img/".$_FILES["foto"]["name"];
    move_uploaded_file($_FILES["foto"]["tmp_name"],$imagem);
}
  $consulta = "INSERT INTO imagem (sala,imagem) values ('$sala','$imagem')";
  $conn->query($consulta);

  header('Location: galeria.php');
?>
