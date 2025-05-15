const express = require('express');
const app = express();
const port = 3000;

// Witze-Datenbank
const jokes = {
    tiere: [
        "Warum können Geister so schlecht lügen? Weil man durch sie hindurchsehen kann!",
        "Warum können Elefanten nicht fliegen? Weil sie keine Flugtickets kaufen können!"
    ],
    technik: [
        "Was macht ein Pirat am Computer? Er drückt die Enter-Taste!",
        "Warum sind Programmierer so schlecht im Tennis? Weil sie Angst vor Fehlern haben!"
    ],
    allgemein: [
        "Warum können Geister keine Partys feiern? Weil sie immer durch die Wände gehen!",
        "Warum können Bäcker so gut flirten? Weil sie immer süße Sachen sagen!"
    ]
};

// Endpunkt: Alle Kategorien abrufen
app.get('/api/categories', (req, res) => {
    res.json(Object.keys(jokes));
});

// Endpunkt: Witze einer bestimmten Kategorie abrufen
app.post('/api/jokes/:category', (req, res) => {
    const category = req.params.category;
    const newJoke = req.body.joke;

    if (!newJoke) {
        return res.status(400).json({ error: "Witz fehlt" });
    }

    if (!jokes[category]) {
        jokes[category] = [];
    }

    jokes[category].push(newJoke);
    res.status(201).json({ message: "Witz hinzugefügt", joke: newJoke });
});

// Endpunkt: Zufälligen Witz aus einer Kategorie abrufen
app.get('/api/jokes/:category/random', (req, res) => {
    const category = req.params.category;
    const jokeList = jokes[category];

    if (jokeList) {
        const randomJoke = jokeList[Math.floor(Math.random() * jokeList.length)];
        res.json({ joke: randomJoke });
    } else {
        res.status(404).json({ error: "Kategorie nicht gefunden" });
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Witze-API läuft unter http://localhost:${port}`);
});