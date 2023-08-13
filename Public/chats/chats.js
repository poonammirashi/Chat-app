const socket = io.connect('http://localhost:3000');

socket.on("connect", () => {
    console.log(socket.id);
})

socket.on("user-created", data => {
    console.log(data.user, " created this group");
})
socket.on("recieve-message", data => {
    const groupName = localStorage.getItem("groupName");
    if (groupName === data.groupName) {
        appendMsg(data);
    }
})


const token = localStorage.getItem("token");
const showGrpCreateBtn = document.getElementById("select-users")
const groupMessages = document.getElementById('group-chats');
const groupUser = document.getElementById('group-users');

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const groups = {};
        const allGroups = await axios.get("http://localhost:3000/groups/get-groups", {
            headers: {
                "Authorization": token
            }
        });
        if (allGroups.data.groups) {
            for(const grp of allGroups.data.groups) {
                let arr = []
                const users = await getUsers(grp);
                users.forEach(user => {
                    arr.push(user)
                })
                groups[grp.name] = arr;
                localStorage.setItem("groups", JSON.stringify(groups));
                // console.log(groups);
            }
        }
        console.log(groups);
        
        for (const grp in groups) {
            showGroupsOnScreen(grp);
        }
    } catch (err) {
        console.log(err);
    }
})

async function getUsers(groupName) {
    try {
        console.log(groupName);
        const token = localStorage.getItem("token");
        const users = await axios.get("http://localhost:3000/groups/group-users",
            {
                headers: {
                    "Authorization": token,
                    "Groupname": groupName.name
                }
            });
        return users.data.groupusers;
    } catch (err) {
        console.log(err);
    }
}

async function showUsersToSelect() {
    try {
        const allusers = await axios.get("http://localhost:3000/groups/get-users", {
            headers: {
                "Authorization": token
            }
        });
        users = allusers.data.users;
        showGrpCreateBtn.innerHTML = `<input type="text" id="group-name" name="group-name" placeholder="Enter Group Name">
        <label>Select users for the group:</label>
        <span>for Windows click ctrl + click for selecting ,ultiple users</span>
        <br>
        <select id="user-select" multiple>
        </select>
        <br>
        <select id="admin-select" multiple>
        </select>
        <button onclick="createGroup()">Create</button>`
        const adminSelect = document.getElementById('admin-select');
        const userSelect = document.getElementById('user-select');
        users.forEach(user => {
            const optionElement = document.createElement("option");
            optionElement.value = `${user.id}`
            optionElement.text = user.name;
            userSelect.add(new Option(user.name, user.id));
            adminSelect.add(optionElement);
        })
    } catch (err) {
        console.log(err);
    }
}

async function createGroup() {
    const userSelect = document.getElementById('user-select');
    const adminSelect = document.getElementById('admin-select');
    const groupNameInput = document.getElementById("group-name");
    var groupName = groupNameInput.value.trim();
    const selectedUsers = Array.from(userSelect.options)
        .filter(option => option.selected)
        .map(option => option.value);

    const selectedAdmins = Array.from(adminSelect.options)
        .filter(option => option.selected)
        .map(option => {
            console.log(option.text)
            return option.value;
        });
    if (groupName !== '' && selectedUsers) {
        const groups = JSON.parse(localStorage.getItem("groups")) || null;
        if (!groups[groupName]) {
            console.log(groups);

            const grp = await axios.post("http://localhost:3000/groups/add-group", { groupName, selectedUsers, selectedAdmins },
                {
                    headers: {
                        "Authorization": token,
                    }
                })

            if (grp.status === 205) {
                console.log(grp.data.message)
            }
            socket.emit("group-created", parseJwt(token).username);

            showGrpCreateBtn.innerHTML = `<button onclick="showUsersToSelect()">Create New Group</button>`

        } else {
            alert("groupName Already exists");
        }
        showGroupsOnScreen(groupName);
    } else {
        window.alert("please give Group Name");
    }
}


