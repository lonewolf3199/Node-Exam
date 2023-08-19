const express = require('express');
const {register, login, logout, changePassword, banUser, getAllUser, deleteUser} = require('../Controllers/userController');
const { isLoggedIn, restrictTo } = require('../Controllers/authController');

const router = express.Router();

router
.post('/register', register);

router
.post('/login', login);

router
.get('/logout', logout);

router
.post('/changePassword',isLoggedIn, changePassword);

router
.get('/',isLoggedIn,restrictTo('admin'), getAllUser)

router
.patch('/:id',isLoggedIn,restrictTo('admin'), banUser)

router
.delete('/:id', isLoggedIn, restrictTo('admin'), deleteUser)

module.exports = router