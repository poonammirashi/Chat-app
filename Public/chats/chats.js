async function addmessage() {
    const input = document.getElementById("chatmessage").value ;
    const label = document.createElement("label");
    // label.id = user.id ; 
    label.innerText = `you: ${input}`;
    document.body.appendChild(label)
}