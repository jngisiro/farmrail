const express = require('express');

const app = express();

// import Routes
const authRoute = require('./routes/auth');

//middle ware
app.use(express.json());

// route "middle-ware"
app.use('/api/v1/user', authRoute);

module.exports = app;
