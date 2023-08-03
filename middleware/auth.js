const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.authenticate = async (req,res,next) => {
    try{
        const token = req.header("Authorization");
        const userObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!userObj) {
            throw new Error("null")
        }
        // console.log(token, "userid >>>>", userObj.id);
        const user = await User.findByPk(userObj.id);
        req.user = user;
        // console.log(user);
        next();
    }
    catch(err) {
        console.log(err);
        res.status(500).json();
    }
}
