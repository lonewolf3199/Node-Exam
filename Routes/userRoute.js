const express = require('express');
const {register, login, logout, changePassword, validateRegistration} = require('../Controllers/userController');
const { isLoggedIn } = require('../Controllers/authController');

const router = express.Router();

router
.post('/register',validateRegistration, register);

router
.post('/login', login);

router
.get('/logout', logout);

router
.post('/changePassword',isLoggedIn, changePassword);

module.exports = router