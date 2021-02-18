var express = require('express')();
var middleware = require('../controllers/middleware');

// Load data fron BNC
express.use('/load', require('./api/load'));

// Login/Signup routes
express.use('/auth', require('./api/auth'));

// Crypto routes
express.use('/currency', require('./api/crypto'));

// User routes
express.use('/profile',middleware.ensureAuthenticated, require('./api/users'));

module.exports = express;