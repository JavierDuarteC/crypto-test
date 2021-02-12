const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cryptoSchema = new Schema(
    {
        id:{
            type: Number,
            required: true
        },
        price:{
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        source:{
            type: String,
            required: true
        }
    },{
        timestamps: true
    }
)

module.exports = cryptoSchema