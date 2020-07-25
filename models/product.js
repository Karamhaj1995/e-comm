var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var product_schema = new mongoose.Schema({
    name: { type: String, lowercase: true, required: [ true, "can't be blank" ] },
    url: { type: String, lowercase: true, required: [ true, "can't be blank" ], index: true },
}, { timestamps: true });

product_schema.plugin(uniqueValidator, { message: 'is already taken.' });

module.exports = Product = mongoose.model('products', product_schema);