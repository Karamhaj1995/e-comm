
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const mongoose = require('mongoose')
require('./models/user');

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function callback () {
    console.log(`connected`);
});

// parse application/json
app.use(bodyParser.json())

// Import my test routes into the path '/test'
app.get('/', (req, res) => {
    res.send("WORK");
});

// Import my test routes into the path '/test'
app.post('/api/user/', (req, res) => {
    var user = {
        "username": req.body.username,
        "email": req.body.email,
    };
    User.create(user, (err, doc) => {
        if(err) res.send(err);
        else { res.send(doc); }
    }); 
});

// Import my test routes into the path '/test'
app.get('/api/user/', (req, res) => {
    var user = {};
    User.find(user, (err, docs) => {
        if(err) res.send(err);
        else { res.send(docs); }
    }); 
});

// Import my test routes into the path '/test'
app.delete('/api/user/', (req, res) => {
    var user = { email: req.body.email };
    User.deleteOne(user, (err) => {
        if(err) res.send(err);
        else { res.send(true); }
    }); 
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))