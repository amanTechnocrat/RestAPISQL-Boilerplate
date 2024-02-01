const express = require('express');
const router = express.Router()
const config = require('../config');
const userRoutes = require('./UserRoutes');
const authRoutes = require('./AuthRoutes');

//User's Routes
router.use('/user', userRoutes)

//Auth Routes
router.use('/auth', authRoutes)


module.exports = router;