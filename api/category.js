var express = require('express');
const category = require('../models/category');
var router = express.Router();
require('../models/category');

// Import my test routes into the path '/test'
router.post('/categories/', (req, res) => {
    var category = {
        "name": req.body.name,
    };
    Category.create(category, (err, doc) => {
        if(err) res.send(err);
        else { res.send(doc); }
    });
});

// Import my test routes into the path '/test'
router.get('/categories/', (req, res) => {
    var category = {};
    Category.find(category, (err, docs) => {
        if(err) res.send(err);
        else { res.send(docs); }
    }); 
});

// Import my test routes into the path '/test'
router.delete('/categories/', (req, res) => {
    var category = { name: req.body.name };
    Category.deleteOne(category, (err) => {
        if(err) res.send(err);
        else { res.send(true); }
    }); 
});

module.exports = router
