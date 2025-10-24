// Gerenciamento de integrantes
// MODIFICAÇÕES IMPLEMENTADAS:
// 1. Suporte para professores criarem projetos
// 2. Carregamento dinâmico de ODS via API /api/ods  
// 3. Interface adaptada para diferentes tipos de usuário
// 4. Gerenciamento integrado de ODS (substitui ods-selector.js)
// 5. Validações específicas por tipo de usuário
let selectedIntegrantes = new Set();
let selectedODS = new Set();
let alunosDisponiveis = [];
let odsDisponiveis = [];
let turmasDisponiveis = [];
let turmaSelecionada = null;

// Funções para modais
function showSuccessModal(message, callback) {
  const modal = document.getElementById('successModal');
  const messageEl = document.getElementById('successMessage');
  const btnOk = document.getElementById('btnOkSuccess');
  
  messageEl.textContent = message;
  modal.classList.add('show');
  
  btnOk.onclick = function() {
    modal.classList.remove('show');
    if (callback) callback();
  };
}

function showErrorModal(message) {
  const modal = document.getElementById('errorModal');
  const messageEl = document.getElementById('errorMessage');
  const btnOk = document.getElementById('btnOkError');
  
  messageEl.textContent = message;
  modal.classList.add('show');
  
  btnOk.onclick = function() {
    modal.classList.remove('show');
  };
}

function showConfirmModal(message, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const messageEl = document.getElementById('confirmMessage');
  const btnSim = document.getElementById('btnSim');
  const btnNao = document.getElementById('btnNao');
  
  messageEl.textContent = message;
  modal.classList.add('show');
  
  btnSim.onclick = function() {
    modal.classList.remove('show');
    if (onConfirm) onConfirm();
  };
  
  btnNao.onclick = function() {
    modal.classList.remove('show');
  };
}

