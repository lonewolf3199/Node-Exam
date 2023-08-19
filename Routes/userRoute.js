const express = require('express');
const {register, login, logout, changePassword} = require('../Controllers/userController');
const { isLoggedIn } = require('../Controllers/authController');

const router = express.Router();

router
.post('/register', register);

router
.post('/login', login);

router
.get('/logout', logout);

router
.post('/changePassword',isLoggedIn, changePassword);

module.exports = router