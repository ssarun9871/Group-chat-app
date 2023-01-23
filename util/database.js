const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize("group_chat", "root","1234",{
    dialect:"mysql",
    host:"localhost",
    define: { 
        timestamps: false
      }
})
module.exports = sequelize; 