const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    fav_crypto: {
        type: Number,
        required: true,
        default: -1
    },
    token: {
        type: String,
        default:""
    }
}, {
        timestamps: true
    }
)

module.exports = userSchema