// Caminho: frontend/js/components/timeline.js

const previousButton = document.getElementById('btn-prev-week');
const nextButton = document.getElementById('btn-next-week');

if (!previousButton || !nextButton) {
    console.warn('[Timeline] Botões de navegação não encontrados.');
    return;
}

previousButton.onclick = () => {
    currentWeekOffset++;
    renderCurrentWeek();
};

nextButton.onclick = () => {
    if (currentWeekOffset > 0) {
        currentWeekOffset--;
        renderCurrentWeek();
    }
};