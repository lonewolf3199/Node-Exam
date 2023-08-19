const db = require('../Models');
const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/catchAsync');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const joi = require('joi');
const { Sequelize } = require('sequelize');
const { error } = require('console');

const Product = db.product

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')){
        return cb(null,true)
    };
    return cb(new AppError('Only Image File is Allowed',400),false)
};

const uploadPic = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadImage = uploadPic.single('image');

const photoResize = catchAsync(async(req, res, next) => {
    if(!req.file){
        req.body.image = '';
        return next();
    }
    req.file.filename = `product-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`Images/${req.file.filename}`);
    req.body.image = req.file.filename
    next();
});



const productRegister = catchAsync(async(req, res, next) => {
    let { name, description, image, price, status } = req.body
    const productSchema = joi.object({
        name: joi.string()
        .min(3)
        .max(30)
        .required(),
        description: joi.string()
        .max(1024),
        price: joi.number()
        .integer()
        .positive()
        .required(),
        status: joi.string()
        .valid('active', 'inactive')
        .default('active')
    });

    const {error, value} = productSchema.validate({name, description, price, status});
    status = value.status

    if(error){
        return next(new AppError(error.details[0].message, 400))
    };
    const newProduct = await Product.create({
        name,
        description,
        image,
        price,
        status
    });
    res.status(201).json({
        status: 'success',
        data: newProduct
    })
});

const getAllProducts = catchAsync(async(req, res, next) => {
    const { limit = 10, page = 1, name = '', maxPrice = 10000000, minPrice = 0 } = req.query;
    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
        where: {
            status: 'active',
            name: {
                [Sequelize.Op.like]: `%${name}%`
            },
            price: {
                [Sequelize.Op.between]: [minPrice, maxPrice]
            }
        },
        offset: offset,
        limit: limit
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
        status: 'success',
        results: count,
        data: {
            products: rows
        },
        pagination: {
            totalPages: totalPages,
            currentPage: page
        }
    });
});

const productUpdate = catchAsync(async(req, res, next) => {
    const id = req.params.id
    let {name, description, price, status} = req.body;
    const productSchema = joi.object({
        name: joi.string()
        .min(3)
        .max(30),
        description: joi.string()
        .max(1024),
        price: joi.number()
        .integer()
        .positive()
        .required(),
        status: joi.string()
        .valid('active', 'inactive')
        .default('active')
    });
    const {error, value} = productSchema.validate({name, description, price, status});
    status = value.status

    if(error){
        return next(new AppError(error.details[0].message, 400))
    };
    const availabeProduct = await Product.findOne({
        where: {ProductId: id}
    });
    if(!availabeProduct){
        return next(new AppError('No Product Found With The Provided ID!', 404))
    }
    const updateProduct = await Product.update(req.body,{
        where: {ProductId :id}
    });
    if(updateProduct === 0){
        return next(new AppError('Something Went Wrong',500))
    }
    const products = await Product.findOne({
        where: {ProductId: id}
    })
    res.status(200).json({
        status: "success",
        data: products
    });
});

const productDelete = catchAsync(async(req, res, next) => {
    const id = req.params.id
    const products = await Product.findOne({
        where:{ProductId: id}
    });
    if(!products){
        return next(new AppError('No Product Found By This Id!', 404))
    };
    const PD = await Product.destroy({
        where:{ProductId: id}
    });
    return res.status(200).json({
        status: 'success',
        message:'Deleted Successfully'
    });
})





module.exports = {
    productRegister,
    getAllProducts,
    productUpdate,
    productDelete,
    uploadImage,
    photoResize
}

