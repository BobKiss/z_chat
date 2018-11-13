const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const keys = require('../configs/key')
const path      = require('path');
const User      = require('../models/Users');

module.exports.renderRegister = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
};
module.exports.register = async (req, res) => {
    const candidate = await User.findOne({login: req.body.login});
    console.log(req.body.login);
    if (candidate) {
        res.send('Такой пользователь уже зарегистрирован, попробуй другой логин :)');
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            login: req.body.login,
            password: bcrypt.hashSync(password, salt)
        });
        try {
            await user.save();
            res.json(user);

        } catch (e) {
            console.log(`controllers/register error: ${e}`);
        }
    }
};
module.exports.login = async (req, res) => {
    const candidate = await User.findOne({login: req.body.login});
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            const token = jwt.sign({
                login: candidate.login,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60 * 2});

            res.json({
                token: `Bearer ${token}`,
                user: {
                    login: candidate.login,
                    userId: candidate._id
                }
            })
        } else {
            res.send('Неверный пароль!')
        }
    } else {
        res.send('Зарегистируйтесь, такого пользователя не существует :)')
    }
};
module.exports.renderLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
};
