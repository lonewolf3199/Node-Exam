const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            required: [true, 'A User Must Have A Name!'],
        },
        email:{
            type: DataTypes.STRING,
            unique :  [true, "Email Already Exists"],
            isEmail: true,
            allowNull:false ,
            required: [true,'An Email Is Required'],
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            minlength:8,
            maxlength:16,
            required: [true,"Password is Required"],
        },
        passwordConfirm: {
            type:DataTypes.VIRTUAL,
        },
        status: {
            type:DataTypes.ENUM('active','inactive'),
            defaultValue:'active',
        },
        role: {
            type: DataTypes.ENUM('admin','client'),
            defaultValue:"client"
        }
    },{timestamps: true}, 
    )
    return User
}