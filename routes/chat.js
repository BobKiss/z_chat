const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/chat');
const passport      = require('passport');

router.get('/', controller.renderMain);
router.post('/createDialog', passport.authenticate('jwt', {session: false}), controller.createDialog);
router.post('/createChat', passport.authenticate('jwt', {session: false}), controller.createChat);
router.post('/getUserDialogs', passport.authenticate('jwt', {session: false}), controller.getUserDialogs);
router.post('/sendMessage', passport.authenticate('jwt', {session: false}), controller.sendMessage);
router.post('/getDialog', passport.authenticate('jwt', {session: false}), controller.getDialog);

module.exports = router;