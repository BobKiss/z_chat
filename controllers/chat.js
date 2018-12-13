const User      = require('../models/Users');
const Dialog    = require('../models/Dialogs');
const Message   = require('../models/Messages');
const path      = require('path');

module.exports.renderMain = (req, res) => {
    // const io = req.app.get('socketio');
    //
    // var nsp = io.of('/my-namespace');
    // nsp.emit('send', 'everyone!');

    res.sendFile(path.join(__dirname, '../public', 'chat.html'));
};
module.exports.createDialog = async (req, res) => {
    const firstMember = await User.findOne({_id: req.user._id});
    const secondMember = await User.findOne({_id: req.body.secondId});
    const io = req.app.get('socketio');
    var nsp = io.of(`/`);
    if (firstMember && secondMember) {
        const unicCheck = await Dialog.findOne({
            $or: [
                { firstId:  req.user._id, secondId: req.body.secondId },
                { secondId: req.user._id, firstId:  req.body.secondId  }
                ]
        });

        if (unicCheck) {
            res.status(400).json({
                message: 'Такой чат уже существует'
            })
        } else {
            const dialog = new Dialog({
                firstId: req.user._id,
                secondId: req.body.secondId
            });
            try {
                await dialog.save();
                nsp.emit('newDialog', JSON.stringify(dialog));
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
module.exports.getUserDialogs = async (req, res) => {
    const dialogsId1 =  await Dialog.find({firstId: req.user._id});
    const dialogsId2 =  await Dialog.find({secondId: req.user._id});
    const dialogsId = dialogsId1.concat(dialogsId2);
    // console.log(dialogsId);
    // userName, lastMessage

    let dialogsInfo = [];
    const response = await Promise.all(dialogsId.map( async function(dialog, i, arr) {
        // console.log(dialog)
        //console.log(`${dialog.firstId} == ${req.user._id} ? ${dialog.secondId} : ${dialog.firstId}`);
        const userId = (dialog.firstId == req.user._id ? dialog.secondId : dialog.firstId);
        const userName = await User.findOne({_id: userId}, {login: 1, _id: 0});
        // console.log(userId);
        let lastMessage =  await Message.findOne({chatId: dialog._id}, {_id: false }).sort({_id:-1});
        if (lastMessage === null) {
            lastMessage = {
                chatId: dialog._id
            };
        }
        return {
            userId: userId,
            userName: userName['login'],
            lastMessage: lastMessage
        };
    }));
    // console.log(response);
    res.json(response);
};
module.exports.createChat = async (req, res) => {
    // console.log(req.user)
};
module.exports.sendMessage = async (req, res) => {
    const chat =  await Dialog.findOne({ _id : req.body.chatId });
    const io = req.app.get('socketio');
    var nsp = io.of(`/`);
    if (chat) {
        const message = new Message({
            chatId: chat._id,
            fromId: req.user._id,
            content: req.body.content,
            flag: false
        });
        try {
            await message.save();
            nsp.emit('sendMessage', JSON.stringify(message));
            res.json(message);
        } catch (e) {
            console.log(`controllers/chat error: ${e}`);
        }
    } else {
        res.status(404).json({
            message: 'Такого чата не существует!'
        })
    }
};

module.exports.getDialog = async (req, res) => {
    const dialog =  await Dialog.findOne({ _id : req.body.chatId });
    const user1 = await User.findOne({_id: dialog.firstId}, {login: 1, _id: 1});
    const user2 = await User.findOne({_id: dialog.secondId}, {login: 1, _id: 1});
    const messages = await Message.find({ chatId: req.body.chatId }).sort({'createdAt': -1}).limit(5);
    let response = {
        dialogInfo: dialog,
        user: user1._id === req.user._id ? user1 : user2,
        companion: user1._id === req.user._id ? user2 : user1,
        messages: messages
    };
    // console.log(response);
    // const io = req.app.get('socketio');
    // var nsp = io.of(`/${dialog._id}`);
    // nsp.emit('sendMessage', 'Получили диалог');
    res.json(response);
};

module.exports.getUsers = async (req,res) => {
    if (req.body.login.length > 3 ) {
        const candidates = await User.find({ "login": { "$regex": `${req.body.login}`, "$options": "i" } }, {login: 1, _id: 1}).limit(5);
        res.json(candidates);
    } else {
        res.json({
            error: true,
            message:"I want more symbols, bro."
        });
    }
};