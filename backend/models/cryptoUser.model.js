const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cryptoUserSchema = new Schema(
    {
        cryptoId:{
            type: Number,
            required: true
        },
        userId:{
            type: String,
            required: true
        },
        quantity:{
            type: Number,
            required: false, //if users want to add quantity
            default: 0
        },
    },{
        timestamps: true
    }
)

module.exports = cryptoUserSchema