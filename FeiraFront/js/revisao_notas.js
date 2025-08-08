// Variáveis globais
let projetosComNotas = [];

document.addEventListener('DOMContentLoaded', function() {
    carregarProjetosComNotas();
});

async function carregarProjetosComNotas() {
    try {
        const response = await fetch('/Frontend/front-end_grupoB/api/notas/projetos');
        if (response.ok) {
            projetosComNotas = await response.json();
            renderizarListaProjetos();
        } else {
            console.error('Erro ao carregar projetos com notas');
            mostrarMensagemErro('Erro ao carregar projetos');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagemErro('Erro de conexão');
    }
}

function renderizarListaProjetos() {
    const container = document.querySelector('.content-container');
    
    // Criar nova estrutura para lista de projetos
    container.innerHTML = `
        <div class="avaliacao">
            <div class="header-avaliacao">
                <a href="escolher_projeto.html"><i class="material-icons">arrow_back_ios</i></a>
                <div class="breadcrumb">
                    <h2 class="card-title">Revisão de Notas</h2>
                </div>
            </div>
            
            <div class="projetos-avaliados">
                <h1><strong>Projetos</strong><br>Avaliados</h1>
                
                <div class="filtros">
                    <div class="search">
                        <span class="material-icons">search</span>
                        <input type="text" placeholder="Pesquisar projeto..." id="searchInput">
                    </div>
                    <select id="filtroStatus">
                        <option value="">Todos os projetos</option>
                        <option value="Avaliado">Avaliados</option>
                        <option value="Pendente">Pendentes</option>
                    </select>
                </div>
                
                <div class="lista-projetos" id="listaProjetos">
                    <!-- Projetos serão inseridos aqui -->
                </div>
            </div>
        </div>
    `;

    configurarFiltros();
    renderizarProjetos();
}

function configurarFiltros() {
    const searchInput = document.getElementById('searchInput');
    const filtroStatus = document.getElementById('filtroStatus');

    if (searchInput) {
        searchInput.addEventListener('input', filtrarProjetos);
    }

    if (filtroStatus) {
        filtroStatus.addEventListener('change', filtrarProjetos);
    }
}

function filtrarProjetos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filtroStatus').value;

    let projetosFiltrados = projetosComNotas;

    // Filtrar por termo de busca
    if (searchTerm) {
        projetosFiltrados = projetosFiltrados.filter(projeto =>
            projeto.titulo_projeto.toLowerCase().includes(searchTerm) ||
            (projeto.integrantes && projeto.integrantes.toLowerCase().includes(searchTerm))
        );
    }

    // Filtrar por status
    if (statusFilter) {
        projetosFiltrados = projetosFiltrados.filter(projeto =>
            projeto.status_avaliacao === statusFilter
        );
    }

    renderizarProjetos(projetosFiltrados);
}

function renderizarProjetos(projetos = projetosComNotas) {
    const listaProjetos = document.getElementById('listaProjetos');
    
    if (!listaProjetos) return;

    if (projetos.length === 0) {
        listaProjetos.innerHTML = `
            <div class="no-projects">
                <p>Nenhum projeto encontrado.</p>
            </div>
        `;
        return;
    }

    listaProjetos.innerHTML = projetos.map(projeto => `
        <div class="projeto-card ${projeto.status_avaliacao.toLowerCase()}">
            <div class="projeto-info">
                <h3 class="projeto-titulo">${projeto.titulo_projeto}</h3>
                <div class="projeto-detalhes">
                    <span class="stand">STAND ${projeto.posicao || 'N/A'}</span>
                    <span class="turma">${projeto.turma || 'Turma não definida'}</span>
                    <span class="orientador">Orientador: ${projeto.orientador || 'Não definido'}</span>
                </div>
                <div class="integrantes">
                    <i class="material-icons">group</i>
                    <span>${projeto.integrantes || 'Sem integrantes'}</span>
                </div>
            </div>
            
            <div class="status-avaliacao">
                <span class="status-badge ${projeto.status_avaliacao.toLowerCase()}">
                    ${projeto.status_avaliacao}
                </span>
                ${projeto.media ? `
                    <div class="media-projeto">
                        <span class="media-label">Média:</span>
                        <span class="media-valor">${projeto.media}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="acoes-projeto">
                <button class="btn-visualizar" onclick="visualizarNotas('${projeto.id_projeto}')">
                    <i class="material-icons">visibility</i>
                    Visualizar
                </button>
                ${projeto.status_avaliacao === 'Pendente' ? `
                    <button class="btn-avaliar" onclick="avaliarProjeto('${projeto.id_projeto}')">
                        <i class="material-icons">grade</i>
                        Avaliar
                    </button>
                ` : `
                    <button class="btn-editar" onclick="editarNotas('${projeto.id_projeto}')">
                        <i class="material-icons">edit</i>
                        Editar Nota
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

function visualizarNotas(idProjeto) {
    localStorage.setItem('projeto_visualizacao', idProjeto);
    window.location.href = 'visualizar_projeto.html';
}

function avaliarProjeto(idProjeto) {
    localStorage.setItem('projeto_avaliacao', idProjeto);
    window.location.href = 'notas_professores.html';
}

function editarNotas(idProjeto) {
    localStorage.setItem('projeto_avaliacao', idProjeto);
    window.location.href = 'notas_professores.html';
}

function mostrarMensagemErro(mensagem) {
    const container = document.querySelector('.content-container');
    if (container) {
        container.innerHTML = `
            <div class="error-container">
                <h2>Erro</h2>
                <p>${mensagem}</p>
                <a href="escolher_projeto.html" class="btn-voltar">Voltar aos Projetos</a>
            </div>
        `;
    }
}