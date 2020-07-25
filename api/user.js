
var express = require('express');
var router = express.Router();
var auth = require('../logic/auth');

require('../models/user');

router.post('/user/', (req, res) => {
    return auth.registerNewUser(req, res);
});

module.exports = router
