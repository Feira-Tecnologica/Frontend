<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $matricula = $_POST["matricula"];
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    $data = array(
        "matricula" => $matricula,
        "email" => $email,
        "senha" => $senha
    );

    $ch = curl_init("http://localhost/Backend/Api-PHP/api/login/professor");
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
        $_SESSION["professor"] = $result;
        header("Location: ../dash-prof.html");
        exit();
    } else {
        $erro_login = $result['message'] ?? 'Erro ao fazer login.';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Login Professor</title>
  <link rel="stylesheet" href="../css/login.css" />
</head>
<body>
  <div class="container" id="container">
    <div class="form-container login-container">
      <form method="POST">
        <h1>Entrar</h1>
        <?php if (!empty($erro_login)) echo "<p style='color:red;'>$erro_login</p>"; ?>
        <div class="form-control">
          <input type="text" name="matricula" placeholder="Matrícula" required />
        </div>
        <div class="form-control">
          <input type="email" name="email" placeholder="E-mail institucional" required />
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
