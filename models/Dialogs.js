// тет-а-тет общение
const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const dialogsSchema = new Schema({
    firstId: {
        type: String,
        required: true
    },
    secondId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('dialog', dialogsSchema);