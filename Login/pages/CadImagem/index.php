<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enviar Fotos</title>
  <link rel="stylesheet" href="upload.css">
</head>

<body>
  <div class="container">
    <div class="upload-box">
      <div class="header">
        <a href="#" class="back-arrow">←</a>
        <h2>Enviar fotos</h2>
      </div>

      <form action="upload.php" method="POST" enctype="multipart/form-data">
        <label for="foto" class="upload-icon-label">
          <div class="upload-icon">📤</div>
        </label>
        <input type="file" name="foto" id="foto" accept="image/*" style="display: none;">

        <p class="upload-text">Selecione um ou mais arquivos do seu dispositivo.</p>

        <div id="file-preview" class="file-box" style="display: none;">
          <span class="file-name" id="file-name"></span>
          <button type="button" class="remove-file" onclick="removeFile()">✕</button>
        </div>

        <div class="sala-box">
          <label for="sala"></label>
          <select name="sala" id="sala" class="styled-select">
            <option disabled selected>Escolha sua sala</option>
            <option value="3A">3°A</option>
            <option value="3B">3°B</option>
            <option value="3C">3°C</option>
          </select>
        </div>


        <div class="descricao-box">
          <label for="descricao">Descrição</label>
          <textarea name="descricao" id="descricao" placeholder="Adicione a descrição da imagem do projeto..."></textarea>
        </div>

        <div class="buttons">
          <button type="submit" class="enviar">Enviar</button>
          <button type="button" class="cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    const fileInput = document.getElementById('foto');
    const filePreview = document.getElementById('file-preview');
    const fileNameDisplay = document.getElementById('file-name');

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
        filePreview.style.display = 'flex';
      }
    });

    function removeFile() {
      fileInput.value = '';
      filePreview.style.display = 'none';
      fileNameDisplay.textContent = '';
    }
  </script>
</body>

</html>