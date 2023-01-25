const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize  = require('./util/database');

const userRoutes = require('./routes/users');
const msgRoutes = require('./routes/messages');


const userTable = require('./models/users');
const msgTable = require('./models/messages');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:3000/"
}))

userTable.hasMany(msgTable);
msgTable.belongsTo(userTable);


app.use(userRoutes);
app.use(msgRoutes);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,"./",`/views/${req.url}`))
})
 
sequelize.sync()   
.then(result=>{
    app.listen(process.env.PORT||3000);
})
.catch(err=>
    {console.log(err);
})  