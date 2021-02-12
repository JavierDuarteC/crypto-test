const e = require("express");

var mongoose = require('mongoose');

//const db_path = 'mongodb://mongodb:27017/log_project'
const db_path = 'mongodb://localhost/crypto-test';
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(db_path, config, error => {
    if(error){
        console.log('Error connectiong to database: '+error);
    }else{
        console.log('Mongo is connected');
    }
});

const connection = mongoose.connection
connection.once('open',()=>{
    console.log('MongoDB database connection established successfully')
})