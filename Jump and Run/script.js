const player = document.getElementById('player');
const obstacles = [
    document.getElementById('obstacle-1'),
    document.getElementById('obstacle-2'),
    document.getElementById('obstacle-3')
];
const livesContainer = document.getElementById('lives-container');
const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');
const menuButton = document.getElementById('menu-button');

let isJumping = false;
let lives = 3;
const obstacleSpeed = 5; // Geschwindigkeit der Hindernisse
const obstacleSpacing = 600; // Abstand zwischen Hindernissen

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
                jumpHeight -= 10;
                player.style.bottom = `${jumpHeight + 50}px`;
            }, 20);
        }
        jumpHeight += 10;
        player.style.bottom = `${jumpHeight + 50}px`;
    }, 20);
}

// Hindernisse bewegen
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obsLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left')) || 0;

        if (obsLeft <= -50) {
            // Hindernis zurücksetzen, wenn es den Bildschirm verlässt
            obstacle.style.left = `${1500 + index * obstacleSpacing}px`;
        } else {
            // Hindernis bewegen
            obstacle.style.left = `${obsLeft - obstacleSpeed}px`;
        }
    });
}

// Hindernis-Kollision prüfen
function checkCollision() {
    const playerRect = player.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            loseLife();
        }
    });
}

// Leben verlieren
function loseLife() {
    if (lives > 0) {
        lives--;
        livesContainer.removeChild(livesContainer.lastElementChild); // Entferne ein Herz
        if (lives === 0) {
            endGame();
        }
    }
}

// Spiel beenden
function endGame() {
    clearInterval(gameLoop);
    gameOverScreen.style.display = 'block';
}

// Spiel zurücksetzen
restartButton.addEventListener('click', () => {
    location.reload(); // Seite neu laden
});

// Steuerung für Tastaturspieler
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// Spiel-Loop
const gameLoop = setInterval(() => {
    moveObstacles();
    checkCollision();
}, 20);

// Hindernisse initialisieren
function initializeObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.style.left = `${1500 + index * obstacleSpacing}px`; // Startposition weiter rechts
    });
}

initializeObstacles();