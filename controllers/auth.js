const path = require('path');
const User = require('../models/Users');

module.exports.login = (req, res) => {
    res.send(`реакция на форму`);
};
module.exports.register = (req, res) => {
    res.send('all rights, its  page');
};
module.exports.renderLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};
module.exports.renderRegister = (req, res) => {
    res.send('all rights, its  page');
};