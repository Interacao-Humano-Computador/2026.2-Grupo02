// Caminho: frontend/js/main.js

import { initMenuEntregas } from './components/menuEntregas.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o menu de entregas caso a div exista na página
    initMenuEntregas('menu-entregas-container');

    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

    const navLinks = document.querySelectorAll('.navbar-links a, .dash-header a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
            link.style.color = '#a855f7';
            link.style.fontWeight = '600';
        } else {
            link.classList.remove('active');
            link.style.color = '#a1a1aa';
            link.style.fontWeight = '500';
        }
    });
});