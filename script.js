document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.show-instructions').forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game; // Hole das Spiel aus dem data-game-Attribut
            const instructions = document.getElementById(`${game}-instructions`);

            // Sichtbarkeit umschalten
            const isHidden = instructions.style.display === 'none' || instructions.style.display === '';
            instructions.style.display = isHidden ? 'block' : 'none';
            button.textContent = isHidden ? 'Ablauf ausblenden' : 'Ablauf anzeigen';
        });
    });
});