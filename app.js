const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const newId = () => Math.random().toString(36).slice(2, 10);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.post('/posts', (req, res) => {
    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();
    if(!title || !body) {
        return res.status(400).send('Title and body required');
    }
    const now = Date.now();
    posts.unshift({ id: newId(), title, body, createdAt: now, updatedAt: now });
    res.redirect('/');
});

app.listen(PORT, () => console.log(`https://localhost:${PORT}`));