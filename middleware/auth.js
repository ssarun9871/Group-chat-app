const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next)=>{
    try{
        const token = req.header("Authorization");
        const User = jwt.verify(token,'g98yigujkggggu98gyu');
        req.body.userId = User.userId//(User contains userId, name and iat)
        next();
    }
    catch{err=>{console.log(err)}}
} 