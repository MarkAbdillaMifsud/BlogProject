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

const MAX_TITLE = 120;
const MAX_BODY  = 5000;

function validatePostInput(titleRaw, bodyRaw) {
  const title = (titleRaw || '').trim();
  const body  = (bodyRaw  || '').trim();

  if (!title || !body) {
    return { ok: false, msg: 'Title and body are required.' };
  }

  if (title.length > MAX_TITLE)  {
    return { ok: false, msg: `Title too long (>${MAX_TITLE}).` };
  }

  if (body.length  > MAX_BODY){
    return { ok: false, msg: `Body too long (>${MAX_BODY}).` };
  }

  return { ok: true, title, body };
}

const render = (res, view, params = {}) => {
    const ejs = require('ejs');
    const fs = require('fs');
    const path = require('path');
    const viewPath = path.join(__dirname, 'views', `${view}.ejs`);
    const body = ejs.render(fs.readFileSync(viewPath, 'utf8'), params, { filename: viewPath });
    res.render('layout', { ...params, body });
}

app.get('/', (req, res) => {
    render(res, 'index',{ title: 'Home • Capstone Blog', posts });
});

app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if(!post){
        return res.status(404).send('Not found');
    }
    render(res, 'edit', { title: 'Edit • Capstone Blog', post });
})

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

app.post('/posts/:id/update', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if(!post) {
        return res.status(404).send('Not found');
    }
    const title = (req.body.title || '').trim();
    const body = (req.body.body || '').trim();
    if(!title || !body) {
        return res.status(400).send('Title and body required');
    }
    post.title = title;
    post.body = body;
    post.updatedAt = Date.now();
    res.redirect('/');
});

app.post('/posts/:id/delete', (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));