// Ablauf-Anzeigen-Logik
document.addEventListener('DOMContentLoaded', () => {
    const instructionButtons = document.querySelectorAll('.show-instructions');

    instructionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game; // Hole das Spiel aus dem data-game-Attribut
            const instructions = document.getElementById(`${game}-instructions`);

            // Toggle visibility
            if (instructions.style.display === 'none' || instructions.style.display === '') {
                instructions.style.display = 'block';
                button.textContent = 'Ablauf ausblenden';
            } else {
                instructions.style.display = 'none';
                button.textContent = 'Ablauf anzeigen';
            }
        });
    });
});