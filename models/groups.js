const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Chat = sequelize.define("Group", {
    id : {
        type : Sequelize.INTEGER ,
        primaryKey: true ,
        autoIncrement : true ,
        allowNull : false 
    },
    name : Sequelize.STRING
})

module.exports = Chat ;