// Carregar dados iniciais
document.addEventListener('DOMContentLoaded', function() {
  // Configura a interface (cria selects/containers) antes de carregar dados
  configurarInterfacePorTipoUsuario();
  // Carregar turmas e ods após a interface estar pronta
  carregarTurmas();
  carregarODS();
  updateIntegrantesList();
  updateODSList();
  
  // Add event listener to turma select
  const turmaSelect = document.getElementById("turmaSelect");
  if (turmaSelect) {
    turmaSelect.addEventListener('change', function(e) {
      turmaSelecionada = e.target.value;
      if (turmaSelecionada) {
        carregarAlunosPorTurma(turmaSelecionada);
      } else {
        alunosDisponiveis = [];
        atualizarSelectIntegrantes();
      }
      // Limpar integrantes selecionados ao trocar de turma
      selectedIntegrantes.clear();
      updateIntegrantesList();
    });
  }

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

function configurarInterfacePorTipoUsuario() {
  try {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    if (usuarioLogado.usuario) {
      const isAluno = usuarioLogado.usuario.id_aluno !== undefined;
      const isProfessor = usuarioLogado.usuario.id_professor !== undefined;
      
      // Adicionar informação sobre o tipo de usuário
      const integrantesContainer = document.getElementById("integrantesSelectedList");
      if (integrantesContainer && isProfessor) {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'professor-info';
        infoDiv.style.cssText = 'margin-bottom: 10px; padding: 8px; background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 4px; font-size: 14px; color: #0c5460;';
        infoDiv.innerHTML = '<strong>Professor:</strong> A seleção de integrantes é opcional para projetos de professores.';
        integrantesContainer.parentNode.insertBefore(infoDiv, integrantesContainer);
      }

      // Configurar interface de ODS
      configurarInterfaceODS();
    }
  } catch (error) {
    console.log('Erro ao configurar interface por tipo de usuário:', error);
  }
}

function configurarInterfaceODS() {
  const odsContainer = document.getElementById("odsContainer");
  if (odsContainer) {
    // Criar select para ODS
    const odsSelectWrapper = document.createElement('div');
    odsSelectWrapper.className = 'ods-select-wrapper';
    odsSelectWrapper.innerHTML = `
      <select class="integrantes-select" id="odsSelect">
        <option value="">Carregando ODS...</option>
      </select>
    `;
    
    // Criar container para ODS selecionados
    const odsSelectedList = document.createElement('div');
    odsSelectedList.className = 'integrantes-selected-list';
    odsSelectedList.id = 'odsSelectedList';
    
    odsContainer.appendChild(odsSelectWrapper);
    odsContainer.appendChild(odsSelectedList);

    // Adicionar event listener ao select de ODS
    const odsSelect = document.getElementById("odsSelect");
    if (odsSelect) {
      odsSelect.addEventListener('change', function(e) {
        if (e.target.value) {
          adicionarODS();
        }
      });
    }
  }
}

async function carregarTurmas() {
  try {
    console.log('Iniciando carregamento de turmas...');
    const apiBase = (window.BASE_URL || '').replace(/\/$/, '');
    const url = apiBase + '/api/turmas';
    console.log('URL da requisição (turmas):', url);
    
    const response = await fetch(url);
    console.log('Status da resposta (turmas):', response.status);
    
    const responseText = await response.text();
    console.log('Resposta bruta do servidor (turmas):', responseText);

    if (!responseText.trim()) {
      console.error('Resposta vazia do servidor (turmas)');
      alert('Erro: Resposta vazia do servidor de turmas. Verifique se o servidor está rodando.');
      return;
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Dados parseados (turmas):', data);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON (turmas):', e);
      console.error('Resposta que causou erro:', responseText);
      alert('Erro ao processar resposta do servidor de turmas. Veja o console para detalhes.');
      return;
    }

    if (response.ok) {
      if (Array.isArray(data)) {
        turmasDisponiveis = data;
      } else if (data.data && Array.isArray(data.data)) {
        turmasDisponiveis = data.data;
      } else if (data.mensagem) {
        console.log('Mensagem do servidor (turmas):', data.mensagem);
        turmasDisponiveis = [];
      } else {
        turmasDisponiveis = [];
      }
      console.log('Turmas carregadas:', turmasDisponiveis);
      atualizarSelectTurmas();
    } else {
      console.error('Erro ao carregar turmas:', data);
      alert((data.mensagem || data.erro || 'Erro ao carregar lista de turmas') + '\nVeja o console para detalhes.');
    }
  } catch (error) {
    console.error('Erro completo (turmas):', error);
    alert('Erro de conexão ao carregar turmas. Verifique se o servidor está rodando.');
  }
}

function atualizarSelectTurmas() {
  const select = document.getElementById("turmaSelect");
  if (!select) return;
  if (turmasDisponiveis.length > 0) {
    select.innerHTML = '<option value="">Selecione uma turma...</option>';
    turmasDisponiveis.forEach(turma => {
      const option = document.createElement('option');
      // usar nome_turma como value (ex: '1A', '1B') para compatibilidade com API de usuários
      option.value = turma.nome_turma || turma.nome || turma.codigo || turma.id_turma;
      option.dataset.id = turma.id_turma;
      option.textContent = turma.nome_turma || turma.nome || turma.codigo || turma.id_turma;
      select.appendChild(option);
    });
    select.disabled = false;
  } else {
    select.innerHTML = '<option value="">Nenhuma turma encontrada</option>';
    select.disabled = true;
  }
}

async function carregarODS() {
  try {
    console.log('Iniciando carregamento de ODS...');
    const apiBaseOds = (window.BASE_URL || '').replace(/\/$/, '');
    const url = apiBaseOds + '/api/ods';
    console.log('URL da requisição (ODS):', url);
    
    const response = await fetch(url);
    console.log('Status da resposta (ODS):', response.status);
    
    const responseText = await response.text();
    console.log('Resposta bruta do servidor (ODS):', responseText);

    if (!responseText.trim()) {
      console.error('Resposta vazia do servidor (ODS)');
      alert('Erro: Resposta vazia do servidor de ODS. Verifique se o servidor está rodando.');
      return;
    }

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Dados parseados (ODS):', data);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON (ODS):', e);
      console.error('Resposta que causou erro:', responseText);
      alert('Erro ao processar resposta do servidor de ODS. Veja o console para detalhes.');
      return;
    }

    if (response.ok) {
      if (Array.isArray(data)) {
        odsDisponiveis = data;
      } else if (data.data && Array.isArray(data.data)) {
        odsDisponiveis = data.data;
      } else if (data.mensagem) {
        console.log('Mensagem do servidor (ODS):', data.mensagem);
        odsDisponiveis = [];
      } else {
        odsDisponiveis = [];
      }
      console.log('ODS carregados:', odsDisponiveis);
      atualizarSelectODS();
    } else {
      console.error('Erro ao carregar ODS:', data);
      alert((data.mensagem || data.erro || data.error || 'Erro ao carregar lista de ODS') + '\nVeja o console para detalhes.');
    }
  } catch (error) {
    console.error('Erro completo (ODS):', error);
    alert('Erro de conexão ao carregar ODS. Verifique se o servidor está rodando.');
  }
}

