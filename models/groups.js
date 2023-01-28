const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const group = sequelize.define('groups',{
    grp_name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = group