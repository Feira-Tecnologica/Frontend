// Variáveis globais
let projetoAtual = null;

document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmar = document.getElementById('btnConfirmar');
    const confirmModal = document.getElementById('confirmModal');
    const successModal = document.getElementById('successModal');
    const btnSim = document.getElementById('btnSim');
    const btnNao = document.getElementById('btnNao');
    const btnOk = document.getElementById('btnOk');

    // Carregar informações do projeto (pode vir da URL ou localStorage)
    carregarProjeto();

    // Abrir o modal quando clicar em "Confirmar"
    btnConfirmar.addEventListener('click', function() {
        if (validarNotas()) {
            confirmModal.classList.add('show');
        }
    });

    // Fechar o modal quando clicar em "Não"
    btnNao.addEventListener('click', function() {
        confirmModal.classList.remove('show');
    });

    // Quando clicar em "Sim"
    btnSim.addEventListener('click', function() {
        enviarNotas();
    });

    // Quando clicar em "OK" no modal de sucesso
    btnOk.addEventListener('click', function() {
        successModal.classList.remove('show');
        // Redirecionar para revisão de notas
        window.location.href = 'revisao_notas.html';
    });

    // Fechar os modais se clicar fora deles
    window.addEventListener('click', function(event) {
        if (event.target === confirmModal) {
            confirmModal.classList.remove('show');
        }
        if (event.target === successModal) {
            successModal.classList.remove('show');
        }
    });
});

function carregarProjeto() {
    // Verificar se há um ID de projeto na URL ou localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const idProjeto = urlParams.get('id') || localStorage.getItem('projeto_avaliacao');
    
    if (idProjeto) {
        buscarDadosProjeto(idProjeto);
    } else {
        // Se não há projeto específico, pode carregar uma lista ou mostrar erro
        console.warn('Nenhum projeto selecionado para avaliação');
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
            atualizarInterfaceProjeto();
        } else {
            console.error('Erro ao carregar dados do projeto');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

function atualizarInterfaceProjeto() {
    if (!projetoAtual) return;

    // Atualizar informações do projeto na interface
    const tituloElement = document.querySelector('.atribuir-nota h1');
    if (tituloElement) {
        tituloElement.innerHTML = `<strong>${projetoAtual.titulo_projeto}</strong>`;
    }

    const standElement = document.querySelector('.stand-text');
    if (standElement) {
        standElement.innerHTML = `
            <strong>STAND ${projetoAtual.posicao || '24'}</strong>
            <p>${projetoAtual.turma || 'Informática - 3C'}<br>Manhã</p>
        `;
    }
}

function validarNotas() {
    const inputs = document.querySelectorAll('.form-control');
    let todasValidas = true;
    
    inputs.forEach(input => {
        const valor = parseFloat(input.value);
        if (isNaN(valor) || valor < 0 || valor > 10) {
            todasValidas = false;
            input.style.borderColor = '#ff4444';
        } else {
            input.style.borderColor = '';
        }
    });

    if (!todasValidas) {
        alert('Por favor, preencha todas as notas com valores entre 0 e 10.');
    }

    return todasValidas;
}

async function enviarNotas() {
    if (!projetoAtual) {
        alert('Erro: Projeto não identificado.');
        return;
    }

    // Capturar valores dos inputs
    const inputs = document.querySelectorAll('.form-control');
    const valores = {};
    
    inputs.forEach((input, index) => {
        const criterios = ['oralidade', 'postura', 'organizacao', 'criatividade', 'capricho', 'dominio', 'abordagem'];
        valores[criterios[index]] = parseFloat(input.value);
    });

    const dadosNota = {
        id_projeto: projetoAtual.id_projeto,
        criatividade: valores.criatividade,
        capricho: valores.capricho,
        abordagem: valores.abordagem,
        dominio: valores.dominio,
        postura: valores.postura,
        oralidade: valores.oralidade,
        comentario: '', // Pode adicionar um campo de comentário se necessário
        organizacao: valores.organizacao.toString() // Converter para string se necessário
    };

    try {
        const response = await fetch('/Frontend/front-end_grupoB/api/notas/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosNota)
        });

        const resultado = await response.json();

        if (response.ok) {
            // Fechar modal de confirmação
            document.getElementById('confirmModal').classList.remove('show');
            
            // Mostrar modal de sucesso
            document.getElementById('successModal').classList.add('show');
            
            // Mostrar a média e menção se disponível
            if (resultado.media && resultado.mencao) {
                console.log(`Média: ${resultado.media}, Menção: ${resultado.mencao}`);
            }
        } else {
            alert('Erro ao salvar notas: ' + resultado.erro);
            document.getElementById('confirmModal').classList.remove('show');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão. Tente novamente.');
        document.getElementById('confirmModal').classList.remove('show');
    }
}
