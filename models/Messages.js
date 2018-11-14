// все сообщения тут
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const messagesSchema = new Schema({
    chatId: {
        type: String,
        required: true
    },
    fromId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    flag: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('message', messagesSchema);