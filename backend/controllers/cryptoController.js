const mongoose = require('mongoose')
const cryptoSchema = require('../models/crypto.model')

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;