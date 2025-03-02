const express = require('express');

const app = express();
const port = 8000;

const {chat} = require('./controllers/chat');

const {main} = require('./db')

//sqlite setup
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the database.');
}
);



app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.get('/register', (req, res) => {
    res.json({ message: 'Register' });
});

app.get('/login', (req, res) => {
    res.json({ message: 'Login' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});