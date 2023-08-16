module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false ,
            required: [true, 'A Product Must Have A Name']
        },
        price:{
            type :DataTypes.DECIMAL(8),
            defaultValue:'0',
        },
        image: {
            type :DataTypes.TEXT('long'),
            defaultValue: ''
        },
        description: {
            type: DataTypes.TEXT(),
            allowNull:false,
            required:[true,'Product Description is Required'],
        },
        status: {
            type: DataTypes.ENUM(['active','inactive']),
            defaultValue:'active'
        }
    }, {timestamps : true}
    );
}