function showGroupsOnScreen(groupName) {
    const groupList = document.getElementById("groups")
    const groupElement = document.createElement('li');
    groupElement.classList.add('group');
    groupElement.innerHTML = `${groupName}   <button id="delete" style.background-color="red" onclick="exitFromGroup(${groupName})">Exit<button`;
    groupElement.addEventListener('click', () => {
        switchGroup(groupName)
    });

    groupList.appendChild(groupElement);
}

async function exitFromGroup(groupName) {
    try {
        const exitGroup = await axios.delete(`http://localhost:3000/groups/delete/${groupName}`, {
            headers: {
                "Authorization": token
            }
        })
        console.log(exitGroup.data.message)
    }
    catch (err) {
        console.log(err);
    }
}

async function switchGroup(groupName) {
    console.log(groupName)
    localStorage.setItem("groupName", groupName);
    const groupMessages = document.getElementById("group-chats");
    const groupUser = document.getElementById("group-users");
    groupMessages.innerHTML = '';
    groupUser.innerHTML = '';
    const allmessages = await axios.get(`http://localhost:3000/chats/get-messages`,
        {
            headers: {
                "Authorization": token,
                "Groupname": localStorage.getItem("groupName")
            }
        });
    localStorage.setItem("messages", JSON.stringify(allmessages.data.messages))
    const groups = JSON.parse(localStorage.getItem("groups"));
    const messages = JSON.parse(localStorage.getItem("messages")) || null;
    console.log(messages)
    if (messages) {
        for (const message of messages) {
            // console.log(message.user.name)
            appendMsg(message);
        }
    }

    var grpUserElememt = document.createElement('p');
    for (const user of groups[groupName]) {
        grpUserElememt.append(`, ${user.name}`);
        console.log(grpUserElememt)
    }
    groupUser.appendChild(grpUserElememt);
}

const uploadbtn = document.getElementById('uploadbtn');
const file = document.getElementById('file');


async function uploadFiles(uploadedfile) {
    try {
        console.log(file, uploadedfile);
        const groupName = localStorage.getItem("groupName");
        const formData = new FormData();
        formData.append("file", uploadedfile);
        console.log("Here\n\n\n", formData.get("file"));
        if (uploadedfile !== "") {
            const message = await axios.post("http://localhost:3000/chats/add-file",
                formData,
                {
                    headers: {
                        "Authorization": token,
                        "Groupname": groupName,
                        "Content-Type": 'multipart/form-data'
                    }
                });
            console.log(message);
            socket.emit("send-image", message.data.message.image, groupName, parseJwt(token).username);

        }

    }
    catch (err) {
        console.log(err);
    }
}


async function addmessage(e) {
    try {
        e.preventDefault();
        const newmessage = document.getElementById("chatmessage").value;
        const token = localStorage.getItem("token");
        const groupName = localStorage.getItem("groupName");
        const uploadedfile = file.files[0];
        if (uploadedfile) {
            uploadFiles(uploadedfile);
        } else {
            var message = await axios.post("http://localhost:3000/chats/add-message", {
                message: newmessage,
                groupName,
            },
                {
                    headers: {
                        "Authorization": token,
                        "Groupname": groupName
                    }
                });

            socket.emit("send-message", newmessage, groupName, parseJwt(token).username);
            console.log(message);
            document.getElementById("chatmessage").value = "";
            document.getElementById("file").value = "";
        }


    } catch (err) {
        console.log(err);
    }
}

function appendMsg(msg) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (msg.image) {
        messageElement.innerHTML = `${msg.user.name}: <br><img src="${msg.image}" alt="image" height="100px" width="200px" >`
    } else {
        messageElement.textContent = `${msg.user.name}: ${msg.message}`;
    }
    groupMessages.appendChild(messageElement);
    const oldmessages = JSON.parse(localStorage.getItem("messages"));
    let labellist = document.getElementsByClassName("message");
    if (oldmessages.length > 10) {
        labellist[0].remove();
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

























































