const btnContraste = document.getElementById('btnContraste');

    function aplicarEstadoContraste(ativo) {
        if (ativo) {
            document.body.classList.add('alto-contraste');
            if (btnContraste) btnContraste.textContent = '☀️ Modo Normal';
        } else {
            document.body.classList.remove('alto-contraste');
            if (btnContraste) btnContraste.textContent = '🌓 Alto Contraste';
        }
    }

    // 1. Aplica o estado salvo no localStorage assim que a página carrega
    const contrasteSalvo = localStorage.getItem('altoContraste') === 'true';
    aplicarEstadoContraste(contrasteSalvo);

    // 2. Escuta o clique no botão
    if (btnContraste) {
        btnContraste.addEventListener('click', () => {
            const estadoAtual = document.body.classList.contains('alto-contraste');
            const novoEstado = !estadoAtual;
            
            aplicarEstadoContraste(novoEstado);
            localStorage.setItem('altoContraste', novoEstado);
        });
    }