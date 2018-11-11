const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/default');
const passport      = require('passport');

router.get('/', controller.main);
router.post('/news', passport.authenticate('jwt', {session: false}), controller.news);

module.exports = router;