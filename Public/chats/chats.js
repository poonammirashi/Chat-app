document.addEventListener("DOMContentLoaded", async () => {
    try {
        // const token = localStorage.getItem("token");
        // const messages = await axios.get("http://localhost:3000/chats/get-message", { headers: { "Authorization": token }});
        // console.log(messages);
        const oldmessages = [];
        const array = localStorage.getItem("messages") || null;
        const messages= JSON.parse(array);
        if(messages){
            messages.forEach(msg => {
                showMessageOnScreen(msg);
            })  
        } else {
            localStorage.setItem("messages", JSON.stringify(oldmessages));
        }
    } catch (err) {
        console.log(err);
    }
})

async function addmessage(e) {
    try {
        e.preventDefault();
        const newmessage = document.getElementById("chatmessage").value;
        const token = localStorage.getItem("token");
        let oldmessages = JSON.parse(localStorage.getItem("messages"));
        const message = await axios.post("http://localhost:3000/chats/add-message", { message: newmessage }, { headers: { "Authorization": token } });
        console.log(message);
        const lastmessage = oldmessages[oldmessages.length-1];
        let id = 0 ;
        if(lastmessage && lastmessage.id >= 1) {
            id = lastmessage.id ;
        }
        console.log(lastmessage,id);
        const newmessages = await axios.get(`http://localhost:3000/chats/get-messages/${id}`, { headers: { "Authorization": token }});
        const totalmessages = oldmessages.length + newmessages.data.messages.length ;
        // console.log("oldmessages",oldmessages.length,newmessages.data.messages.length,"n", totalmessages);
        if(totalmessages > 10) {
            const n = totalmessages - 10 ;
            for(let i=0;i<n;i++) {
                oldmessages.shift();
            }
        }
        oldmessages= oldmessages.concat(newmessages.data.messages);
        console.log(oldmessages,newmessages.data.messages);
        localStorage.setItem("messages", JSON.stringify(oldmessages));
        newmessages.data.messages.forEach(msg => {
                    showMessageOnScreen(msg);
        })
    } catch (err) {
        console.log(err);
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function showMessageOnScreen(message) {
    const token = localStorage.getItem("token");
    tokenvalue= parseJwt(token);
    const label = document.createElement("label");
    const container = document.getElementById("container");
    label.innerText = `${tokenvalue.username}: ${message.message}`;
    container.appendChild(label);
}