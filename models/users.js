const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const users = sequelize.define('users',{
    id:{
        autoIncrement:true,
        primaryKey : true,
        type:Sequelize.INTEGER,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phone:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }

})
 
module.exports = users;