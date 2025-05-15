const jokeCategory = document.getElementById('joke-category');
const searchCategory = document.getElementById('search-category');
const getJokeButton = document.getElementById('get-joke');
const jokeDisplay = document.getElementById('joke-display');
const userJokeInput = document.getElementById('user-joke');
const addJokeButton = document.getElementById('add-joke');
const userJokesDisplay = document.getElementById('user-jokes-display');

// Liste, um die IDs der bereits angezeigten Witze zu speichern
const displayedJokes = new Set();

// Funktion, um einen Witz von der API abzurufen
async function fetchJoke(category, searchTerm) {
    let url = `https://v2.jokeapi.dev/joke/${category ? category : 'Any'}`;

    // Sprache auf Deutsch setzen
    url += `?lang=de`;

    // Wenn ein Suchbegriff eingegeben wurde, füge ihn als Parameter hinzu
    if (searchTerm) {
        url += `&contains=${encodeURIComponent(searchTerm)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            jokeDisplay.textContent = 'Kein Witz gefunden. Versuche es erneut!';
            return;
        }

        if (displayedJokes.has(data.id)) {
            fetchJoke(category, searchTerm);
            return;
        }

        if (data.type === 'single') {
            jokeDisplay.textContent = data.joke;
        } else if (data.type === 'twopart') {
            jokeDisplay.innerHTML = `<p>${data.setup}</p><p><strong>${data.delivery}</strong></p>`;
        }

        displayedJokes.add(data.id);
    } catch (error) {
        jokeDisplay.textContent = 'Fehler beim Abrufen des Witzes. Bitte versuche es später erneut.';
    }
}

// Event-Listener für den Button
getJokeButton.addEventListener('click', () => {
    const category = jokeCategory.value;
    const searchTerm = searchCategory.value.trim();
    fetchJoke(category, searchTerm);
});

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

        thumbsUpButton.addEventListener('click', () => {
            jokes[index].thumbsUp++;
            saveUserJokes(jokes);
            displayUserJokes();
        });

        thumbsDownButton.addEventListener('click', () => {
            jokes[index].thumbsDown++;
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