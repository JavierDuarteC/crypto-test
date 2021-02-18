const mongoose = require('mongoose')
const userSchema = require('../models/user.model')
const bcrypt = require('bcrypt')

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User