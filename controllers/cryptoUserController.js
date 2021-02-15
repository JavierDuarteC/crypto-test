const mongoose = require('mongoose')
const cryptoUserSchema = require('../models/cryptoUser.model')

const CryptoUser = mongoose.model('CryptoUser', cryptoUserSchema);

module.exports = CryptoUser;