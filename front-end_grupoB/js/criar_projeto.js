function adicionarIntegrante() {
      const list = document.getElementById('integrantesList');
      const novoInput = document.createElement('input');
      novoInput.type = 'text';
      novoInput.placeholder = `Integrante ${list.children.length + 1}`;
      novoInput.required = true;
      list.appendChild(novoInput);
    }

    function criarProjeto() {
      document.getElementById('confirmationModal').style.display = 'block';
    }

    function hideModal() {
      document.getElementById('confirmationModal').style.display = 'none';
    }

    function confirmCreate() {
      // Aqui vai a lógica para criar o projeto
      hideModal();
      // Adicione aqui o redirecionamento ou outras ações após criar o projeto
    }

    // Fechar modal ao clicar fora dele
    window.onclick = function(event) {
      let modal = document.getElementById('confirmationModal');
      if (event.target == modal) {
        hideModal();
      }
    }