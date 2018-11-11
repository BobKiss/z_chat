const express       = require('express');
const router        = express.Router();
const controller    = require('../controllers/auth');

router.get('/login', controller.renderLogin);
router.post('/login', controller.login);
router.get('/register', controller.renderRegister);
router.post('/register', controller.register);

module.exports = router;