const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const groupMember = sequelize.define('groupmember',{
    userId:{
        type:Sequelize.INTEGER
    }
})

module.exports = groupMember