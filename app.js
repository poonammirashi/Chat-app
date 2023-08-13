const express = require("express");
const sequelize = require("./util/database");
const path = require("path");
const cors = require("cors");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
// const chatController = require("./controller/chats");


io.on('connection', socket => {
  console.log("sockect is connected")
  socket.on("send-message", (message, groupName,user) => {
    const data={message, groupName,user:{name:user}}
        io.emit("recieve-message", data )
  })

  socket.on("send-image", (image, groupName,user) => {
    const data={image, groupName,user:{name:user}}
    console.log(data);
    io.emit("recieve-message", data )
  })

  // socket.on("group-created", user => {
  //   const data = {user}
  //   io.broadcast.emit("user-created",data);
  // })
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

})
const User = require("./models/users");
const Chat = require("./models/chats");
const Group = require("./models/groups");

const userRoute = require("./routes/users");
const chatRoute = require("./routes/chats");
const groupRoute = require("./routes/groups");

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}))

app.use("/user", userRoute);
app.use("/chats", chatRoute);
app.use("/groups", groupRoute);

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, { through: "UserGroup", onDelete: "CASCADE" });
Group.belongsToMany(User, { through: "UserGroup", onDelete: "CASCADE" });

Group.belongsToMany(User, {
  as: "admin",
  through: "GroupAdmin",
  onDelete: "CASCADE",
});




Chat.belongsTo(Group,{onDelete: "CASCADE"});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
})

sequelize
  .sync()
  // .sync({alter: true})
  .then(() => {
    server.listen(process.env.PORT_NUMBER, console.log("app is listening"));
  })
  .catch(err => {
    console.log(err);
  })