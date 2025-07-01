// Gerenciamento de integrantes
let selectedIntegrantes = new Set();
let alunosDisponiveis = [];
let odsDisponiveis = [];

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', function() {
  carregarAlunos();
  carregarODS();
  updateIntegrantesList();
  
  // Add event listener to select
  const integrantesSelect = document.getElementById("integrantesSelect");
  if (integrantesSelect) {
    integrantesSelect.addEventListener('change', function(e) {
      if (e.target.value) {
        adicionarIntegrante();
      }
    });
  }

  // Configurar o formulário para usar AJAX
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      enviarFormulario();
    });
  }

  // Fechar modal ao clicar fora dele
  window.onclick = function(event) {
    let modal = document.getElementById('confirmationModal');
    if (modal && event.target == modal) {
      hideModal();
    }
  }
});

async function carregarAlunos() {
  try {
    const response = await fetch('/Frontend/front-end_grupoB/api/alunos');
    if (response.ok) {
      alunosDisponiveis = await response.json();
      atualizarSelectIntegrantes();
    } else {
      console.error('Erro ao carregar alunos:', response.status);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

async function carregarODS() {
  try {
    const response = await fetch('/Frontend/front-end_grupoB/api/ods');
    if (response.ok) {
      odsDisponiveis = await response.json();
      // Atualizar o seletor de ODS se existir
      if (window.odsSelector) {
        window.odsSelector.updateODSList(odsDisponiveis);
      }
    } else {
      console.error('Erro ao carregar ODS:', response.status);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

function atualizarSelectIntegrantes() {
  const select = document.getElementById("integrantesSelect");
  if (select && alunosDisponiveis.length > 0) {
    select.innerHTML = '<option value="">Selecione um integrante...</option>';
    alunosDisponiveis.forEach(aluno => {
      const option = document.createElement('option');
      option.value = aluno.id_aluno;
      option.textContent = aluno.nome_aluno;
      select.appendChild(option);
    });
  }
}

function adicionarIntegrante() {
  const select = document.getElementById("integrantesSelect");
  const selectedValue = select.value;
  const selectedText = select.options[select.selectedIndex].text;
  
  if (selectedValue && !selectedIntegrantes.has(selectedValue)) {
    selectedIntegrantes.add(selectedValue);
    updateIntegrantesList();
    select.value = "";
  }
}

function removerIntegrante(id_aluno) {
  selectedIntegrantes.delete(id_aluno);
  updateIntegrantesList();
}

function updateIntegrantesList() {
  const listContainer = document.getElementById("integrantesSelectedList");
  
  if (selectedIntegrantes.size === 0) {
    listContainer.innerHTML = '<div class="integrantes-empty">Nenhum integrante selecionado</div>';
    return;
  }
  
  listContainer.innerHTML = Array.from(selectedIntegrantes).map(id_aluno => {
    const aluno = alunosDisponiveis.find(a => a.id_aluno === id_aluno);
    const nome = aluno ? aluno.nome_aluno : id_aluno;
    return `
      <div class="integrante-item">
        <span>${nome}</span>
        <button type="button" class="remove-integrante-btn" onclick="removerIntegrante('${id_aluno}')">×</button>
      </div>
    `;
  }).join('');
}

async function enviarFormulario() {
  const nomeProjeto = document.getElementById("nomeProjeto").value;
  const descricao = document.getElementById("descricao").value;
  const objetivo = document.getElementById("objetivo").value;
  const justificativa = document.getElementById("justificativa").value;

  // Validar campos obrigatórios
  if (!nomeProjeto || !descricao || selectedIntegrantes.size === 0) {
    alert("Preencha todos os campos obrigatórios e selecione pelo menos um integrante.");
    return;
  }

  // Preparar dados para envio
  const dados = {
    titulo_projeto: nomeProjeto,
    descricao: descricao,
    objetivo: objetivo,
    justificativa: justificativa,
    bloco: "Bloco A", // Você pode tornar isso dinâmico
    sala: "24", // Valor fixo do HTML
    posicao: 24,
    orientador: "Professor(a) Orientador(a)", // Você pode tornar isso dinâmico
    turma: "3C", // Valor fixo do HTML
    integrantes: Array.from(selectedIntegrantes),
    ods: window.odsSelector ? window.odsSelector.getSelectedODS() : []
  };

  try {
    const response = await fetch('/Frontend/front-end_grupoB/api/projetos/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    if (response.ok) {
      alert("Projeto cadastrado com sucesso!");
      // Redirecionar para a página de projetos ou limpar o formulário
      window.location.href = "escolher_projeto.html";
    } else {
      alert("Erro ao cadastrar projeto: " + resultado.erro);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert("Erro de conexão. Tente novamente.");
  }
}

function prepararDados() {
  // Esta função não é mais necessária pois usamos AJAX
  return false;
}

function criarProjeto() {
  enviarFormulario();
}

function hideModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function confirmCreate() {
  hideModal();
  enviarFormulario();
}