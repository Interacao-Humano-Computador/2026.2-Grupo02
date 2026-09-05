let commitsChartInstance = null;
let issuesChartInstance = null;

export const renderCharts = (commits, issues) => {
    const ctxCommits = document.getElementById('commitsChart');
    const ctxIssues = document.getElementById('issuesChart');
    if (!ctxCommits || !ctxIssues) return;

    if (commitsChartInstance) commitsChartInstance.destroy();
    if (issuesChartInstance) issuesChartInstance.destroy();

    const weeks = 12;
    const labels = [];
    const commitsData = [];
    const openIssuesData = [];
    const closedIssuesData = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    for (let i = weeks - 1; i >= 0; i--) {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (i * 7));
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);

        const formatData = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        labels.push(`${formatData(weekStart)}`);

        const weekCommits = commits.filter(c => {
            const d = new Date(c.commit.author.date);
            return d >= weekStart && d <= weekEnd;
        }).length;

        const weekOpen = issues.filter(iss => {
            const d = new Date(iss.created_at);
            return d >= weekStart && d <= weekEnd;
        }).length;

        const weekClosed = issues.filter(iss => {
            if (!iss.closed_at) return false;
            const d = new Date(iss.closed_at);
            return d >= weekStart && d <= weekEnd;
        }).length;

        commitsData.push(weekCommits);
        openIssuesData.push(weekOpen);
        closedIssuesData.push(weekClosed);
    }

    commitsChartInstance = new Chart(ctxCommits, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Commits na Semana',
                data: commitsData,
                borderColor: '#a855f7', // Púrpura
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#000000',
                pointBorderColor: '#a855f7',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(9, 9, 11, 0.9)' } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { precision: 0 } }, x: { grid: { display: false } } }
        }
    });

    issuesChartInstance = new Chart(ctxIssues, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Abertas',
                    data: openIssuesData,
                    backgroundColor: 'rgba(168, 85, 247, 0.8)', // Púrpura
                    borderRadius: 4
                },
                {
                    label: 'Fechadas',
                    data: closedIssuesData,
                    backgroundColor: 'rgba(63, 63, 70, 0.8)', // Cinza escuro
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(9, 9, 11, 0.9)' } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { precision: 0 }, stacked: true }, x: { grid: { display: false }, stacked: true } }
        }
    });
};