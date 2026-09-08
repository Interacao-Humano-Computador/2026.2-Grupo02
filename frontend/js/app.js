// Caminho: frontend/js/app.js

import { renderCharts } from './components/charts.js';
import { renderHeatmap } from './components/heatmap.js';
import { initTimeline } from './components/timeline.js';
import { renderCommitLog } from './components/commitlog.js';
import { renderCollaborators } from './components/collaborators.js';
import { renderUserAudit } from './components/useraudit.js';

export const DashboardApp = {
    syncInProgress: false,

    async sync() {
        if (this.syncInProgress) {
            return;
        }

        const syncButton = document.getElementById('btn-sync');
        const timestampElement = document.getElementById(
            'build-timestamp'
        );

        this.syncInProgress = true;

        try {
            if (syncButton) {
                syncButton.disabled = true;
                syncButton.textContent = 'CARREGANDO...';
            }

            if (timestampElement) {
                timestampElement.textContent = 'Carregando...';
                timestampElement.removeAttribute('title');
            }

            const response = await fetch('./dados.json', {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(
                    `Erro HTTP ${response.status} ao carregar dados.json.`
                );
            }

            const data = await response.json();

            const allCommits = Array.isArray(data.raw_commits)
                ? data.raw_commits
                : [];

            const issues = Array.isArray(data.raw_issues)
                ? data.raw_issues
                : [];

            const teamMembers = Array.isArray(data.team_members)
                ? data.team_members
                : [];

            const closedIssues = issues.filter(
                (issue) => issue.state === 'closed'
            ).length;

            const metrics = {
                total_commits: allCommits.length,
                closed_issues: closedIssues,
                active_collaborators: teamMembers.length,
                raw_commits: allCommits,
                raw_issues: issues,
                team_members: teamMembers
            };

            if (timestampElement) {
                timestampElement.textContent =
                    data.generated_at || '--/-- --:--';
            }

            this.updateDashboard(metrics);
        } catch (error) {
            console.error(
                '[Dashboard] Erro ao carregar dados locais:',
                error
            );

            if (timestampElement) {
                timestampElement.textContent = 'Erro ao carregar dados';
                timestampElement.title = error.message;
            }
        } finally {
            this.syncInProgress = false;

            if (syncButton) {
                syncButton.disabled = false;
                syncButton.textContent = 'ATUALIZAR DADOS';
            }
        }
    },

    updateDashboard(data) {
        const elements = {
            commits: document.getElementById('total-commits'),
            issues: document.getElementById('closed-issues'),
            collabs: document.getElementById('total-collabs')
        };

        if (elements.commits) {
            elements.commits.textContent = data.total_commits;
        }

        if (elements.issues) {
            elements.issues.textContent = data.closed_issues;
        }

        if (elements.collabs) {
            elements.collabs.textContent =
                data.active_collaborators;
        }

        this.renderComponent(
            'gráficos',
            () => renderCharts(
                data.raw_commits,
                data.raw_issues
            )
        );

        this.renderComponent(
            'mapa de calor',
            () => renderHeatmap(
                data.raw_commits,
                data.raw_issues
            )
        );

        this.renderComponent(
            'timeline',
            () => initTimeline(
                data.raw_commits,
                data.raw_issues
            )
        );

        this.renderComponent(
            'log de commits',
            () => renderCommitLog(
                data.raw_commits
            )
        );

        this.renderComponent(
            'colaboradores',
            () => renderCollaborators(
                data.raw_commits,
                data.raw_issues,
                data.team_members
            )
        );

        this.renderComponent(
            'auditoria',
            () => renderUserAudit(
                data.raw_commits,
                data.raw_issues,
                data.team_members
            )
        );
    },

    renderComponent(name, callback) {
        try {
            callback();
        } catch (error) {
            console.error(
                `[Dashboard] Erro ao renderizar ${name}:`,
                error
            );
        }
    },

    init() {
        const syncButton = document.getElementById('btn-sync');

        if (syncButton) {
            syncButton.onclick = () => {
                this.sync();
            };
        }

        this.sync();
    }
};

const initializeDashboard = () => {
    DashboardApp.init();
};

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initializeDashboard,
        {
            once: true
        }
    );
} else {
    initializeDashboard();
}