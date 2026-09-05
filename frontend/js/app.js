import { renderCharts } from './components/charts.js';
import { renderHeatmap } from './components/heatmap.js';
import { initTimeline } from './components/timeline.js';
import { renderCommitLog } from './components/commitlog.js';
import { renderCollaborators } from './components/collaborators.js';
import { renderUserAudit } from './components/useraudit.js';

export const PrismaApp = {
    async sync() {
        try {
            const response = await fetch('dados.json');
            if (!response.ok) throw new Error("Arquivo não encontrado.");
            const data = await response.json();
            
            const allCommits = data.raw_commits || [];
            const issues = data.raw_issues || [];
            const teamMembers = data.team_members || ["andreozzi", "darkymeubem", "delvale412"];
            
            const timestampElement = document.getElementById('build-timestamp');
            if (timestampElement) {
                timestampElement.textContent = data.generated_at || "--/-- --:--";
            }

            const closedIssues = issues.filter(issue => issue.state === 'closed').length;
            
            const metrics = {
                total_commits: allCommits.length, 
                closed_issues: closedIssues,
                active_collaborators: teamMembers.length,
                raw_commits: allCommits, 
                raw_issues: issues,
                team_members: teamMembers
            };

            this.updateDashboard(metrics);
            return metrics;
            
        } catch (error) {
            console.error("Erro ao carregar dados locais:", error);
        }
    },

    updateDashboard(data) {
        const elements = {
            commits: document.getElementById('total-commits'),
            issues: document.getElementById('closed-issues'), 
            collabs: document.getElementById('total-collabs')
        };

        if (elements.commits) elements.commits.textContent = data.total_commits;
        if (elements.issues) elements.issues.textContent = data.closed_issues;
        if (elements.collabs) elements.collabs.textContent = data.active_collaborators;

        if (typeof renderCharts === 'function') renderCharts(data.raw_commits, data.raw_issues);
        if (typeof renderHeatmap === 'function') renderHeatmap(data.raw_commits, data.raw_issues);
        if (typeof initTimeline === 'function') initTimeline(data.raw_commits, data.raw_issues);
        if (typeof renderCommitLog === 'function') renderCommitLog(data.raw_commits);
        if (typeof renderCollaborators === 'function') renderCollaborators(data.raw_commits, data.raw_issues, data.team_members);
        if (typeof renderUserAudit === 'function') renderUserAudit(data.raw_commits, data.raw_issues, data.team_members);
    }
};