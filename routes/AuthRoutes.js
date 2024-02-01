const express = require('express');
const router = express.Router()
const authCont = require('../controller/authCont');
const config = require("../config")

//AuthRoutes
router.post("/setforgetpassword", config.verifyToken, authCont.setforgetpassword)
router.post('/changeuserpassword', config.verifyToken,authCont.changepassword)
router.post("/login", authCont.loginapi)
router.post('/sendmail', authCont.sendmail)
router.post("/register", authCont.userregister)

module.exports = router;