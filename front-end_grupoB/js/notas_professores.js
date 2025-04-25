document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmar = document.getElementById('btnConfirmar');
    const confirmModal = document.getElementById('confirmModal');
    const successModal = document.getElementById('successModal');
    const btnSim = document.getElementById('btnSim');
    const btnNao = document.getElementById('btnNao');
    const btnOk = document.getElementById('btnOk');

    // Abrir o modal quando clicar em "Confirmar"
    btnConfirmar.addEventListener('click', function() {
        // Verificar se todas as notas foram preenchidas
        const notas = document.querySelectorAll('.input-nota');
        let todasPreenchidas = true;
        
        notas.forEach(nota => {
            if (nota.value === '' || parseFloat(nota.value) < 0 || parseFloat(nota.value) > 10) {
                todasPreenchidas = false;
            }
        });

        if (!todasPreenchidas) {
            alert('Por favor, preencha todas as notas com valores entre 0 e 10.');
            return;
        }

        // Mostrar modal de confirmação
        confirmModal.classList.add('show');
    });

    // Fechar o modal quando clicar em "Não"
    btnNao.addEventListener('click', function() {
        confirmModal.classList.remove('show');
    });

    // Quando clicar em "Sim"
    btnSim.addEventListener('click', function() {
        // Fechar o modal de confirmação
        confirmModal.classList.remove('show');
        
        // Mostrar o modal de sucesso
        successModal.classList.add('show');
        
        // Aqui você pode adicionar a lógica para salvar as notas
        // Por exemplo, enviar para um servidor, armazenar localmente, etc.
    });

    // Quando clicar em "OK" no modal de sucesso
    btnOk.addEventListener('click', function() {
        successModal.classList.remove('show');
        
        // Você pode redirecionar para outra página após confirmar
        // window.location.href = 'pagina_de_sucesso.html';
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
