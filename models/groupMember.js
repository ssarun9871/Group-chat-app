const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const groupMember = sequelize.define('groupmember',{
    userId:{
        type:Sequelize.INTEGER
    },
    admin:{
     type:Sequelize.BOOLEAN,
     defaultValue: false,
     allowNull:false,
    }
})

module.exports = groupMember 