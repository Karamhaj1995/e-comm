const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const fs = require('fs');
const page_configuration = require('./config/page_config.js')

var auth = require('./logic/auth');
var privateKey  = fs.readFileSync('sslcert/cert.key', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

var credentials = {
    key: privateKey, 
    cert: certificate
};

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
        'app': page_configuration,
        'user': req.decoded.user
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
app.use('/api', auth.checkToken, require('./api/category'));

// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
https.createServer(credentials, app).listen(8443);