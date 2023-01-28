const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const userGroup = sequelize.define('user-group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    }
})

module.exports = userGroup