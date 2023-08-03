const express = require("express");
const sequelize = require("./util/database");
const path = require("path");
const cors = require("cors");
const app = express();

const User = require("./models/users");
const Chat = require("./models/chats");

const userRoute = require("./routes/users");
const chatRoute = require("./routes/chats");

app.use(express.json());
app.use(cors({
    origin : "http://localhost:3000"
}))

app.use("/user", userRoute);
app.use("/chats", chatRoute);

User.hasMany(Chat);
Chat.belongsTo(User);

app.use((req,res,next) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

sequelize
.sync()
.then(() => {
    app.listen(process.env.PORT_NUMBER,console.log("app is listening"));
})
.catch(err => {
    console.log(err);
})