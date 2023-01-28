const Msg = require('../models/messages');
const User = require('../models/users');
const { Op } = require("sequelize");

exports.postAddMessage=async (req,res,next)=>{ 
    await Msg.create({
       userId : req.body.userId,
       message: req.body.msg,
       groupId:req.body.grpId
    })
    .then(result=> res.json({message:"message added successfully"}))
    .catch(err => res.json({message: "failed"}));
   }


// sending id, name and messages of all users 
exports.getAllMessages = async(req,res,next)=>{
 
   if(req.body.lastMsgId==undefined){
      lastmsgid=0
   }
   else{
      lastmsgid=req.body.lastMsgId
   }

   Msg.findAll({
      //where id is greater than 'lastmsgid'
      where:{
         groupId:req.body.groupId ,
         id:{[Op.gt]:lastmsgid},
         
      },
      
      //it will include the name in result data
      include:{
         model:User,
         attributes:['name'], 
      },

      //below code is to send only last/latest 10 messages
      order:[['id','DESC']],
      limit:10,  
   }).then(data=>{
      let obj =[];
      data.forEach(element => {

         obj.push({id:element.id, name:element.user.name, msg:element.message});
      });
       res.json(obj)
   });
}