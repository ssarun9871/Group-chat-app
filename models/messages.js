const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const msg = sequelize.define('messages',{
  message:{
    type:Sequelize.STRING,
    allowNull:false
  }
})

module.exports = msg