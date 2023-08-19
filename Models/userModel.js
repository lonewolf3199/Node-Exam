const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("user", {
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
            type: DataTypes.STRING(),        
        },
        role: {
            type: DataTypes.STRING(),
        }
    }, { timestamps: true });

    return User;
};
