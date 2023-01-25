document.getElementById('send').addEventListener('click',addMessage);
const display = document.getElementById('display');
const token = localStorage.getItem('token');


window.addEventListener('DOMContentLoaded',async ()=>{
    let lastMsgId;

    //these if-else conditions are to get lastMsgId if any msg present in localstorage
    if(localStorage.length<2 ){
       lastMsgId=undefined
    }
    else if(JSON.parse(localStorage.getItem('messages')).length==0){
        lastMsgId=undefined
    }
    else {
      let arrayFromLS = JSON.parse(localStorage.getItem('messages'))
      lastMsgId = arrayFromLS[arrayFromLS.length-1].id;
    }
    
    
    const res = await axios.get(`http://localhost:3000/getmessage/${lastMsgId}`,{headers:{"Authorization":token}});

    //If any new msg received from database
    if(res.data.length!=0){

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
    }

    displayOnScreen();
})


// setInterval(async ()=>{   
// const res = await axios.get(`http://localhost:3000/getmessage`,{headers:{"Authorization":token}});
// },1000)


async function addMessage(e){
    e.preventDefault();
    try{
        const message = document.getElementById('msg').value;
        let obj = {
        msg :message
        };

        await axios.post(`http://localhost:3000/addmessage`, obj,{headers:{"Authorization":token}});
    }
    catch(err){
        console.log(err.response);
    }
} 



//display messages on screen
function displayOnScreen() {
    let data = JSON.parse(localStorage.getItem('messages'));

    data.forEach(obj=>{
        let exp =`<tr><td>${obj.name} : ${obj.msg}</td></tr>`
        display.innerHTML = display.innerHTML + exp;

    })
}