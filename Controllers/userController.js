const bcrypt = require('bcrypt');
const db = require('../Models');
const jwt = require('jsonwebtoken');
const { env } = require('process');
const catchasync = require('../Utils/catchAsync');
const AppError = require('../Utils/AppError');
const { DATE } = require('sequelize');
const { use } = require('../Routes/userRoute');
const { log } = require('console');
const joi = require('joi')

const User = db.users;

const tokenSign = id => {
    return jwt.sign({id}, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


const sendCreateToken = (user,statuscode,res) => {
    const token = tokenSign(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.cookie('jwt', token, cookieOptions)

    res.status(statuscode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

const validateRegistration = catchasync(async(req, res, next) => {
    const registrationSchema = joi.object({
        name: joi.string()
        .min(3)
        .max(50)
        .required(),
        email: joi.string()
        .email()
        .required(),
        password: joi.string()
        .min(8)
        .max(16)
        .required(),
        passwordConfirm: joi.string()
        .valid(joi.ref('password'))
        .required(),
        role: joi.string()
        .valid('admin', 'client')
        .default("client"),
        status: joi.string()
        .valid('active', 'inactive')
        .default("active")

    });

    const {error} = registrationSchema.validate(req.body)

    if (error) {
    return next(new AppError(error.details[0].message, 400))
    }

        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return next(new AppError('Email is already taken', 409));
        }
        next(); 
});

const register = catchasync(async(req, res,next) => {
    const pswd = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const hashPassword = await bcrypt.hash(pswd, 10)
        const data = {
            name: req.body.name,
            email :  req.body.email,
            password: hashPassword,
            role: req.body.role,
            status: req.body.status
        }
        if(pswd !== passwordConfirm){
            return next(new AppError("passwords don't match",401));
        };
        const latestUser = await User.create(data);
        sendCreateToken(latestUser, 201, res)
});

const login = catchasync(async(req, res, next) => {
        const  email = req.body.email
        const password  = req.body.password
        if(!email){
            return next(new AppError('Please provide an valid email address to login', 400))
        }else if(!password){
            return next(new AppError('Please provide an valid password address to login', 400))
        }
        const user = await User.findOne({
            where:{ email }
        });
        if(!user){
            return next(new AppError(`A user with this ${email} does not exist`, 401))
        };
        if(user.status === 'inactive'){
            return next(new AppError('Your Account Is Not Active! Please Contact Admin To Activate Your Account', 401))
        };
        if(user){
            const Same = await bcrypt.compare(password, user.password)
            if(Same){
                sendCreateToken(user, 201, res)
            }else{
                return next(new AppError('Invalid Credentials', 401))
            }
    }
});

const logout = (req, res) => {
    res.cookie('jwt','LoggedOut', {
        expire: new DATE(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success'
    });
};

const changePassword = catchasync(async(req, res, next) => {
    if(!req.body.password && req.body.newPassword){
        return next(new AppError('Please Provide currentpassword & newPassword', 400));
    }
    const user = await User.findOne({
        where: {id: req.users.id}
    });
    const Same = await bcrypt.compare(req.body.password, user.password)

    if(!Same){
        return next(new AppError('The Current Password Is Not Valid', 403))
    };

    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    user.update({password: passwordHash}, {
        where: {id: req.users.id}
    });
    res.cookie('jwt','LoggedOut', {
        expire: new DATE(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        message: 'Your Password Has Been Changed Successfully! Please Login Again...'
    });
});

module.exports = {
    register, 
    login,
    logout,
    changePassword,
    validateRegistration
    }
