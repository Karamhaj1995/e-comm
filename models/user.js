var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;

var user_schema = new mongoose.Schema({
    username: { type: String, lowercase: true, required: [ true, "can't be blank" ] },
    email: { type: String, lowercase: true, required: [ true, "can't be blank" ], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    hashed: String
}, { timestamps: true });

user_schema.plugin(uniqueValidator, { message: 'is already taken.' });

user_schema.methods.set_password = (password) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

user_schema.methods.valid_password = (password) => {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

user_schema.methods.generate_jwt = () => {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

user_schema.methods.to_auth_json = () => {
    return {
        username: this.username,
        email: this.email,
        token: this.generate_jwt(),
        bio: this.bio,
        image: this.image
    };
};

module.exports = User = mongoose.model('users', user_schema);