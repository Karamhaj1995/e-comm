var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

require('../models/user');

module.exports.registerNewUser = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, config.hashRounds);
    user_data = {
        username: req.body.username,
        email: req.body.email,
        hashed: req.body.password
    }
    var user = new User(user_data);
    var result = await user.save();
    res.send(result)
};

module.exports.login = async(req, res, next) => {
    try {
        if(!req.body) { return login_redirect(res); }
        var user = await User.findOne({ username: req.body.username }).exec();
        if(!user) {
            res.render('templates/login', {'errors': ['User now found']});
        }
        if(!bcrypt.compareSync(req.body.password, user.hashed)) {
            res.render('templates/login', {'errors': ['Bad password']});
        }
        let token = jwt.sign({ username: user.username }, config.secret, { expiresIn: '24h' });
        return res.json({
            success: true,
            token: token
        });
    } catch (error) {
        res.render('templates/login', {'errors': [error]});
    }
}

module.exports.checkToken = (req, res, next) => {
    let token = req.headers['cookie'];
    if(token) {
        token.split('; ').forEach(element => {
            if(element.startsWith('authorization=Bearer')) {
                token = element.slice(21, element.length);
            }
        });
        jwt.verify(token, config.secret, (err, decoded) => {
            if(err) { 
                return res.render('templates/login', {'errors': ['Invalid Token']});
            }
            req.decoded = decoded;
            return next();
        });
    } else {
        return res.render('templates/login', {'errors': ['No Token Provided']});
    }
};
