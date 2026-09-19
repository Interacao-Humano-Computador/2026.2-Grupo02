// Destaca automaticamente o link da página atual no menu
document.addEventListener("DOMContentLoaded", () => {
    // Identifica o nome do arquivo da página aberta (ex: "equipe.html", "atas.html")
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
    
    // Busca todos os links dentro do menu da navbar e sidebar
    const linksNavbar = document.querySelectorAll(".sidebar-links a, .navbar-links a");

    linksNavbar.forEach(link => {
        const hrefLink = link.getAttribute("href");

        // Reseta estados anteriores
        link.classList.remove("active");

        // Se o link corresponder à página aberta na URL ou for uma subpágina de planejamento
        const isPlanejamento = (paginaAtual.startsWith("plan_") || paginaAtual === "planejamento.html") && hrefLink === "planejamento.html";

        if (hrefLink === paginaAtual || isPlanejamento) {
            link.classList.add("active");
            
            // Só aplica a cor inline no tema normal (no alto contraste o CSS assume)
            if (!document.body.classList.contains("alto-contraste") && !link.classList.contains("btn-outline") && !link.classList.contains("sidebar-btn-outline") && hrefLink !== "dashboard.html") {
                link.style.color = "#a855f7";
                link.style.fontWeight = "600";
            }
        }
    });

    // Controle da sidebar em telas menores
    const openBtn = document.getElementById('sidebarOpenBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const sidebar = document.getElementById('sidebar');
    if (openBtn && sidebar) {
        openBtn.addEventListener('click', () => sidebar.classList.add('open'));
    }
    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
    }
});