// Destaca automaticamente o link da página atual no menu
document.addEventListener("DOMContentLoaded", () => {
    // Identifica o nome do arquivo da página aberta (ex: "equipe.html", "atas.html")
    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
    
    // Busca todos os links dentro do menu da navbar
    const linksNavbar = document.querySelectorAll(".navbar-links a");

    linksNavbar.forEach(link => {
        const hrefLink = link.getAttribute("href");

        // Reseta estados anteriores
        link.classList.remove("active");

        // Se o link corresponder à página aberta na URL, aplica o destaque
        if (hrefLink === paginaAtual) {
            link.classList.add("active");
            
            // Só aplica a cor inline no tema normal (no alto contraste o CSS assume)
            if (!document.body.classList.contains("alto-contraste") && !link.classList.contains("btn-outline") && hrefLink !== "dashboard.html") {
                link.style.color = "#a855f7";
                link.style.fontWeight = "600";
            }
        }
    });
});