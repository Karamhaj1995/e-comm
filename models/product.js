var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
require('./category');
var user = require('./user');

var product_schema = new mongoose.Schema({
    name: { type: String, required: [ true, "can't be blank" ] },
    price: { type: Number },
    url: { type: String, required: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    uploaded_by: { type: [user.User], required: false },
    image: { type: String },
}, { timestamps: true });

product_schema.plugin(uniqueValidator, { message: 'is already taken.' });

module.exports = Product = mongoose.model('products', product_schema);