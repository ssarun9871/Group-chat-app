const Msg = require('../models/messages');

exports.postAddMessage=async (req,res,next)=>{
    
    await Msg.create({
       userId : req.body.userId,
       message: req.body.msg
    })
    .then(result=> res.json({message:"message added successfully"}))
    .catch(err => res.json({message: "failed"}));
   }