function atualizarSelectODS() {
  let select = document.getElementById("odsSelect");
  if (!select) {
    const container = document.getElementById('odsContainer');
    if (container) {
      const wrapper = document.createElement('div');
      wrapper.className = 'ods-select-wrapper';
      wrapper.innerHTML = `<select class="integrantes-select" id="odsSelect"></select>`;
      container.insertBefore(wrapper, container.firstChild);
      select = document.getElementById('odsSelect');
      
      // Adicionar event listener quando o select é criado dinamicamente
      if (select) {
        select.addEventListener('change', function(e) {
          if (e.target.value) {
            adicionarODS();
          }
        });
      }
    }
  }
  if (!select) return;

  if (odsDisponiveis.length > 0) {
    select.innerHTML = '<option value="">Selecione um ODS...</option>';
    select.disabled = false;
    odsDisponiveis.forEach(ods => {
      const option = document.createElement('option');
      option.value = ods.id_ods;
      option.textContent = `ODS ${ods.id_ods} - ${ods.nome}`;
      select.appendChild(option);
    });
  } else {
    select.innerHTML = '<option value="">Nenhum ODS encontrado</option>';
    select.disabled = true;
  }
}

async function carregarAlunosPorTurma(turma) {
  try {
    console.log('Carregando alunos da turma:', turma);
    const base = (window.BASE_URL || '').replace(/\/$/, '');
    const url = `${base}/api/usuarios?turma=${encodeURIComponent(turma)}`;
    console.log('URL da requisição (alunos por turma):', url);
    
    const response = await fetch(url);
    console.log('Status da resposta (alunos por turma):', response.status);
    
    const responseText = await response.text();
    console.log('Resposta bruta do servidor (alunos por turma):', responseText);
    
    if (!responseText.trim()) {
      console.error('Resposta vazia do servidor (alunos por turma)');
      alert('Erro: Resposta vazia do servidor de alunos. Verifique se o servidor está rodando.');
      alunosDisponiveis = [];
      atualizarSelectIntegrantes();
      return;
    }

    // Verifica se a resposta JSON está completa
    const trimmed = responseText.trim();
    if (!trimmed.endsWith("}") && !trimmed.endsWith("]")) {
      console.error('Resposta JSON incompleta (alunos por turma):', responseText);
      alert('Resposta incompleta do servidor de alunos. Verifique se o servidor está rodando.');
      alunosDisponiveis = [];
      atualizarSelectIntegrantes();
      return;
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Dados parseados (alunos por turma):', data);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON (alunos por turma):', e);
      console.error('Resposta que causou erro:', responseText);
      alert('Erro ao processar resposta do servidor de alunos. Veja o console para detalhes.');
      alunosDisponiveis = [];
      atualizarSelectIntegrantes();
      return;
    }

    if (response.ok) {
      if (Array.isArray(data)) {
        alunosDisponiveis = data;
      } else if (data.data && Array.isArray(data.data)) {
        alunosDisponiveis = data.data;
      } else if (data.mensagem) {
        console.log('Mensagem do servidor (alunos por turma):', data.mensagem);
        alunosDisponiveis = [];
      } else {
        alunosDisponiveis = [];
      }
      console.log('Alunos da turma carregados:', alunosDisponiveis);
      atualizarSelectIntegrantes();
    } else {
      console.error('Erro ao carregar alunos da turma:', data);
      alert((data.mensagem || data.erro || 'Erro ao carregar alunos da turma') + '\nVeja o console para detalhes.');
      alunosDisponiveis = [];
      atualizarSelectIntegrantes();
    }
  } catch (error) {
    console.error('Erro completo (alunos por turma):', error);
    alert('Erro de conexão ao carregar alunos da turma. Verifique se o servidor está rodando.');
    alunosDisponiveis = [];
    atualizarSelectIntegrantes();
  }
}

