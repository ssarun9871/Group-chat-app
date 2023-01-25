document.getElementById('send').addEventListener('click',addMessage);
const display = document.getElementById('display');
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async ()=>{
   const res = await axios.get(`http://localhost:3000/getmessage`,{headers:{"Authorization":token}});
   
   res.data.forEach(element => {
    displayOnExpense(element.name,element.msg)
   });
   
})


setInterval(async ()=>{   
const res = await axios.get(`http://localhost:3000/getmessage`,{headers:{"Authorization":token}});
},1000)

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

//display all messages on screen
function displayOnExpense(name,msg) {
    let exp =`<tr><td>${name} : ${msg}</td></tr>`
    display.innerHTML = display.innerHTML + exp;
}