const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSessionSchema = new Schema({
    userId: {
        type: String,
        required:true,
        default: -1
    },
},{
    timestamps: true
})

module.exports = userSessionSchema