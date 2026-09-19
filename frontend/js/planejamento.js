document.addEventListener('DOMContentLoaded', () => {
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'planejamento.html';

    // Gerencia o menu de navegação principal (Navbar / Sidebar)
    const navLinks = document.querySelectorAll('.sidebar-links a, .navbar-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if ((currentPath.startsWith('plan_') || currentPath === 'planejamento.html') && href === 'planejamento.html') {
            link.classList.add('active');
            link.style.color = '#a855f7';
            link.style.fontWeight = '600';
        } else if (href === currentPath) {
            link.classList.add('active');
            link.style.color = '#a855f7';
            link.style.fontWeight = '600';
        } else {
            if (!link.classList.contains('btn-outline') && !link.classList.contains('sidebar-btn-outline') && href !== 'dashboard.html') {
                link.classList.remove('active');
                link.style.color = '#a1a1aa';
                link.style.fontWeight = '500';
            }
        }
    });

    // Gerencia as abas/botões do Submenu (onde aplicável)
    const submenuLinks = document.querySelectorAll('.submenu-nav a');
    submenuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
