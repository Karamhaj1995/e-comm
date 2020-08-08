var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

require('../models/user');

module.exports.registerNewUser = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, config.hashRounds);
    var user_data = {
        username: req.body.username,
        email: req.body.email,
        hashed: req.body.password
    }
    var user = new User(user_data);
    var result = await user.save();
    res.send(result);
};

module.exports.login = async(req, res, next) => {
    try {
        if(!req.body) { return login_redirect(res); }
        var request_type = req.body.type;
        if(request_type == 'form') {
            var user = await User.findOne({ username: req.body.username }).exec();
            if(!user) {
                res.render('templates/login', {'errors': ['User now found']});
            }
            if(!bcrypt.compareSync(req.body.password, user.hashed)) {
                res.render('templates/login', {'errors': ['Bad password']});
            }
            let token = jwt.sign({ username: user.toJSON() }, config.secret, { expiresIn: '24h' });
            return res.json({
                success: true,
                token: token
            });
        } else if(request_type == 'facebook') {
            var user = await User.findOne({ facebook_id: req.body.username }).exec();
            if(!user) {
                var user_data = {
                    username: req.body.username,
                    image_link: req.body.image,
                    facebook_id: req.body.username,
                }
                user = new User(user_data);
            }
            user = await user.save();
            let token = jwt.sign({ user: user.toJSON() }, config.secret, { expiresIn: '24h' });
            return res.json({
                success: true,
                token: token
            });
        }
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
            } else if(element.startsWith('facebook=')) {
                token = element.slice(9, element.length);
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
