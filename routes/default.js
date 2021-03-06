const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/default');
const passport      = require('passport');

router.get('/', controller.main);
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => { res.status(200).json({ message: 'OK'})});
// router.post('/news', passport.authenticate('jwt', {session: false}), controller.news);

module.exports = router;