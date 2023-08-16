const bcrypt = require('bcrypt');
const db = require('../Models');
const jwt = require('jsonwebtoken');
const { env } = require('process');


const User = db.users;

const register = async(req, res) => {
    try{
        const data = {
            name: req.body.name,
            email :  req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            role: req.body.role
        }
        console.log(data);
        const user = await User.create(data);
        console.log(user);
        if(user){
            let token = jwt.sign({id: user.id}, process.env.JWT_KEY, { expiresIn: 1 * 24 * 60 * 60 * 1000, })
            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            res.status(200).json({
                status: 'success',
                token,
                data: {
                user
                }
            });
        }else{
            res.status(409).json({
                status: 'fail',
                message:'Provided Details Are Not Correct'
            });
        }
    }catch(err){
        console.log(err.message);
        res.status(400).json({
            status: 'fail',
            message: 'something went wrong'
            });
    }
};

const login = async(req, res) => {
    try{
        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).json({
                status: 'fail', 
                message:"Please Provide Email And Password"
            });
        }

        const user = await User.findOne({
            where:{
                email: email,
            }
        });
        if(!user){
            return res.status(401).json({
                status: 'fail',
                message : "Invalid Credentials!"
            });
        };
        if(user.status === 'inactive'){
            return res.status(401).json({
                status: 'fail',
                message :"Account is Inactive! Please Contact Admin."
            });
        };
        if(user){
            const Same = await bcrypt.compare(password, user.password)
            if(Same){
                let token = jwt.sign({id: user.id}, process.env.JWT_KEY, {
                    expiresIn: 1 * 24 * 60 * 1000,
                });
                res.cookie("jwt", token,{maxAge: 1 * 24 * 60, httpOnly: true});
                return res.status(201).json({
                    status: 'success',
                    token,
                    data:{
                        user: user
                    }
                })
            }else{
                return res.status(401).json({
                    status: 'fail',
                    message: 'User Authentication Failed'
                })
            }
        }else{
            return res.status(401).json({
                status: 'fail',
                message: 'User Authentication Failed'
            })
        }
    }catch(err){
        console.log("error", err);
        res.status(400).json({
            status: 'fail',
            message: 'something went wrong'
        })
    }
}

module.exports = {
    register, login
}