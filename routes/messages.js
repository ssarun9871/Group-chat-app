const express = require('express');
const router = express.Router();
const msgController = require('../controllers/messages');
const userAuthentication = require('../middleware/auth')

router.post('/addmessage',userAuthentication.authenticate,msgController.postAddMessage);
router.get('/getmessage/:lastmsgid',userAuthentication.authenticate,msgController.getAllMessages);
module.exports = router;
