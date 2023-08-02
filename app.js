const express = require("express");
const sequelize = require("./util/database");
const path = require("path");
const app = express();

const userRoute = require("./routes/users");

app.use(express.json());

app.use("/user", userRoute);

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