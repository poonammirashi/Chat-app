document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token");
        const messages = await axios.get("http://localhost:3000/chats/get-message", { headers: { "Authorization": token }});
        console.log(messages);
        messages.data.messages.forEach(msg => {
            showMessageOnScreen(msg);
        })
    } catch (err) {
        console.log(err);
    }
})

async function addmessage() {
    try {
        const newmessage = document.getElementById("chatmessage").value;
        const token = localStorage.getItem("token");
        const message = await axios.post("http://localhost:3000/chats/add-message", { message: newmessage }, { headers: { "Authorization": token } });
        console.log(message);
        showMessageOnScreen(message.data.message);
    } catch (err) {
        console.log(err);
    }
}

async function showMessageOnScreen(message) {
    const label = document.createElement("label");
    const container = document.getElementById("container");
    label.innerText = `${message.userId}: ${message.message}`;
    container.appendChild(label);
}