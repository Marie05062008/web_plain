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
    console.log('Witze gespeichert:', jokes); // Debugging-Log
}

// Funktion, um Witze aus dem localStorage zu laden
function loadUserJokes() {
    const jokes = JSON.parse(localStorage.getItem('userJokes')) || [];
    console.log('Geladene Witze:', jokes); // Debugging-Log
    return jokes;
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
        console.log('Witz anzeigen:', joke); // Debugging-Log
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

// Funktion, um einen Witz von der JokeAPI abzurufen
async function fetchJoke(category, searchTerm) {
    let url = `https://v2.jokeapi.dev/joke/${category ? category : 'Any'}`;
    url += `?lang=de`; // Sprache auf Deutsch setzen

    if (searchTerm) {
        url += `&contains=${encodeURIComponent(searchTerm)}`;
    }

    console.log('API-URL:', url); // Debugging-Log

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('API-Antwort:', data); // Debugging-Log

        if (data.error) {
            jokeDisplay.textContent = 'Kein Witz gefunden. Versuche es erneut!';
            return;
        }

        if (data.type === 'single') {
            jokeDisplay.textContent = data.joke; // Einzeiler-Witz
        } else if (data.type === 'twopart') {
            jokeDisplay.innerHTML = `<p>${data.setup}</p><p><strong>${data.delivery}</strong></p>`; // Zweiteiliger Witz
        }
    } catch (error) {
        console.error('Fehler beim Abrufen des Witzes:', error); // Debugging-Log
        jokeDisplay.textContent = 'Fehler beim Abrufen des Witzes. Bitte versuche es später erneut.';
    }
}

// Funktion, um einen Witz von der Chuck Norris API abzurufen
async function fetchChuckNorrisJoke() {
    const url = 'https://api.chucknorris.io/jokes/random';

    console.log('Chuck Norris API-URL:', url); // Debugging-Log

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Chuck Norris API-Antwort:', data); // Debugging-Log

        jokeDisplay.innerHTML = `<p>${data.value}</p>`;
    } catch (error) {
        console.error('Fehler beim Abrufen des Chuck Norris Witzes:', error); // Debugging-Log
        jokeDisplay.textContent = 'Fehler beim Abrufen des Witzes. Bitte versuche es später erneut.';
    }
}

// Event-Listener für den "Erzähl mir einen Witz"-Button
getJokeButton.addEventListener('click', () => {
    const category = jokeCategory.value; // Kategorie aus Dropdown
    const searchTerm = searchCategory.value.trim(); // Suchbegriff aus Eingabefeld
    console.log('Kategorie:', category, 'Suchbegriff:', searchTerm); // Debugging-Log

    if (category === 'ChuckNorris') {
        fetchChuckNorrisJoke(); // Chuck Norris API aufrufen
    } else {
        fetchJoke(category, searchTerm); // JokeAPI aufrufen
    }
});

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

// Lade die Witze beim Start
const jokes = loadUserJokes().map(joke => ({
    ...joke,
    createdByUser: joke.createdByUser || false // Standardwert setzen
}));
displayUserJokes();