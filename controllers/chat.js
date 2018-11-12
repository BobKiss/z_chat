const User      = require('../models/Users');
const Dialog      = require('../models/Dialogs');
const Message      = require('../models/Messages');
const path      = require('path');

module.exports.renderMain = (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'chat.html'));
};
module.exports.createDialog = async (req, res) => {
    const firstMember = await User.findOne({_id: req.body.firstId});
    const secondMember = await User.findOne({_id: req.body.secondId});
    console.log(req.body);
    if (firstMember && secondMember) {
        const candidate1 =  await Dialog.findOne({firstId: req.body.firstId});
        const candidate2 = await Dialog.findOne({secondId: req.body.secondId});
        if (candidate1 && candidate2) {
            res.status(400).json({
                message: 'Такой чат уже существует'
            })
        } else {
            const dialog = new Dialog({
                firstId: req.body.firstId,
                secondId: req.body.secondId
            });
            try {
                await dialog.save();
                res.json(dialog);

            } catch (e) {
                console.log(`controllers/chat error: ${e}`);
            }
        }
    } else {
        res.status(404).json({
            message: 'Были отправленны несуществующие id пользователей'
        })
    }
};
module.exports.getDialogs = async (req, res) => {
    const dialogs1 =  await Dialog.find({firstId: req.body.userId});
    const dialogs2 =  await Dialog.find({secondId: req.body.userId});
    const dialogs = dialogs1.concat(dialogs2);
    res.json(dialogs)
};
module.exports.createChat = async (req, res) => {

};
module.exports.sendMessage = async (req, res) => {
    if (req.body.dialog) {
        const chat =  await Dialog.findOne({firstId: req.body.firstId, secondId: req.body.secondId});
        if (chat) {
            const message = new Message({
                chatId: chat._id,
                fromId: req.body.firstId,
                content: req.body.content,
                flag: false
            });
            try {
                await message.save();
                res.json(message);

            } catch (e) {
                console.log(`controllers/chat error: ${e}`);
            }
        } else {
            res.status(404).json({
                message: 'Такого чата не существует!'
            })
        }
    } else {
        // const chat =  await Dialog.findOne({_id: req.body.chatId});
        // если это чат, то тут отправляем, но привязываем к ЧатИд
    }
};