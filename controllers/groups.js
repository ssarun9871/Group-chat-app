const Group = require('../models/groups');
const userGroup = require('../models/user-groups');
const Users = require('../models/users');
const groupMember = require('../models/groupMember');


exports.postAddGroup=async (req,res,next)=>{ 
   //adding group name in group table
   await Group.create({
      userId : req.body.userId,
      grp_name: req.body.groupName
   })
   .then(result=>
   //adding userId (getting as a result) and groupId in user-group table   
   userGroup.create({
   userId : req.body.userId,
   groupId : result.id,
   })
   )
   .then(res.json({success:true,message:"group added successfully"}))
   .catch(err => res.json({success:false, message: "fail to create group"}));
}


//api to get all the groups in which user is a memeber
exports.getAllGroups = async(req,res,next)=>{
try{
   //first find the groups created by user
   let arr = [];
   id = req.body.userId;

   Group.findOne({
      where:{userId:id},
   })
   .then(result =>{
      if(result!=null){
         arr.push({grpId:result.id,grpName:result.grp_name})
      }
   })

   //now find the groups in which curr_user is added by other users
   groupMember.findAll({
      where:{userId:id},
      attributes:['groupId'],
      include:{model:Group}
   }) 
   .then(result =>{
      if(result!=null){
      result.forEach(ele=>{
      arr.push({grpId:ele.group.id,grpName:ele.group.grp_name});
      })
      }

      if(arr.length==0){
      res.status(401).json({status:'no group found!'})
      }
      else{res.status(201).json(arr)}
   })
}

catch{
   err=>res.status(401).json({status:'fail to retrieve user groups',err:err})
}
}



exports.addUserInGroup = async(req,res,next)=>{
   let phone = req.body.phone;
   let groupId = req.body.groupId;
   
   Users.findOne({
   where:{phone:phone}
   })
   .then(user =>{
      if(user==null){
         res.status(401).json({status:false,message:'User not found'})
      }
      else{
         groupMember.create({
         userId:user.id,
         groupId:groupId
         })
         .then(result =>{
         res.status(201).json({status:true,message:'User added in group successfully'})
         })
      }
   })
} 