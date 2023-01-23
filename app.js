const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize  = require('./util/database');

const userRoutes = require('./routes/users');

app.use(userRoutes);

sequelize.sync()  
.then(result=>{
    app.listen(process.env.PORT||3000);
})
.catch(err=>
    {console.log(err);
}) 