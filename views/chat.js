const display = document.getElementById('display');
const grpDisplay = document.getElementById('group_table');
const token = localStorage.getItem('token');
document.getElementById('send').addEventListener('click',addMessage);
document.getElementById('createGroup').addEventListener('click',createGroup);


window.addEventListener('DOMContentLoaded',async ()=>{
    try{
    localStorage.removeItem('currGroup')
    const grp = await axios.get(`http://localhost:3000/getgroups`,{headers:{"Authorization":token}});
    
    grp.data.forEach(data=>{
        groupDisplayOnScreen(data.grpId,  data.grpName);
    })}
    catch{console.log('Unable to load group')}
})


// setInterval(async ()=>{   
// const res = await axios.get(`http://localhost:3000/getmessage`,{headers:{"Authorization":token}});
// },1000)


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
            await axios.post(`http://localhost:3000/addmessage`, obj,{headers:{"Authorization":token}});
        }
    }
    catch(err){
        console.log(err.response);
    }
} 



async function createGroup(){
    let name = document.getElementById('groupName');
    await axios.post('http://localhost:3000/addgroup',{groupName:name.value},{headers:{"Authorization":token}})
    .then(res=>{
        if(res.data.success==true){
            alert('Group created successfully')
           
        }
        else {
            alert('Unable to create new     group')
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



//display group name on screen
function groupDisplayOnScreen(grpId,grpName){
    let grp =  `<tr id=${grpId} >
                <td style="text-align: left;" onClick='showMessages(${grpId})'>${grpName}</td>
                <td style="text-align: right;"><button class="invite_button" data-toggle="modal" data-target="#ModalCenter" > </button>
                </tr>
                
                <div class="modal fade" id="ModalCenter" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header" style="background-color:#007fd3;color:white">
                        <h5 class="modal-title" id="modal_title" style="font-weight: 600;">Add user</h5>
                    </div>

                    <div class="modal-body">
                        <span style="margin-left: 2px; font-weight: 600;">Phone number</span>  &nbsp;&nbsp;&nbsp;  
                        <input type="text"class="form-control" id="phoneNo" style="width: 70%; margin-top: 6px;" placeholder="Enter phone number">
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-success btn-sm" id="addUser" data-dismiss="modal" onClick='addUserInGroup(${grpId})'>Add</button>
                        <button type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
                </div>
            </div>`
    grpDisplay.innerHTML = grpDisplay.innerHTML + grp;
}



//function to add user in group
async function addUserInGroup(grpId){
    try{
        let phone = document.getElementById('phoneNo').value;
        obj={
            phone:phone,
            groupId:grpId
        }

        const res = await axios.post(`http://localhost:3000/adduseringroup`,obj,{headers:{"Authorization":token}});
        if(res.data.status==true){
            alert('User added successfully');
        }
    }
    
    catch{
        alert('User not found!')
    }
}



async function showMessages(groupId){
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

    const res = await axios.post(`http://localhost:3000/getmessage`,obj,{headers:{"Authorization":token}});
    //If any new msg received from database
    if(res.data!=null){ 
        if( res.data.length!=0){
 
        //sort the msgs recieved from backend in aescending order of id
        msgs = res.data.sort((a,b)=>a.id-b.id);
 
        let dataFromLS = JSON.parse(localStorage.getItem('messages'))
         
        //if there are messages already present in localstorage then it will be combined with new ones
        if(dataFromLS!=null){
        let slicedData = dataFromLS.slice(res.data.length);
        msgs = slicedData.concat(msgs)
        }
         
        //now the final message array is getting stored in localstorage
        localStorage.setItem('messages',JSON.stringify(msgs));
 
        msgDisplayOnScreen();
        }
    }
}