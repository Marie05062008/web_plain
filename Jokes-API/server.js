// Kategorien laden
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        const categories = await response.json();

        const categorySelect = document.getElementById('joke-category');
        const searchInput = document.getElementById('search-category');

        // Funktion zum Rendern der Kategorien
        const renderCategories = (filteredCategories) => {
            categorySelect.innerHTML = ''; // Dropdown-Menü leeren
            filteredCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        };

        // Initial alle Kategorien anzeigen
        renderCategories(categories);

        // Suchfunktion
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredCategories = categories.filter(category =>
                category.toLowerCase().includes(searchTerm)
            );
            renderCategories(filteredCategories);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Kategorien:', error);
    }
}

// Zufälligen Witz anzeigen
document.getElementById('get-joke').addEventListener('click', async () => {
    const category = document.getElementById('joke-category').value;

    try {
        const response = await fetch(`http://localhost:3000/api/jokes/${category}/random`);
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen des Witzes');
        }
        const data = await response.json();
        document.getElementById('joke-display').textContent = data.joke;
    } catch (error) {
        document.getElementById('joke-display').textContent = 'Fehler: ' + error.message;
    }
});

// Kategorien laden, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', loadCategories);