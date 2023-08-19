module.exports = (sequelize, DataTypes) => {
    return sequelize.define("product", {
        ProductId: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(),
        },
        price:{
            type :DataTypes.DECIMAL(),
        },
        image: {
            type :DataTypes.TEXT('long'),
            defaultValue: ''
        },
        description: {
            type: DataTypes.TEXT(),
        },
        status: {
            type: DataTypes.STRING(),
        }
    }, {timestamps : true}
    );
}