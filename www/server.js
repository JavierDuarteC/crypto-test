const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('../configs/db-conn');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = require('../routes/router');
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});