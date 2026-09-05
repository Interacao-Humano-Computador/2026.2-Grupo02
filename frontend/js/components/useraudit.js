export const renderUserAudit = (commits, issues, teamMembers = []) => {
    const select = document.getElementById('audit-user-select');
    const logList = document.getElementById('audit-log-list');
    const badgeCommits = document.getElementById('audit-badge-commits');
    const badgeIssues = document.getElementById('audit-badge-issues');

    if (!select || !logList) return;

    select.innerHTML = '<option value="all">Todos os Membros</option>';
    teamMembers.sort().forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = `@${user}`;
        select.appendChild(option);
    });

    const updateAudit = (selectedUser) => {
        logList.innerHTML = '';

        let userCommits = commits;
        let userIssues = issues;

        if (selectedUser !== 'all') {
            userCommits = commits.filter(c => (c.author?.login || c.commit.author.name) === selectedUser);
            userIssues = issues.filter(i => i.user?.login === selectedUser);
        }

        if (badgeCommits) badgeCommits.textContent = `${userCommits.length} Commits`;
        if (badgeIssues) badgeIssues.textContent = `${userIssues.length} Issues/PRs`;

        const combinedLog = [
            ...userCommits.map(c => ({
                type: 'commit',
                date: new Date(c.commit.author.date),
                title: c.commit.message.split('\n')[0].replace(/"/g, '&quot;'),
                url: `https://github.com/Interacao-Humano-Computador/2026.2-Grupo02/commit/${c.sha}`
            })),
            ...userIssues.map(i => ({
                type: i.pull_request ? 'pr' : 'issue',
                date: new Date(i.created_at),
                title: i.title,
                url: i.html_url,
                state: i.state
            }))
        ].sort((a, b) => b.date - a.date).slice(0, 50);

        if (combinedLog.length === 0) {
            logList.innerHTML = `<div class="placeholder-text" style="padding: 16px; text-align: center; color: var(--text-muted);">Nenhuma atividade registrada ainda.</div>`;
            return;
        }

        combinedLog.forEach(item => {
            const dateStr = item.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            
            let icon = '⚲';
            let color = 'var(--accent-primary)';
            let typeTitle = 'Commit';
            
            if (item.type === 'issue') { 
                icon = '!'; 
                color = item.state === 'closed' ? 'var(--accent-emerald)' : 'var(--accent-amber)';
                typeTitle = item.state === 'closed' ? 'Issue Resolvida' : 'Issue Aberta';
            }
            if (item.type === 'pr') { 
                icon = '⎇'; 
                color = '#d8b4fe'; 
                typeTitle = 'Pull Request';
            }

            const row = document.createElement('div');
            row.style.cssText = `display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center;`;
            
            row.innerHTML = `
                <div style="color: ${color}; font-weight: 900; font-size: 1.2rem; min-width: 20px; text-align: center;" title="${typeTitle}">${icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <a href="${item.url}" target="_blank" style="color: var(--text-light); text-decoration: none; font-size: 0.8rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s;" onmouseover="this.style.color='${color}'" onmouseout="this.style.color='var(--text-light)'">
                        ${item.title}
                    </a>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);">${dateStr}</div>
            `;
            logList.appendChild(row);
        });
    };

    select.onchange = (e) => updateAudit(e.target.value);
    updateAudit('all');
};