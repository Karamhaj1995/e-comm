const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const fs = require('fs');

var auth = require('./logic/auth');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
mongoose.connection.once('open', function callback () {
    console.log(`Database connected`);
});

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// use ejs engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', auth.checkToken, (req, res) => { 
    res.render('templates/index', {
        'app': {
            'pages': [
                {'name': 'products', 'icon': 'product-hunt'},
                {'name': 'deals', 'icon': 'credit-card'},
                // {'name': 'store', 'icon': 'check'},
            ]
        },
        'user': { 
            'name':'karam',
            'language': 'en'
        }
    }); 
});

app.get('/register', (req, res) => {
    res.render('templates/register');
});

app.get('/login', (req, res) => {
    res.render('templates/login', {errors: []});
});

app.post('/login', auth.login);

// Logut Handler
app.get('/logout', function (req, res) {
    if(req.session) {
        delete req.session.user_id;
    }
    res.redirect('/login');    
});

app.use('/api', require('./api/user'));
app.use('/api', auth.checkToken, require('./api/product'));

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
https.createServer(credentials, app).listen(8443);