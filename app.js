const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize  = require('./util/database');

//routes
const userRoutes = require('./routes/users');
const msgRoutes = require('./routes/messages');
const groupRoutes = require('./routes/groups');



//tables
const User = require('./models/users');
const Msg = require('./models/messages');
const Group = require('./models/groups');
const userGroup = require('./models/user-groups')
const groupMember = require('./models/groupMember');
 

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:3000/"
})) 


//table associations
User.hasMany(Msg);
Msg.belongsTo(User);
 

Group.hasMany(groupMember);
groupMember.belongsTo(Group);

groupMember.belongsTo(User);
   
//many to many relationship between user and group
User.belongsToMany(Group,{through:userGroup}) 
Group.belongsToMany(User,{through:userGroup})
User.hasMany(userGroup);
userGroup.belongsTo(User);
Group.hasMany(userGroup);
userGroup.belongsTo(Group);
  

app.use(userRoutes);
app.use(msgRoutes);
app.use(groupRoutes);

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