const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groups');
const userAuthentication = require('../middleware/auth')

router.post('/creategroup',userAuthentication.authenticate,groupController.postCreateGroup);
router.get('/getgroups',userAuthentication.authenticate,groupController.getAllGroups);
router.post('/adduseringroup',userAuthentication.authenticate,groupController.addUserInGroup);
router.post('/getallmembers',userAuthentication.authenticate,groupController.getAllMembersOfGroups);
router.post('/makeadmin',userAuthentication.authenticate,groupController.postMakeAdmin);
router.post('/deleteuser',userAuthentication.authenticate,groupController.postDeleteUser);

module.exports = router;  