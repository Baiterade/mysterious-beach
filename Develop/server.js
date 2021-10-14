const express = require('express');
const router = require('./routes/router')
const path = require('path');
const fs = require('fs')

const PORT = process.env.PORT || 5500;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use('/', router);
app.use('/notes', router);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to retrieve notes`);
    delete require.cache[require.resolve('./db/db.json')];
    let notesDB = require('./db/db.json');
    res.json(notesDB);
});

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
        };

        // Obtain existing reviews
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                    (writeErr) => {
                        return writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!');
                    }
                );
            }
        });
    }
    res.json(req.body);
});

app.delete('/api/notes/:id', (req, res) => req.json(notesDB));

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
})
