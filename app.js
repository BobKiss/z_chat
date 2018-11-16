const express       = require('express');
const app           = express();
const passport      = require('passport');
const routerAuth    = require('./routes/auth');
const routerChat    = require('./routes/chat');
const defaultRoutes = require('./routes/default');
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const keys          = require('./configs/key');

mongoose.connect(keys.modgoURI, {useNewUrlParser: true})
    .then( () =>  console.log('MongoDB connect') )
    .catch( () => console.error('MongoDB error!') );

app.use(passport.initialize());
require('./middleware/passport')(passport);

// SOCKETIO
//
var http = require('http').Server(app);
var io = require('socket.io')(http);

// io.on('connection', function(socket){
//     console.log('connect');
//     socket.on('chat message', function(msg){
//         io.emit('chat message', msg);
//     });
// });
// git test

app.set('socketio', io);

//
// SOCKETIO

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', routerAuth);
app.use('/chat', routerChat);
app.use('/', defaultRoutes);

module.exports = http;