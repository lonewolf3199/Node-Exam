const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(`postgres://postgres:Aman123@localhost:5432/NodeExam`, {dialect: "postgres"});

sequelize.authenticate()
.then(() => {
    console.log("Connection has been established successfully.");
}).catch((err) => {
    console.log(err);
});

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel')(sequelize, DataTypes)
db.product = require('./productModel')(sequelize, DataTypes)

module.exports = db