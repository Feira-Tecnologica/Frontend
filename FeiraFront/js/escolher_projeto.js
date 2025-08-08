// Variáveis globais
let projetos = [];
let projetosFiltrados = [];

document.addEventListener('DOMContentLoaded', function() {
    carregarProjetos();
    configurarPesquisa();
});

async function carregarProjetos() {
    try {
        const response = await fetch('../Backend/Api-PHP/api/projetos');
        if (response.ok) {
            projetos = await response.json();
            projetosFiltrados = [...projetos];
            renderizarProjetos();
        } else {
            console.error('Erro ao carregar projetos');
            mostrarMensagemErro('Erro ao carregar projetos');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagemErro('Erro de conexão');
    }
}

function renderizarProjetos() {
    const container = document.querySelector('.content-container');
    
    // Remover cards existentes
    const cardsExistentes = container.querySelectorAll('.project-card');
    cardsExistentes.forEach(card => card.remove());

    if (projetosFiltrados.length === 0) {
        const mensagem = document.createElement('div');
        mensagem.className = 'no-projects';
        mensagem.style.textAlign = 'center';
        mensagem.style.padding = '20px';
        mensagem.style.color = '#666';
        mensagem.innerHTML = '<p>Nenhum projeto encontrado.</p>';
        container.appendChild(mensagem);
        return;
    }

    // Criar cards para cada projeto
    projetosFiltrados.forEach(projeto => {
        const card = criarCardProjeto(projeto);
        container.appendChild(card);
    });
}

function criarCardProjeto(projeto) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Determinar o criador (primeiro integrante ou orientador)
    const criador = projeto.integrantes ? 
                   projeto.integrantes.split(', ')[0] : 
                   projeto.orientador || 'Não definido';

    card.innerHTML = `
        <h3>${projeto.titulo_projeto}</h3>
        <p>Criador: ${criador}</p>
        <p>STAND ${projeto.posicao || 'N/A'}</p>
        <div class="card-actions">
            <button class="btn-enter" onclick="visualizarProjeto('${projeto.id_projeto}')">Visualizar</button>
            <button class="btn-avaliar" onclick="avaliarProjeto('${projeto.id_projeto}')">Avaliar</button>
        </div>
    `;

    return card;
}

function configurarPesquisa() {
    const inputPesquisa = document.querySelector('.search input');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', function(e) {
            const termo = e.target.value.toLowerCase();
            filtrarProjetos(termo);
        });
    }
}

function filtrarProjetos(termo) {
    if (!termo) {
        projetosFiltrados = [...projetos];
    } else {
        projetosFiltrados = projetos.filter(projeto => 
            projeto.titulo_projeto.toLowerCase().includes(termo) ||
            (projeto.integrantes && projeto.integrantes.toLowerCase().includes(termo)) ||
            (projeto.orientador && projeto.orientador.toLowerCase().includes(termo))
        );
    }
    renderizarProjetos();
}

function visualizarProjeto(idProjeto) {
    // Salvar ID do projeto para usar na página de visualização
    localStorage.setItem('projeto_visualizacao', idProjeto);
    window.location.href = 'visualizar_projeto.html';
}

function avaliarProjeto(idProjeto) {
    // Salvar ID do projeto para usar na página de avaliação
    localStorage.setItem('projeto_avaliacao', idProjeto);
    window.location.href = 'notas_professores.html';
}

function abrirProjeto(nome) {
    // Função mantida para compatibilidade
    alert("Abrindo: " + nome);
}

function mostrarMensagemErro(mensagem) {
    const container = document.querySelector('.content-container');
    const erro = document.createElement('div');
    erro.className = 'error-message';
    erro.style.textAlign = 'center';
    erro.style.padding = '20px';
    erro.style.color = '#ff4444';
    erro.innerHTML = `<p>${mensagem}</p>`;
    container.appendChild(erro);
}
