var express = require('express');
var router = express.Router();
require('../models/product');
require('../models/category');

// Import my test routes into the path '/test'
router.post('/products/', (req, res) => {
    Category.find({ name: req.body.category }, (err, category) => {
        if(err) res.send(err);
        var product = {
            "name": req.body.name,
            "url": req.body.url,
            "image": req.body.image,
            "price": req.body.price
        };
        if(!category.length) {
            Category.create({ "name": req.body.category }, (err, created_category) => {
                if(err) res.send(err);
                else {
                    product["category"] = created_category;
                    Product.create(product, (err, doc) => {
                        if(err) { res.send(err); }
                        else { res.send(doc); }
                    });
                }
            });
        } else {
            product["category"] = category[0];
            Product.create(product, (err, doc) => {
                if(err) { res.send(err); }
                else { res.send(doc); }
            });
        }
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
