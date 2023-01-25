document.getElementById('send').addEventListener('click',addMessage);
const token = localStorage.getItem('token');

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