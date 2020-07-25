var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('../models/user');

login_redirect = (response) => {
    response.redirect('/login');
}

module.exports.registerNewUser = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, config.hashRounds);
    user_data = {
        username: req.body.username,
        email: req.body.email,
        hashed: req.body.password
    }
    console.log(req.body)
    console.log(user_data)
    var user = new User(user_data);
    var result = await user.save();
    res.send(result)
};

module.exports.login  = async (req, res, next) => {
    try {
        if(!req.body) { return login_redirect(res); }
        var user = await User.findOne({ username: req.body.username }).exec();
        if(!user) {
            return login_redirect(res);
        }
        if(!bcrypt.compareSync(req.body.password, user.hashed)) {
            return login_redirect(res);
        }
        res.redirect('/dashboard');
    } catch (error) {
        return login_redirect(res);
    }
}

module.exports.isAuthorized  = function(req, res, next) {

    if(!req.session) { return login_redirect(res); }

    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return login_redirect(res);
        } else {      
            if (user === null) { 
                return login_redirect(res);
            } else {
                return next();
            }
        }
    });
}