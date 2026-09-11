document.addEventListener('DOMContentLoaded', () => {
    let btnContraste = document.getElementById('btnContraste');
    
    // Se não encontrar o botão na página, ele cria e insere automaticamente na navbar
    if (!btnContraste) {
        const navbarLinks = document.querySelector('.navbar-links');
        if (navbarLinks) {
            btnContraste = document.createElement('button');
            btnContraste.id = 'btnContraste';
            navbarLinks.appendChild(btnContraste);
        }
    }

    if (!btnContraste) return;

    // Configura a classe e atributos de acessibilidade
    btnContraste.className = 'btn-contraste-icon';
    btnContraste.setAttribute('aria-label', 'Alternar Contraste');
    btnContraste.setAttribute('title', 'Alternar Contraste');

    // Injeta os dois vetores SVG (Estrela Normal e Estrela com Lua)
    btnContraste.innerHTML = `
        <svg class="icon-sun" width="22" height="22" viewBox="0 0 24 24">
            <path d="M12 2L14.5 5.5L19 4.5L18.5 9L22 12L18.5 15L19 19.5L14.5 18.5L12 22L9.5 18.5L5 19.5L5.5 15L2 12L5.5 9L5 4.5L9.5 5.5L12 2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg class="icon-moon" width="22" height="22" viewBox="0 0 24 24" style="display: none;">
            <path d="M12 2L14.5 5.5L19 4.5L18.5 9L22 12L18.5 15L19 19.5L14.5 18.5L12 22L9.5 18.5L5 19.5L5.5 15L2 12L5.5 9L5 4.5L9.5 5.5L12 2Z" fill="currentColor"/>
            <path d="M12 7A5 5 0 0 0 12 17A3.5 3.5 0 0 1 12 7Z" fill="#ffffff"/>
        </svg>
    `;

    // Função para aplicar o modo de alto contraste
    function aplicarEstado(ativo) {
        if (ativo) {
            document.body.classList.add('alto-contraste');
        } else {
            document.body.classList.remove('alto-contraste');
        }
    }

    // Carrega o estado salvo no navegador
    const contrasteSalvo = localStorage.getItem('altoContraste') === 'true';
    aplicarEstado(contrasteSalvo);

    // Evento de clique para alternar
    btnContraste.addEventListener('click', () => {
        const estadoAtual = document.body.classList.contains('alto-contraste');
        const novoEstado = !estadoAtual;
        
        aplicarEstado(novoEstado);
        localStorage.setItem('altoContraste', novoEstado);
    });
});