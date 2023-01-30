// const Sequelize = require('sequelize');

// const sequelize = new Sequelize("group_chat", "root","1234",{
//     dialect:"mysql",
//     host:"localhost",
//     define: { 
//         timestamps: false
//       }
// })
// module.exports = sequelize; 

const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_database, process.env.DB_user,process.env.DB_password,{
    dialect:"mysql",
    host:process.env.DB_host,
    define: { 
        timestamps: false
      }
})
module.exports = sequelize;