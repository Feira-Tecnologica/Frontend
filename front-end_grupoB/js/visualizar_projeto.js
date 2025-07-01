// Variáveis globais
let projetoAtual = null;

document.addEventListener('DOMContentLoaded', function() {
    carregarProjeto();
});

function carregarProjeto() {
    // Verificar se há um ID de projeto na URL ou localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const idProjeto = urlParams.get('id') || localStorage.getItem('projeto_visualizacao');
    
    if (idProjeto) {
        buscarDadosProjeto(idProjeto);
    } else {
        mostrarErro('Nenhum projeto selecionado para visualização');
    }
}

async function buscarDadosProjeto(idProjeto) {
    try {
        const response = await fetch('/Frontend/front-end_grupoB/api/projetos/buscar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_projeto: idProjeto })
        });

        if (response.ok) {
            projetoAtual = await response.json();
            atualizarInterface();
        } else {
            mostrarErro('Erro ao carregar dados do projeto');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarErro('Erro de conexão');
    }
}

function atualizarInterface() {
    if (!projetoAtual) return;

    // Atualizar título do projeto
    const tituloElement = document.querySelector('.project-name');
    if (tituloElement) {
        tituloElement.textContent = projetoAtual.titulo_projeto || 'Projeto sem título';
    }

    // Atualizar informações do stand
    const standElement = document.querySelector('.stand-info strong');
    if (standElement) {
        standElement.textContent = `STAND ${projetoAtual.posicao || 'N/A'}`;
    }

    const turmaElement = document.querySelector('.class-info span');
    if (turmaElement) {
        turmaElement.innerHTML = `${projetoAtual.turma || 'Turma não definida'}<br>Manhã`;
    }

    // Atualizar integrantes
    atualizarIntegrantes();

    // Atualizar descrição
    const descricaoElement = document.querySelector('.description-text');
    if (descricaoElement) {
        descricaoElement.textContent = projetoAtual.descricao || 'Descrição não disponível';
    }

    // Atualizar objetivo
    const objetivoElement = document.querySelector('.objetivo-text');
    if (objetivoElement) {
        objetivoElement.textContent = projetoAtual.objetivo || 'Objetivo não definido';
    }

    // Atualizar justificativa
    const justificativaElement = document.querySelector('.justificativa-text');
    if (justificativaElement) {
        justificativaElement.textContent = projetoAtual.justificativa || 'Justificativa não definida';
    }

    // Atualizar ODS
    atualizarODS();

    // Verificar se há notas para este projeto
    verificarNotas();
}

function atualizarIntegrantes() {
    const integrantesContainer = document.querySelector('.integrantes-display');
    if (!integrantesContainer) return;

    integrantesContainer.innerHTML = '';

    if (projetoAtual.integrantes) {
        const integrantes = projetoAtual.integrantes.split(', ');
        integrantes.forEach(nome => {
            const card = document.createElement('div');
            card.className = 'integrante-card';
            card.textContent = nome.trim();
            integrantesContainer.appendChild(card);
        });
    } else {
        integrantesContainer.innerHTML = '<p style="color: #666;">Nenhum integrante cadastrado</p>';
    }
}

function atualizarODS() {
    const odsContainer = document.querySelector('.ods-grid');
    if (!odsContainer) return;

    odsContainer.innerHTML = '';

    if (projetoAtual.ods_nomes) {
        const odsNomes = projetoAtual.ods_nomes.split(', ');
        odsNomes.forEach((nome, index) => {
            const odsCard = document.createElement('div');
            odsCard.className = 'ods-card';
            odsCard.innerHTML = `
                <div class="ods-number">${index + 1}</div>
                <div class="ods-name">${nome.trim()}</div>
            `;
            odsContainer.appendChild(odsCard);
        });
    } else {
        odsContainer.innerHTML = '<p style="color: #666;">Nenhuma ODS associada</p>';
    }
}

async function verificarNotas() {
    try {
        const response = await fetch('/Frontend/front-end_grupoB/api/notas/buscar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_projeto: projetoAtual.id_projeto })
        });

        if (response.ok) {
            const dadosNota = await response.json();
            if (dadosNota.criatividade !== null) {
                mostrarNotas(dadosNota);
            }
        }
    } catch (error) {
        console.error('Erro ao verificar notas:', error);
    }
}

function mostrarNotas(dadosNota) {
    // Criar seção de notas se não existir
    let secaoNotas = document.querySelector('.secao-notas');
    if (!secaoNotas) {
        secaoNotas = document.createElement('div');
        secaoNotas.className = 'section secao-notas';
        secaoNotas.innerHTML = `
            <h4 class="section-title">
                <i class="material-icons">grade</i>
                Avaliação
            </h4>
            <div class="notas-container"></div>
        `;
        
        const projectContent = document.querySelector('.project-content');
        if (projectContent) {
            projectContent.appendChild(secaoNotas);
        }
    }

    const notasContainer = secaoNotas.querySelector('.notas-container');
    if (notasContainer) {
        notasContainer.innerHTML = `
            <div class="notas-grid">
                <div class="nota-item">
                    <span>Criatividade:</span>
                    <span class="nota-valor">${dadosNota.criatividade}</span>
                </div>
                <div class="nota-item">
                    <span>Capricho:</span>
                    <span class="nota-valor">${dadosNota.capricho}</span>
                </div>
                <div class="nota-item">
                    <span>Abordagem:</span>
                    <span class="nota-valor">${dadosNota.abordagem}</span>
                </div>
                <div class="nota-item">
                    <span>Domínio:</span>
                    <span class="nota-valor">${dadosNota.dominio}</span>
                </div>
                <div class="nota-item">
                    <span>Postura:</span>
                    <span class="nota-valor">${dadosNota.postura}</span>
                </div>
                <div class="nota-item">
                    <span>Oralidade:</span>
                    <span class="nota-valor">${dadosNota.oralidade}</span>
                </div>
                <div class="nota-resumo">
                    <div class="media-final">
                        <span>Média:</span>
                        <span class="nota-valor destaque">${dadosNota.media}</span>
                    </div>
                    <div class="mencao-final">
                        <span>Menção:</span>
                        <span class="mencao-valor destaque">${dadosNota.mencao}</span>
                    </div>
                </div>
                ${dadosNota.comentario ? `
                    <div class="comentario">
                        <strong>Comentário:</strong>
                        <p>${dadosNota.comentario}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

function mostrarErro(mensagem) {
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
