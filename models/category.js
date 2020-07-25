var mongoose = require('mongoose');

var category_schema = new mongoose.Schema({
    name: { type: String, required: [ true, "can't be blank" ] },
}, { timestamps: true });

module.exports = Category = mongoose.model('categories', category_schema);