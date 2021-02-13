const mongoose = require('mongoose')
const cryptoUserSchema = require('../models/cryptoUser.model')

cryptoUserSchema.methods.isNumeric = function (id) {
    return typeof id === 'number';
}

const CryptoUser = mongoose.model('CryptoUser', cryptoUserSchema);

module.exports = CryptoUser;