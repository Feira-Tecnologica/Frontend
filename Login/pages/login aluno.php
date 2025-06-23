<?php

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "banco_feira";

$conn = new mysqli($host, $usuario, $senha, $banco);


if ($conn->connect_error) {
  die("Falha na conexão: " . $conn->connect_error);
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $email = $_POST["email"];
  $rm = $_POST["rm"];
  $senha = $_POST["senha"];

  $data = array(
    "email" => $email,
    "rm" => $rm,
    "senha" => $senha
  );

  $ch = curl_init("http://localhost/Backend/Api-PHP/api/login/aluno");
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

  $response = curl_exec($ch);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  $result = json_decode($response, true);

  if ($httpcode == 200) {
    session_start();
    $_SESSION["usuario"] = $result;
    header("Location: ../dash-prof.html");
    exit();
  } else {
    $erro_login = $result['message'] ?? 'Erro ao fazer login';
  }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <title>Login Aluno</title>
  <link rel="stylesheet" href="../css/login_responsivo.css">
  <link rel="stylesheet" href="../css/login.css">
</head>

<body>
  <div class="container" id="container">
    <div class="form-container login-container">
      <form method="POST">
        <h1>Entrar</h1>
        <?php if (!empty($erro_login)) echo "<p style='color:red;'>$erro_login</p>"; ?>
        <div class="form-control">
          <input type="email" name="email" placeholder="E-mail institucional" required />
        </div>
        <div class="form-control">
          <input type="text" name="rm" placeholder="RM" required />
        </div>
        <div class="form-control">
          <input type="password" name="senha" placeholder="Senha" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</body>

</html>