const jokeCategory = document.getElementById('joke-category');
const searchCategory = document.getElementById('search-category');
const getJokeButton = document.getElementById('get-joke');
const jokeDisplay = document.getElementById('joke-display');
const userJokeInput = document.getElementById('user-joke');
const addJokeButton = document.getElementById('add-joke');
const userJokesDisplay = document.getElementById('user-jokes-display');
const backButton = document.querySelector('.back-button');

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
    const jokeId = Date.now();
    jokes.push({ id: jokeId, text: jokeText, thumbsUp: 0, thumbsDown: 0, createdByUser: true });
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
            ${joke.createdByUser ? '<button class="delete-joke">🗑️ Löschen</button>' : ''}
        `;

        const deleteButton = jokeItem.querySelector('.delete-joke');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                if (jokes[index].createdByUser) {
                    jokes.splice(index, 1);
                    saveUserJokes(jokes);
                    displayUserJokes();
                } else {
                    alert('Du kannst nur deine eigenen Witze löschen!');
                }
            });
        }

        userJokesDisplay.appendChild(jokeItem);
    });
}

// Event-Listener für den "Zurück"-Button
if (backButton) {
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (document.referrer) {
            history.back();
        } else {
            window.location.href = 'index.html';
        }
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

const jokes = loadUserJokes().map(joke => ({
    ...joke,
    createdByUser: joke.createdByUser || false // Standardwert setzen
}));

// Lade die Witze beim Start
displayUserJokes();