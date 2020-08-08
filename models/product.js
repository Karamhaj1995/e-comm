var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var category = require('./category');
var user = require('./user');

var product_schema = new mongoose.Schema({
    name: { type: String, required: [ true, "can't be blank" ] },
    price: { type: Number },
    url: { type: String, required: [ true, "can't be blank" ] },
    category: { type:[category.Category] },
    uploaded_by: { type: [user.User], required: false } 
}, { timestamps: true });

product_schema.plugin(uniqueValidator, { message: 'is already taken.' });

module.exports = Product = mongoose.model('products', product_schema);