async function atualizarSelectIntegrantes() {
  const select = document.getElementById("integrantesSelect");
  if (select && alunosDisponiveis.length > 0) {
    select.innerHTML = '<option value="">Selecione um integrante...</option>';
    select.disabled = false;
    alunosDisponiveis.forEach(aluno => {
      const option = document.createElement('option');
      option.value = aluno.id_aluno;
      option.textContent = aluno.nome_aluno;
      select.appendChild(option);
    });
  } else if (select) {
    select.innerHTML = '<option value="">Nenhum aluno encontrado na turma</option>';
    select.disabled = true;
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

function adicionarODS() {
  const select = document.getElementById("odsSelect");
  const selectedValue = select.value;
  const selectedText = select.options[select.selectedIndex].text;
  
  if (selectedValue && !selectedODS.has(selectedValue)) {
    selectedODS.add(selectedValue);
    updateODSList();
    select.value = "";
  }
}

function removerODS(id_ods) {
  selectedODS.delete(id_ods);
  updateODSList();
}

// NOVA IMPLEMENTAÇÃO: Gerenciamento de ODS integrado diretamente no JS
// Substitui o sistema anterior de ods-selector.js por uma abordagem mais simples e integrada
function updateODSList() {
  const listContainer = document.getElementById("odsSelectedList");
  
  if (!listContainer) {
    console.warn('Container odsSelectedList não encontrado');
    return;
  }
  
  if (selectedODS.size === 0) {
    listContainer.innerHTML = '<div class="ods-empty">Nenhum ODS selecionado</div>';
    return;
  }
  
  listContainer.innerHTML = Array.from(selectedODS).map(id_ods => {
    const ods = odsDisponiveis.find(o => o.id_ods == id_ods);
    const nome = ods ? `ODS ${ods.id_ods} - ${ods.nome}` : `ODS ${id_ods}`;
    return `
      <div class="ods-item">
        <span>${nome}</span>
        <button type="button" class="remove-ods-btn" onclick="removerODS('${id_ods}')">×</button>
      </div>
    `;
  }).join('');
}

function updateIntegrantesList() {
  const listContainer = document.getElementById("integrantesSelectedList");
  
  if (selectedIntegrantes.size === 0) {
    try {
      const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || '{}');
      const isProfessor = usuarioLogado.usuario && usuarioLogado.usuario.id_professor !== undefined;
      
      const mensagem = isProfessor 
        ? 'Nenhum integrante selecionado (opcional para professores)' 
        : 'Nenhum integrante selecionado';
        
      listContainer.innerHTML = `<div class="integrantes-empty">${mensagem}</div>`;
    } catch (error) {
      listContainer.innerHTML = '<div class="integrantes-empty">Nenhum integrante selecionado</div>';
    }
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

  // Verificar se há usuário logado
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  if (!usuarioLogado.usuario) {
    showErrorModal("Você precisa estar logado para criar um projeto. Redirecionando para o login...");
    setTimeout(() => {
      window.location.href = 'escolha-login.html';
    }, 2000);
    return;
  }

  // Verificar se é aluno ou professor
  const isAluno = usuarioLogado.usuario.id_aluno !== undefined;
  const isProfessor = usuarioLogado.usuario.id_professor !== undefined;

  // Validar campos obrigatórios
  if (!nomeProjeto || !descricao || !turmaSelecionada) {
    showErrorModal("Preencha todos os campos obrigatórios e selecione uma turma.");
    return;
  }

  // Para alunos, é obrigatório ter pelo menos um integrante
  // Para professores, é opcional
  if (isAluno && selectedIntegrantes.size === 0) {
    showErrorModal("Alunos devem selecionar pelo menos um integrante para o projeto.");
    return;
  }

  // Para professores, mostrar aviso se não há integrantes selecionados
  if (isProfessor && selectedIntegrantes.size === 0) {
    showConfirmModal("Você está criando um projeto sem integrantes. Deseja continuar?", function() {
      procederComCadastro();
    });
    return;
  }

  procederComCadastro();
}

async function procederComCadastro() {
  const nomeProjeto = document.getElementById("nomeProjeto").value;
  const descricao = document.getElementById("descricao").value;
  const objetivo = document.getElementById("objetivo").value;
  const justificativa = document.getElementById("justificativa").value;
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario') || '{}');
  const isAluno = usuarioLogado.usuario.id_aluno !== undefined;
  const isProfessor = usuarioLogado.usuario.id_professor !== undefined;

  // Agora enviamos os campos separados para o banco
  // Não precisamos mais combinar na descrição

  // Determinar criador baseado no tipo de usuário
  let criadorId, nomeCriador;
  if (isAluno) {
    criadorId = usuarioLogado.usuario.id_aluno;
    nomeCriador = usuarioLogado.usuario.nome_aluno;
  } else if (isProfessor) {
    criadorId = usuarioLogado.usuario.id_professor;
    nomeCriador = usuarioLogado.usuario.nome_professor;
  } else {
    alert("Tipo de usuário não reconhecido. Entre em contato com o administrador.");
    return;
  }

  const dados = {
    titulo_projeto: nomeProjeto,
    descricao: descricao,
    justificativa: justificativa,
    objetivo: objetivo,
    bloco: "", // Valor padrão
    sala: "", // Valor padrão
    posicao: null,
    orientador: "",
    turma: turmaSelecionada,
    integrantes: Array.from(selectedIntegrantes),
    ods: Array.from(selectedODS).map(id => parseInt(id)), // Converter para números
    criador_id: criadorId, // Campo esperado pelo backend
    criador: criadorId,
    nome_criador: nomeCriador,
    tipo_criador: isAluno ? 'aluno' : 'professor',
    professor_criador: isProfessor ? criadorId : null,
    aluno_criador: isAluno ? criadorId : null
  };

  // Debug: Log the data being sent
  console.log('Dados sendo enviados:', dados);

  try {
    const apiBaseProj = (window.BASE_URL || '').replace(/\/$/, '');
    const response = await fetch(apiBaseProj + '/api/projetos/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
      credentials: 'include' // Importante para manter sessão
    });

    const resultado = await response.json();

    if (response.ok) {
      showSuccessModal("Projeto cadastrado com sucesso!", function() {
        // Opcional: salvar id_projeto retornado
        if (resultado.id_projeto) {
          localStorage.setItem('ultimo_projeto_criado', resultado.id_projeto);
        }
        window.location.href = "escolher_projeto.php";
      });
    } else {
      showErrorModal("Erro ao cadastrar projeto: " + (resultado.erro || resultado.message || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    showErrorModal("Erro de conexão. Tente novamente.");
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