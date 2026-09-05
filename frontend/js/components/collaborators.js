export const renderCollaborators = (commits, issues, teamMembers = []) => {
    const container = document.getElementById('collaborators-grid');
    if (!container) return;

    const users = {};

    // Inicializa todos os membros zerados, buscando a foto diretamente do GitHub
    teamMembers.forEach(login => {
        users[login] = { 
            name: `@${login}`, 
            login: login, 
            avatar: `https://github.com/${login}.png`, // Busca a foto oficial pelo @ do usuário
            commits: 0, openIssues: 0, closedIssues: 0, 
            lastMsg: "Aguardando primeira atividade..." 
        };
    });

    commits.forEach(c => {
        const email = c.commit.author.email;
        const login = c.author?.login || email.split('@')[0];
        const name = c.commit.author.name;

        if (users[login]) {
            // Atualiza para o nome real assim que o primeiro commit for feito
            users[login].name = name;
            users[login].commits++;
            users[login].lastMsg = c.commit.message;
        }
    });

    issues.forEach(i => {
        const login = i.user?.login;
        if (!login || !users[login]) return;

        if (i.state === 'open') {
            users[login].openIssues++;
        } else if (i.state === 'closed') {
            users[login].closedIssues++;
        }
    });

    const sortedUsers = Object.values(users).sort((a, b) => b.commits - a.commits);
    container.innerHTML = '';

    sortedUsers.forEach(u => {
        const card = document.createElement('div');
        card.className = 'collab-card';
        card.innerHTML = `
            <div class="collab-header">
                <img src="${u.avatar}" alt="${u.name}" class="collab-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${u.login}&background=09090b&color=a855f7'">
                <div class="collab-info">
                    <h4>${u.name}</h4>
                    <span>@${u.login}</span>
                </div>
            </div>
            <div class="collab-stats">
                <div class="c-stat-box">
                    <span class="c-stat-label">Commits</span>
                    <span class="c-stat-val text-purple">${u.commits}</span>
                </div>
                <div class="c-stat-box">
                    <span class="c-stat-label">Abertas</span>
                    <span class="c-stat-val text-amber" title="Issues Pendentes">${u.openIssues}</span>
                </div>
                <div class="c-stat-box">
                    <span class="c-stat-label">Fechadas</span>
                    <span class="c-stat-val text-emerald" title="Issues Entregues">${u.closedIssues}</span>
                </div>
            </div>
            <div class="collab-footer">
                <span class="c-footer-label">Último Despacho</span>
                <div class="c-footer-msg" title="${u.lastMsg}">"${u.lastMsg.split('\n')[0].replace(/"/g, '&quot;')}"</div>
            </div>
        `;
        container.appendChild(card);
    });
};