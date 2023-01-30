const Group = require('../models/groups');
const userGroup = require('../models/user-groups');
const Users = require('../models/users');
const groupMember = require('../models/groupMember');
const { Op } = require("sequelize");
const { consumers } = require('stream');


exports.postCreateGroup=async (req,res,next)=>{ 
   //adding group name in group table
   await Group.create({
      userId : req.body.userId,
      grp_name: req.body.groupName
   })
   .then(response=>
      groupMember.create({ 
         userId:req.body.userId,
         groupId:response.id,
         admin:req.body.admin
      })
   )
   .then(result=>
   //adding userId (getting as a result) and groupId in user-group table   
   userGroup.create({
   userId : req.body.userId,
   groupId : result.groupId,
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
   let userName = '';
   
   Users.findOne({
      where:{
         id:id
      }
   })
   .then(user=>userName=user.name);
      groupMember.findAll({
      where:{userId:id},
      attributes:['groupId','admin'],
      include:{model:Group}
   }) 
   .then(result =>{  
      if(result.length!=0 ){
      result.forEach(ele=>{
      arr.push({grpId: ele.group.id,  grpName: ele.group.grp_name,  admin: ele.admin});
      })
      }

      if(arr.length==0){
      res.status(401).json({status:'no group found!'})
      }
      else{res.status(201).json({arr,userName})}
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
   where:{
      [Op.or]: [
      { phone:phone },
      { email:phone }
      ]
   }
   })
   .then(user =>{
      if(user==null){
         res.status(401).json({status:false,message:'User not found'})
      }
      else{
         groupMember.create({
         userId:user.id,
         groupId:groupId,
         })
         .then(result =>{
         res.status(201).json({status:true,message:'User added in group successfully'})
         })
      }
   })
} 


//to get all the members of the group
exports.getAllMembersOfGroups = async(req,res,next)=>{
 let groupId = req.body.groupId;
 groupMember.findAll({
   where:{groupId:groupId},
   // attributes:['userId'],
   include:{model:Users}
 })
.then(data => {
   let users = []

   data.forEach((ele=>{
      let obj = {userId:ele.userId,  name:ele.user.name, admin:ele.admin};
      users.push(obj);
   }))
res.json(users)})
.catch(err=>{
res.send(err);
})
}
 


//make another user from the group "admin"
exports.postMakeAdmin = (req,res,next)=>{
   const userId = req.body.usrId;
   const groupId = req.body.grpId;

   groupMember.update(
      {admin:true},
      {where:{
         [Op.and]: [
            { userId:userId },
            { groupId:groupId }
            ]}
      }
      )
   .then(result=>{
      res.json(result);
   })
   .catch(err=>res.send(err));
}

//delete a user from group
exports.postDeleteUser = (req, res, next)=>{
   const userId = req.body.usrId;
   const groupId = req.body.grpId;

   groupMember.destroy({
      where:{
         [Op.and]: [
            { userId:userId },
            { groupId:groupId }
            ]
         }
   })
   .then(result=>{
      res.json(result);
   })
   .catch(err=>res.send(err));
}