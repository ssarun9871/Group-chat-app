const userControllers = require('../controllers/users');
const express = require('express');
const router = express.Router();

router.post('/adduser',userControllers.postAddUsers);
router.post('/login',userControllers.postLoginUser)

module.exports = router;