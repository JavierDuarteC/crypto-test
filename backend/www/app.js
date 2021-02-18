const express = require('express');
const bodyParser = require('body-parser');
require('../configs/db-conn');
const router = require('../routes/router');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

module.exports = app;