const mongoose = require('mongoose')
const userSessionSchema = require('../models/userSession.model')

const UserSession = mongoose.model('UserSession', userSessionSchema)

module.exports = UserSession