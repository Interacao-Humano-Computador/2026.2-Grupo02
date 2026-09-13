(function () {
    const CHAVE = 'tamanhoFonte';
    const TAMANHOS = [87.5, 100, 112.5, 125, 137.5, 150];
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
        if (botaoMais) botaoMais.disabled = indice === TAMANHOS.length - 1;
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

    function criarBotoes() {
        const botaoMenos = document.createElement('button');
        botaoMenos.id = 'botaoDiminuiFonte';
        botaoMenos.className = 'botao-fonte-icon';
        botaoMenos.type = 'button';
        botaoMenos.setAttribute('aria-label', 'Diminuir tamanho do texto');
        botaoMenos.setAttribute('title', 'Diminuir tamanho do texto');
        botaoMenos.textContent = 'A-';
        botaoMenos.addEventListener('click', () => alteraTamanhoFonte(-1));

        const botaoMais = document.createElement('button');
        botaoMais.id = 'botaoAumentaFonte';
        botaoMais.className = 'botao-fonte-icon';
        botaoMais.type = 'button';
        botaoMais.setAttribute('aria-label', 'Aumentar tamanho do texto');
        botaoMais.setAttribute('title', 'Aumentar tamanho do texto');
        botaoMais.textContent = 'A+';
        botaoMais.addEventListener('click', () => alteraTamanhoFonte(1));

        const container = document.querySelector('.navbar-links') || document.querySelector('.dash-controls');
        const botaoContraste = document.getElementById('btnContraste');

        if(container){
            if (botaoContraste && botaoContraste.parentNode === container) {
                container.insertBefore(botaoMenos, botaoContraste);
                container.insertBefore(botaoMais, botaoContraste);
            } else {
                container.appendChild(botaoMenos);
                container.appendChild(botaoMais);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if(!document.getElementById('botaoDiminuiFonte') && !document.getElementById('botaoAumentaFonte')) {
            criarBotoes();
        }
        aplicaAlteracao(getIndiceSalvo());
    })
})()