module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        Productid: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(),
            allowNull: false,
            validate:{
                notEmpty: {
                    message: 'A Product Must Have A Name!'
                }
            }
        },
        price:{
            type :DataTypes.DECIMAL(8),
            allowNull: false,
            validate:{
                notEmpty:{
                    isNumeric:true,
                    message:'Price Cannot Be Empty'
                }
            }
        },
        image: {
            type :DataTypes.TEXT('long'),
            defaultValue: ''
        },
        description: {
            type: DataTypes.TEXT(),
            allowNull:false,
            validate:{
                notEmpty:{
                    message:"Description cannot be empty"
                }
            }
        },
        status: {
            type: DataTypes.ENUM(['active','inactive']),
            defaultValue:'active'
        }
    }, {timestamps : true}
    );
    return Product;
}