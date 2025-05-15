const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let score = 0;

// Spieler springen lassen
function jump() {
    if (isJumping) return;
    isJumping = true;

    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 150) {
            clearInterval(jumpInterval);
            const fallInterval = setInterval(() => {
                if (jumpHeight <= 0) {
                    clearInterval(fallInterval);
                    isJumping = false;
                }
                jumpHeight -= 5;
                player.style.bottom = `${jumpHeight + 50}px`;
            }, 20);
        }
        jumpHeight += 5;
        player.style.bottom = `${jumpHeight + 50}px`;
    }, 20);
}

// Hindernis-Kollision prüfen
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
    ) {
        alert(`Game Over! Deine Punktzahl: ${score}`);
        score = 0;
        scoreDisplay.textContent = `Punkte: ${score}`;
    }
}

// Punktzahl erhöhen
function increaseScore() {
    score++;
    scoreDisplay.textContent = `Punkte: ${score}`;
}

// Spiel starten
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// Kollision und Punktzahl prüfen
setInterval(() => {
    checkCollision();
    increaseScore();
}, 100);