const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let bd = [];

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    let html =
        `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Сергиевская М.С. Воспитатель ГПД</title>
            <link rel="stylesheet" href="life.css">
        </head>
        <body>
        <header>
        </header>
        
        <section class="form">
            <div class="form__containter">
                <h1>Добавить новую статью</h1>
                <form action="/addPost" method="post">
                    <div class="form__group">
                        <label for="title">Заголовок</label>
                        <input type="text" placeholder="Придумайте свой заголовок для статьи" name="title" id="title">
                        <br><label for="text">Текст статьи</label>
                        <textarea id="text" name="text"placeholder="Текст вашей статьи"></textarea>
                    </div>
                    <button type="submit" class="form__submit">Отправить заявку</button>
                </form>
            </div>
        </section>        
    `;
    let posts = JSON.parse(JSON.stringify(bd));
    if (req.query.reverse && req.query.reverse == "true") {
        posts = posts.reverse();
    }
    if (req.query.limit && !isNaN(req.query.limit) && parseInt(req.query.limit) > 0) {
        posts = posts.slice(0, parseInt(req.query.limit));
    }
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        html += '\n' + add_post(post.title, post.text);
    }
    html += `
        </body>
        </html>
    `;
    res.send(html);
});

//  контроллер добавления поста
app.post('/addPost', (req, res) => {
    bd.push({
        "title": req.body.title,
        "text": req.body.text,
    });
    res.redirect(req.get('referer'));
});

app.listen(3000, () => {
    console.log('Application listening on port 3000!')
    console.log('http://127.0.0.1:3000')
});

function add_post(title, text) {
    return `
        <div class="features__border">
            <div class="features__feedback">
                <div class="features__feedback-right">
                    <div class="features__box features__savings-box">
                        <h3>${title}</h3>
                        <p>${text}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}