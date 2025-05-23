document.addEventListener('DOMContentLoaded', function() {
    const criterios = [
        { nome: 'Oralidade', nota: 8.5 },
        { nome: 'Postura', nota: 9.0 },
        { nome: 'Organização', nota: 7.5 },
        { nome: 'Criatividade', nota: 8.0 },
        { nome: 'Capricho', nota: 9.5 },
        { nome: 'Domínio', nota: 8.0 },
        { nome: 'Abordagem', nota: 9.0 }
    ];

    const notasContainer = document.getElementById('notasContainer');
    const mediaFinal = document.getElementById('mediaFinal');
    const btnEditar = document.getElementById('btnEditar');
    const btnVoltar = document.getElementById('btnVoltar');

    // Função para calcular a média
    function calcularMedia(notas) {
        const soma = notas.reduce((acc, curr) => acc + curr.nota, 0);
        return (soma / notas.length).toFixed(1);
    }

    // Função para renderizar as notas
    function renderizarNotas(notas, editavel = false) {
        notasContainer.innerHTML = '';
        
        notas.forEach(criterio => {
            const linha = document.createElement('div');
            linha.className = 'linha-item';
            linha.innerHTML = `
                <span class="criterio">${criterio.nome}</span>
                <span class="nota">
                    <input type="number" 
                           value="${criterio.nota}" 
                           class="input-nota" 
                           min="0" 
                           max="10" 
                           step="0.1"
                           ${editavel ? '' : 'readonly'}
                           onchange="atualizarNota('${criterio.nome}', this.value)">
                </span>
            `;
            notasContainer.appendChild(linha);
        });

        mediaFinal.value = calcularMedia(notas);
    }

    // Iniciar com as notas em modo visualização
    renderizarNotas(criterios, false);

    // Alternar entre modo de edição e visualização
    btnEditar.addEventListener('click', function() {
        const estaEditando = btnEditar.textContent === 'Salvar';
        
        if (estaEditando) {
            // Salvar alterações
            const inputs = document.querySelectorAll('.input-nota:not(.media)');
            inputs.forEach((input, index) => {
                criterios[index].nota = parseFloat(input.value);
            });
            renderizarNotas(criterios, false);
            btnEditar.textContent = 'Editar';
        } else {
            // Entrar no modo de edição
            renderizarNotas(criterios, true);
            btnEditar.textContent = 'Salvar';
        }
    });

    // Função para atualizar nota individual
    window.atualizarNota = function(criterio, valor) {
        const nota = parseFloat(valor);
        if (nota >= 0 && nota <= 10) {
            const index = criterios.findIndex(c => c.nome === criterio);
            if (index !== -1) {
                criterios[index].nota = nota;
                mediaFinal.value = calcularMedia(criterios);
            }
        }
    };

    // Voltar para a página anterior
    btnVoltar.addEventListener('click', function() {
        window.history.back();
    });
});