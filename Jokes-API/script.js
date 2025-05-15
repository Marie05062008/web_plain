const jokeCategory = document.getElementById('joke-category');
const searchCategory = document.getElementById('search-category');
const getJokeButton = document.getElementById('get-joke');
const jokeDisplay = document.getElementById('joke-display');

// Funktion, um einen Witz von der API abzurufen
async function fetchJoke(category, searchTerm) {
    let url = `https://v2.jokeapi.dev/joke/${category ? category : 'Any'}`;

    // Sprache auf Deutsch setzen
    url += `?lang=de`;

    // Wenn ein Suchbegriff eingegeben wurde, füge ihn als Parameter hinzu
    if (searchTerm) {
        url += `&contains=${encodeURIComponent(searchTerm)}`;
    }

    console.log(`API-URL: ${url}`); // Debugging-Log

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // Debugging-Log

        if (data.error) {
            jokeDisplay.textContent = 'Kein Witz gefunden. Versuche es erneut!';
        } else if (data.type === 'single') {
            jokeDisplay.textContent = data.joke; // Einzeiler-Witz
        } else if (data.type === 'twopart') {
            jokeDisplay.innerHTML = `<p>${data.setup}</p><p><strong>${data.delivery}</strong></p>`; // Zweiteiliger Witz
        }
    } catch (error) {
        console.error('Fehler:', error); // Debugging-Log
        jokeDisplay.textContent = 'Fehler beim Abrufen des Witzes. Bitte versuche es später erneut.';
    }
}

// Event-Listener für den Button
getJokeButton.addEventListener('click', () => {
    console.log('Button wurde geklickt'); // Debugging-Log
    const category = jokeCategory.value; // Kategorie aus Dropdown
    const searchTerm = searchCategory.value.trim(); // Suchbegriff aus Eingabefeld
    console.log(`Kategorie: ${category}, Suchbegriff: ${searchTerm}`); // Debugging-Log
    fetchJoke(category, searchTerm); // API-Aufruf mit Kategorie und Suchbegriff
});