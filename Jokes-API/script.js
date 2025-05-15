const jokeCategory = document.getElementById('joke-category');
const searchCategory = document.getElementById('search-category');
const getJokeButton = document.getElementById('get-joke');
const jokeDisplay = document.getElementById('joke-display');
const userJokeInput = document.getElementById('user-joke');
const addJokeButton = document.getElementById('add-joke');
const userJokesDisplay = document.getElementById('user-jokes-display');

// Liste, um die IDs der bereits angezeigten Witze zu speichern
const displayedJokes = new Set();

// Objekt, um die Likes/Dislikes der Nutzer zu verfolgen
const userInteractions = {};

// Funktion, um Witze im localStorage zu speichern
function saveUserJokes(jokes) {
    localStorage.setItem('userJokes', JSON.stringify(jokes));
}

// Funktion, um Witze aus dem localStorage zu laden
function loadUserJokes() {
    return JSON.parse(localStorage.getItem('userJokes')) || [];
}

// Funktion, um einen neuen Witz hinzuzufügen
function addUserJoke(jokeText) {
    const jokes = loadUserJokes();
    jokes.push({ text: jokeText, thumbsUp: 0, thumbsDown: 0 });
    saveUserJokes(jokes);
    displayUserJokes();
}

// Funktion, um Witze anzuzeigen
function displayUserJokes() {
    const jokes = loadUserJokes();
    userJokesDisplay.innerHTML = '';
    jokes.forEach((joke, index) => {
        const jokeItem = document.createElement('div');
        jokeItem.className = 'joke-item';
        jokeItem.innerHTML = `
            <p>${joke.text}</p>
            <button class="thumbs-up">👍 ${joke.thumbsUp}</button>
            <button class="thumbs-down">👎 ${joke.thumbsDown}</button>
        `;

        const thumbsUpButton = jokeItem.querySelector('.thumbs-up');
        const thumbsDownButton = jokeItem.querySelector('.thumbs-down');

        // Initialisiere Interaktionen für den Witz, falls nicht vorhanden
        if (!userInteractions[index]) {
            userInteractions[index] = { liked: false, disliked: false };
        }

        // Event-Listener für Daumen hoch
        thumbsUpButton.addEventListener('click', () => {
            if (userInteractions[index].liked) {
                // Like entfernen
                jokes[index].thumbsUp--;
                userInteractions[index].liked = false;
            } else {
                // Like hinzufügen
                jokes[index].thumbsUp++;
                userInteractions[index].liked = true;

                // Dislike entfernen, falls vorhanden
                if (userInteractions[index].disliked) {
                    jokes[index].thumbsDown--;
                    userInteractions[index].disliked = false;
                }
            }
            saveUserJokes(jokes);
            displayUserJokes();
        });

        // Event-Listener für Daumen runter
        thumbsDownButton.addEventListener('click', () => {
            if (userInteractions[index].disliked) {
                // Dislike entfernen
                jokes[index].thumbsDown--;
                userInteractions[index].disliked = false;
            } else {
                // Dislike hinzufügen
                jokes[index].thumbsDown++;
                userInteractions[index].disliked = true;

                // Like entfernen, falls vorhanden
                if (userInteractions[index].liked) {
                    jokes[index].thumbsUp--;
                    userInteractions[index].liked = false;
                }
            }
            saveUserJokes(jokes);
            displayUserJokes();
        });

        userJokesDisplay.appendChild(jokeItem);
    });
}

// Event-Listener für das Hinzufügen eines neuen Witzes
addJokeButton.addEventListener('click', () => {
    const jokeText = userJokeInput.value.trim();
    if (jokeText) {
        addUserJoke(jokeText);
        userJokeInput.value = '';
    }
});

// Lade die Witze beim Start
displayUserJokes();