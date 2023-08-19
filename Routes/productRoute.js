const express = require('express');
const {productRegister, getAllProducts,productUpdate, uploadImage, photoResize, productDelete} = require('../Controllers/productController')
const {isLoggedIn, restrictTo} = require('../Controllers/authController');

const router = express.Router();

router
.use(isLoggedIn);

router
.get('/', getAllProducts);

router
.use(restrictTo('admin'));

router
.post('/',uploadImage, photoResize, productRegister)

router
.patch('/:id', productUpdate)

router
.delete('/:id', productDelete)

module.exports = router;