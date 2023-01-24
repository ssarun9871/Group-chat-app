const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize  = require('./util/database');

const userRoutes = require('./routes/users');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(userRoutes);
app.use(cors({
    origin:"http://localhost:3000"
}))

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