// more 2 people
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const chatsSchema = new Schema({
    creatorId: {
        type: String,
        required: true
    },
    chatName: {
        type: String
    },
    members: [],
});

module.exports = mongoose.model('chat', chatsSchema);