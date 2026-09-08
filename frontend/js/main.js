document.addEventListener('DOMContentLoaded', () => {
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

    const navLinks = document.querySelectorAll('.navbar-links a');
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