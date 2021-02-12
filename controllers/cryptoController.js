const mongoose = require('mongoose')
const cryptoSchema = require('../models/crypto.model')

cryptoSchema.methods.isNumeric = function (id) {
    return typeof id === 'number';
}

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;