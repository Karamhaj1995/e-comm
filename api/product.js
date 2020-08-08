var express = require('express');
var router = express.Router();
require('../models/product');

// Import my test routes into the path '/test'
router.post('/products/', (req, res) => {
    var product = {
        "name": req.body.name,
        "url": req.body.url,
    };
    Product.create(product, (err, doc) => {
        if(err) res.send(err);
        else { res.send(doc); }
    }); 
});

// Import my test routes into the path '/test'
router.get('/products/', (req, res) => {
    var product = {};
    Product.find(product, (err, docs) => {
        if(err) res.send(err);
        else { res.send(docs); }
    }); 
});

// Import my test routes into the path '/test'
router.delete('/products/', (req, res) => {
    var product = { name: req.body.name };
    Product.deleteOne(product, (err) => {
        if(err) res.send(err);
        else { res.send(true); }
    }); 
});

module.exports = router
