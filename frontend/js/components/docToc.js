// Monta o índice ("Índice") da página a partir dos títulos do conteúdo e destaca a seção visível.
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('docTocList');
    const content = document.querySelector('.doc-content');
    if (!list || !content) return;

    const heads = [...content.querySelectorAll('h1, h2, h3, h4')]
        .filter(h => !h.closest('.doc-history') && h.textContent.trim());
    if (heads.length < 2) { list.closest('.doc-toc').hidden = true; return; }

    const used = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
    heads.forEach((h, i) => {
        if (!h.id) {
            let id = 'sec-' + (i + 1);
            while (used.has(id)) id += '-x';
            h.id = id; used.add(id);
        }
        const li = document.createElement('li');
        li.className = 'lvl-' + h.tagName.slice(1);
        const a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.replace(/\s+/g, ' ').trim();
        li.appendChild(a);
        list.appendChild(li);
    });

    const links = [...list.querySelectorAll('a')];
    let ticking = false;
    const update = () => {
        ticking = false;
        let current = 0;
        heads.forEach((h, i) => { if (h.getBoundingClientRect().top <= 24) current = i; });
        links.forEach((a, i) => a.classList.toggle('active', i === current));
        const toc = list.closest('.doc-toc'), act = links[current];
        if (toc && act) {
            const t = act.getBoundingClientRect(), c = toc.getBoundingClientRect();
            if (t.top < c.top + 40) toc.scrollTop -= (c.top + 40 - t.top);
            else if (t.bottom > c.bottom - 8) toc.scrollTop += (t.bottom - c.bottom + 8);
        }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // no celular o menu da entrega é uma faixa horizontal: mostra o item ativo
    const ativo = document.querySelector('.doc-stagenav a.active');
    if (ativo) ativo.closest('ul').scrollLeft = Math.max(0, ativo.offsetLeft - 16);
});
