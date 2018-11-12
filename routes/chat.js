const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/chat');
const passport      = require('passport');

router.get('/', controller.renderMain);
router.post('/createDialog', passport.authenticate('jwt', {session: false}), controller.createDialog);
router.post('/getDialogs', passport.authenticate('jwt', {session: false}), controller.getDialogs);
router.post('/sendMessage', passport.authenticate('jwt', {session: false}), controller.sendMessage);

module.exports = router;