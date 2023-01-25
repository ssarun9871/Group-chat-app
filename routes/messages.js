const express = require('express');
const router = express.Router();
const msgController = require('../controllers/messages');
const userAuthentication = require('../middleware/auth')

router.post('/addmessage',userAuthentication.authenticate,msgController.postAddMessage);

module.exports = router;
