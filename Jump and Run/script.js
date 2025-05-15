const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const lowObstacle = document.getElementById('low-obstacle');
const scoreDisplay = document.getElementById('score');
const livesContainer = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const resetButton = document.getElementById('reset-button');

let isJumping = false;
let isDucking = false;
let score = 0;
let lives = 3;

// Spieler springen lassen
function jump() {
    if (isJumping || isDucking) return; // Nicht springen, wenn der Spieler duckt
    isJumping = true;

    let jumpHeight = 0;
    const jumpInterval = setInterval(() => {
        if (jumpHeight >= 200) {
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

// Spieler ducken lassen
function duck() {
    if (isJumping || isDucking) return; // Nicht ducken, wenn der Spieler springt
    isDucking = true;
    player.classList.add('ducking');

    setTimeout(() => {
        player.classList.remove('ducking');
        isDucking = false;
    }, 1000); // Ducken dauert 1 Sekunde
}

// Hindernis-Kollision prüfen
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const lowObstacleRect = lowObstacle.getBoundingClientRect();

    if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
    ) {
        loseLife();
    }

    if (
        playerRect.right > lowObstacleRect.left &&
        playerRect.left < lowObstacleRect.right &&
        playerRect.bottom > lowObstacleRect.top &&
        playerRect.top < lowObstacleRect.bottom
    ) {
        loseLife();
    }
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
    gameOverScreen.style.display = 'block';
    clearInterval(gameLoop);
}

// Punktzahl erhöhen
function increaseScore() {
    score++;
    scoreDisplay.textContent = `Punkte: ${score}`;
}

// Spiel zurücksetzen
resetButton.addEventListener('click', () => {
    location.reload(); // Seite neu laden
});

// Steuerung für Handyspieler
document.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;

    if (touchX < screenWidth / 2) {
        // Linke Bildschirmhälfte: Springen
        jump();
    } else {
        // Rechte Bildschirmhälfte: Ducken
        duck();
    }
});

// Steuerung für Tastaturspieler
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    } else if (e.code === 'ArrowDown') {
        duck();
    }
});

// Hindernisse mit genügend Abstand
function adjustObstacleSpeed() {
    obstacle.style.animationDuration = '3s'; // Hindernis bewegt sich langsamer
    lowObstacle.style.animationDuration = '4s'; // Niedriges Hindernis bewegt sich langsamer
}

// Hindernisse bewegen
function moveObstacles() {
    const obstacles = [obstacle, lowObstacle, largeObstacle];
    obstacles.forEach((obs, index) => {
        let obsLeft = parseInt(window.getComputedStyle(obs).getPropertyValue('left')) || 0;

        if (obsLeft <= -50) {
            // Hindernis zurücksetzen, wenn es den Bildschirm verlässt
            obs.style.left = `${2000 + index * 600}px`; // Abstand von 600px zwischen den Hindernissen, Start weiter rechts
        } else {
            // Hindernis bewegen
            obs.style.left = `${obsLeft - obstacleSpeed}px`;
        }
    });
}

// Hindernisse mit Abstand starten
function initializeObstacles() {
    const obstacles = [obstacle, lowObstacle, largeObstacle];
    obstacles.forEach((obs, index) => {
        obs.style.left = `${2000 + index * 600}px`; // Startposition weiter rechts
    });
}

// Kollision und Punktzahl prüfen
const gameLoop = setInterval(() => {
    checkCollision();
    increaseScore();
}, 100);

// Hindernisgeschwindigkeit anpassen
adjustObstacleSpeed();