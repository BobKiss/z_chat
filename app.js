const express = require('express');
const app = express();
const routerAuth = require('./routes/auth');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./configs/key');


mongoose.connect(keys.modgoURI, {useNewUrlParser: true})
    .then( () =>  console.log('MongoDB connect') )
    .catch( () => console.error('MongoDB error!') );

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', routerAuth);

module.exports = app;