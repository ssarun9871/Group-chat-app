const display = document.getElementById('display');
const grpDisplay = document.getElementById('group_table');
const token = localStorage.getItem('token');
document.getElementById('send').addEventListener('click',addMessage);
document.getElementById('createGroup').addEventListener('click',createGroup);



window.addEventListener('DOMContentLoaded',async ()=>{
    try{
    localStorage.removeItem('currGroup')
    const grp = await axios.get(`http://13.232.149.196:3000/chat/getgroups`,{headers:{"Authorization":token}});

    document.getElementById('userName').innerText=`User : ${grp.data.userName}`
    
    grp.data.arr.forEach(data=>{
        let visibility = 'hidden'
        if(data.admin==true){
            visibility='visible'
        }   
        groupDisplayOnScreen(data.grpId,  data.grpName, visibility);
    })}
    catch{console.log('Unable to load group')}
})



async function addMessage(e){
    e.preventDefault();
    try{
        
        const message = document.getElementById('msg').value;
        let currGroup = localStorage.getItem('currGroup');
        if(currGroup==null){
            alert('Choose a group to chat')
        }
        else{
            let obj = {
            msg :message,
            grpId:localStorage.getItem('currGroup')
            };
            await axios.post(`http://13.232.149.196:3000/chat/addmessage`, obj,{headers:{"Authorization":token}});
        }

        let msg =`<tr><td>${obj.name} : ${obj.msg}</td></tr>`
        display.innerHTML = display.innerHTML + msg;
    }

    
    catch(err){
        console.log(err.response);
    }
} 


//create new group 
async function createGroup(){
    let name = document.getElementById('groupName');
    await axios.post('http://13.232.149.196:3000/chat/creategroup',{groupName:name.value,admin:true},{headers:{"Authorization":token}})
    .then(res=>{
        if(res.data.success==true){
            alert('Group created successfully')
           
        }
        else {
            alert('Unable to create new group')
        }
        name.value = "";
        location.reload();
    })
}



//display messages on screen
function msgDisplayOnScreen() {
    let data = JSON.parse(localStorage.getItem('messages'));

    data.forEach(obj=>{
        let msg =`<tr><td>${obj.name} : ${obj.msg}</td></tr>`
        display.innerHTML = display.innerHTML + msg;

    })
}



//display groups on screen
function groupDisplayOnScreen(grpId,grpName,visibility){
    let grp =  `<tr id=${grpId} >
                <td style="text-align: left;width:90%" onClick='showMessages(${grpId})'>${grpName}</td>
                <td style="text-align:  right;"><button class="invite_button" style="visibility:${visibility};" data-toggle="modal" data-target="#m${grpId}" >invite</button>
                <td style="text-align:  right;"><button class="invite_button" id="userList" style="visibility:${visibility};" data-toggle="modal" data-target="#s${grpId}" >users</button>
                </tr>
                

                <!-- to add/invite new user -->
                <div class="modal fade" id="m${grpId}" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header" style="background-color:#007fd3;color:white">
                        <h5 class="modal-title" id="modal_title" style="font-weight: 600;">Add user</h5>
                    </div>

                    <div class="modal-body">
                        <span style="margin-left: 2px; font-weight: 600;">User detail</span>  &nbsp;&nbsp;&nbsp;  
                        <input type="text"class="form-control" id="addUserInGroup${grpId}" style="width: 70%; margin-top: 6px;" placeholder="Enter phone or email ">
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-success btn-sm" data-dismiss="modal" onClick='addUserInGroup(${grpId})'>Add</button>
                        <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
                </div>
            </div>
            

               <!-- to see the members of group -->
            <div class="modal fade" id="s${grpId}" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header" style="background-color:#007fd3;color:white">
                    <h5 class="modal-title" id="modal_title" style="font-weight: 600;">Group members</h5>
                </div>

                <div class="modal-body" style="display:block;">
                 <ul id="user-list-ul-${grpId}"style="list-style-type: none;margin:0px;height:150px;overflow-y:scroll;">
                
                 </ul>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
            `
    grpDisplay.innerHTML = grpDisplay.innerHTML + grp;
   add(grpId)
}


