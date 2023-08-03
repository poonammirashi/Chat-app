async function addmessage() {
    try {
        const newmessage = document.getElementById("chatmessage").value;
        const token = localStorage.getItem("token");
        const message = await axios.post("http://localhost:3000/chats/add-message", { message: newmessage }, { headers: { "Authorization": token } })
        console.log(message);
        showMessageOnScreen(newmessage);
    } catch (err) {
        console.log(err);
    }
}

async function showMessageOnScreen(message) {
    const label = document.createElement("label");
    const container = document.getElementById("container");
    label.innerText = `you: ${message}`;
    label.style.backgroundColor = "grey";
    label.style.float = "right";
    label.style.margin = "2%"
    container.appendChild(label);
}