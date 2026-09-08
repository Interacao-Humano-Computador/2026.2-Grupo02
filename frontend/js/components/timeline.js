// Caminho: frontend/js/components/timeline.js

let currentWeekOffset = 0;
let globalCommits = [];
let globalIssues = [];

const getWeekBoundaries = (offset) => {
    const now = new Date();
    const currentDay = now.getDay();

    const start = new Date(now);

    start.setDate(
        now.getDate() - currentDay - (offset * 7)
    );

    start.setHours(0, 0, 0, 0);

    const end = new Date(start);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return {
        start,
        end
    };
};

const formatDateDayMonth = (date) => {
    const day = String(date.getDate()).padStart(2, '0');

    const months = [
        'JAN',
        'FEV',
        'MAR',
        'ABR',
        'MAI',
        'JUN',
        'JUL',
        'AGO',
        'SET',
        'OUT',
        'NOV',
        'DEZ'
    ];

    return `${day} ${months[date.getMonth()]}`;
};

const obterDataCommit = (commit) => {
    const valor = commit?.commit?.author?.date;

    if (!valor) {
        return null;
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return null;
    }

    return data;
};

const obterDataIssue = (issue) => {
    const valor = issue?.created_at;

    if (!valor) {
        return null;
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return null;
    }

    return data;
};

export const initTimeline = (commits, issues) => {
    globalCommits = Array.isArray(commits)
        ? commits
        : [];

    globalIssues = Array.isArray(issues)
        ? issues
        : [];

    const previousButton = document.getElementById(
        'btn-prev-week'
    );

    const nextButton = document.getElementById(
        'btn-next-week'
    );

    const weekLabel = document.getElementById(
        'current-week-label'
    );

    const commitsCount = document.getElementById(
        'week-commits-count'
    );

    const issuesCount = document.getElementById(
        'week-issues-count'
    );

    if (
        !previousButton ||
        !nextButton ||
        !weekLabel ||
        !commitsCount ||
        !issuesCount
    ) {
        console.warn(
            '[Timeline] Elementos obrigatórios não encontrados.'
        );

        return;
    }

    previousButton.onclick = () => {
        currentWeekOffset += 1;
        renderCurrentWeek();
    };

    nextButton.onclick = () => {
        if (currentWeekOffset <= 0) {
            return;
        }

        currentWeekOffset -= 1;
        renderCurrentWeek();
    };

    renderCurrentWeek();
};

const renderCurrentWeek = () => {
    const weekLabel = document.getElementById(
        'current-week-label'
    );

    const nextButton = document.getElementById(
        'btn-next-week'
    );

    const commitsCount = document.getElementById(
        'week-commits-count'
    );

    const issuesCount = document.getElementById(
        'week-issues-count'
    );

    if (
        !weekLabel ||
        !nextButton ||
        !commitsCount ||
        !issuesCount
    ) {
        console.warn(
            '[Timeline] Não foi possível atualizar a semana.'
        );

        return;
    }

    const boundaries = getWeekBoundaries(
        currentWeekOffset
    );

    weekLabel.textContent =
        `${formatDateDayMonth(boundaries.start)} - ` +
        `${formatDateDayMonth(boundaries.end)}`;

    nextButton.disabled = currentWeekOffset === 0;

    const weekCommits = globalCommits.filter(
        (commit) => {
            const data = obterDataCommit(commit);

            if (!data) {
                return false;
            }

            return (
                data >= boundaries.start &&
                data <= boundaries.end
            );
        }
    );

    const weekIssues = globalIssues.filter(
        (issue) => {
            const data = obterDataIssue(issue);

            if (!data) {
                return false;
            }

            return (
                data >= boundaries.start &&
                data <= boundaries.end
            );
        }
    );

    commitsCount.textContent = String(
        weekCommits.length
    );

    issuesCount.textContent = String(
        weekIssues.length
    );
};
