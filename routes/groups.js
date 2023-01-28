const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groups');
const userAuthentication = require('../middleware/auth')

router.post('/addgroup',userAuthentication.authenticate,groupController.postAddGroup);
router.get('/getgroups',userAuthentication.authenticate,groupController.getAllGroups);
router.post('/adduseringroup',userAuthentication.authenticate,groupController.addUserInGroup);

module.exports = router; 