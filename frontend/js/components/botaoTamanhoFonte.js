(function () {
    const CHAVE = 'tamanhoFonte';
    const TAMANHOS = [85, 90, 95, 100, 110, 120, 130, 140, 150];
    const INDICE_PADRAO = 1;

    function getIndiceSalvo() {
        const salvo = parseInt(localStorage.getItem(CHAVE), 10);
        if(Number.isInteger(salvo) && salvo >= 0 && salvo < TAMANHOS.length){
            return salvo;
        }
        return INDICE_PADRAO;
    }

    function atualizaEstadoBotao(indice){
        const botaoMenos = document.getElementById('botaoDiminuiFonte');
        const botaoMais = document.getElementById('botaoAumentaFonte');
        if(botaoMenos) botaoMenos.disabled = indice === 0;
        if (botaoMais) botaoMais.disabled = indice === TAMANHOS.lenght - 1;
    }

    function aplicaAlteracao(indice) {
        document.documentElement.style.fontSize = TAMANHOS[indice] + '%';
        atualizaEstadoBotao(indice);
    }

    function alteraTamanhoFonte(delta) {
        let indice = getIndiceSalvo();
        indice = Math.min(TAMANHOS.length - 1, Math.max(0, indice + delta));
        localStorage.setItem(CHAVE, indice);
        aplicaAlteracao(indice);
    }

    
})