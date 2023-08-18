const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(),
        },
        email: {
            type: DataTypes.STRING(),
        },
        password: {
            type: DataTypes.STRING(),
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),        
        },
        role: {
            type: DataTypes.ENUM('admin', 'client'),
        }
    }, { timestamps: true });

    return User;
};
