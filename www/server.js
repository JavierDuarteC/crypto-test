const express = require('express');
const cors = require('cors');
const dbConnection = require('../configs/db-conn');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const router = require('../routes/router');
app.use('/api', router);

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
});