const Msg = require('../models/messages');
const User = require('../models/users');

exports.postAddMessage=async (req,res,next)=>{ 
    await Msg.create({
       userId : req.body.userId,
       message: req.body.msg
    })
    .then(result=> res.json({message:"message added successfully"}))
    .catch(err => res.json({message: "failed"}));
   }



//sending all the messages as response({name:xyz , msg: xyz}) 
exports.getAllMessages = async(req,res,next)=>{
   Msg.findAll({
      include:{
         model:User,
         attributes:['name'],
        
  }})
   .then(data=>{
      let obj =[];
      data.forEach(element => {

         obj.push({name:element.user.name,msg:element.message});
      });
       res.json(obj)
   });
}