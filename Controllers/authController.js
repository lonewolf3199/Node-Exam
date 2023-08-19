const jwt = require('jsonwebtoken');
const db = require('../Models');
const catchasync = require('../Utils/catchAsync');
const AppError = require('../Utils/AppError');
const { promisify } = require('util');

const User = db.users;

const isLoggedIn = catchasync(async(req, res, next) => {
    if(req.cookies['jwt']){
        try{
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_KEY
            );
            const userlogin = await User.findOne({
                where: { id: decoded.id }
            });
            if(!userlogin){
                return next(new AppError('The User is not LoggedIn! Please Login to continue...', 401))
            };
            req.users = userlogin;
            return next()
        }catch(err){
            return next(new AppError('Something went wrong while completing your request', 400))
        }
    }
    return next(new AppError('The User is not LoggedIn! Please Login to continue...', 401))
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.users.role)){
            return next(new AppError('You Are Not Authorize To Access This Route!',403))
        }
        next();
    };
};

module.exports ={
    isLoggedIn,
    restrictTo
}