//function to display users inside a group 
async function add(grpId){
    let res =  await axios.post('http://13.232.149.196:3000/chat/getallmembers',{groupId:grpId},{headers:{"Authorization":token}});

    res.data.forEach(user =>{
        let visibility = 'visible';
        if(user.admin==true) {visibility = 'hidden';}
        let parentUl = document.getElementById(`user-list-ul-${grpId}`);
    
        let li=` <li style="margin-bottom:10px;">${user.name}  <button style="float:right;  margin-right:20px;  border-radius:3px;  visibility:${visibility};" onClick="makeAdmin(${grpId},${user.userId})">make admin</button>  <button style="float:right;margin-right:20px;border-radius:3px;  visibility:${visibility};"  onClick="deleteUser(${grpId},${user.userId})">delete</button>  </li>`
       
        parentUl.innerHTML = parentUl.innerHTML + li;
    })

}

//function to make a user "admin" from the group
async function makeAdmin(grpId,userId){
    let obj = {
        grpId:grpId,
        usrId:userId
    }
    const res = await axios.post(`http://13.232.149.196:3000/chat/makeadmin`,obj,{headers:{"Authorization":token}});
    location.reload();
}

//function to delete a user from gorup
async function deleteUser(grpId,userId){
    console.log("groupId = "+grpId+"  userId = "+userId);
    let obj = {
        grpId:grpId,
        usrId:userId
    }
    const res = await axios.post(`http://13.232.149.196:3000/chat/deleteuser`,obj,{headers:{"Authorization":token}});
    location.reload();
}


//function to add user in group
async function addUserInGroup(grpId){
    try{
        let phone = document.getElementById(`addUserInGroup${grpId}`).value;
        obj={
            phone:phone,
            groupId:grpId,
        }

        const res = await axios.post(`http://13.232.149.196:3000/chat/adduseringroup`,obj,{headers:{"Authorization":token}});
        if(res.data.status==true){
            alert('User added successfully');
            location.reload();
        }
    }
    
    catch{
        alert('User not found!')
    }
}



async function showMessages(groupId){
   
  //to make chat realtime
  setInterval(async function(){ 
        localStorage.removeItem('messages');
        var child = display.lastElementChild; 
        while (child) {
            display.removeChild(child);
            child = display.lastElementChild;
        }
        localStorage.setItem('currGroup',groupId);
    
        //these if-else conditions are to get lastMsgId if any msg present in localstorage
        if(localStorage.getItem('messages')===null){
        lastMsgId=undefined
        }
    
        else if(JSON.parse(localStorage.getItem('messages')).length==0){
        lastMsgId=undefined
        }
    
        else {
        let arrayFromLS = JSON.parse(localStorage.getItem('messages'))
        lastMsgId = arrayFromLS[arrayFromLS.length-1].id;
        }
         
        let obj = {
            lastMsgId : lastMsgId,
            groupId : groupId
        }
    
    
        const res = await axios.post(`http://13.232.149.196:3000/chat/getmessage`,obj,{headers:{"Authorization":token}});
        //If any new msg received from database
        if(res.data!=null){ 
            if( res.data.length!=0){
     
            //sort the msgs recieved from backend in aescending order of id
            msgs = res.data.sort((a,b)=>a.id-b.id);
     
            let msgFromLS = JSON.parse(localStorage.getItem('messages'))
             
            //if there are messages already present in localstorage then it will be combined with new ones
            if(msgFromLS!=null){
            let slicedData = msgFromLS.slice(res.data.length);
            msgs = slicedData.concat(msgs)
            }
            
            let prevMsg = JSON.stringify(msgFromLS);
            let finalMsg = JSON.stringify(msgs);
            //now the final message array is getting stored in localstorage
            localStorage.setItem('messages',finalMsg);
            msgDisplayOnScreen();
            }
        }   
    },1000)
}