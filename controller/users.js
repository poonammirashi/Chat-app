const User = require("../models/users");
const userservice = require("../services/user-service");
const bcrypt = require("bcrypt");
const bodyparser = require("body-parser");


exports.addUser = async (req, res, next) => {
    try {
        const { name, email, phonenumber, password } = req.body;
        if (userservice.isvalid(name) || userservice.isvalid(email) || userservice.isvalid(parseInt(phonenumber)) || userservice.isvalid(password)) {
           return res.status(501).json({ message: "invalid inputs" });
        }
        const exUser = await User.findOne({ where: { email: email } });
        if (exUser) {
            return res.status(500).json({ message: "user already exist" });
        }
        await bcrypt.hash(password, 10, async (err, hash) => {
            const user = await User.create({ name, email, phonenumber, password: hash })
            res.status(200).json({ message: "successfully created new user" });
        })

    } catch (err) {
        console.log(err);
        res.status(501).json({ message: err, success: "false" });
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (userservice.isvalid(email) || userservice.isvalid(password)) {
            return res.status(501).json({ message: "invalid inputs" });
        }
        const user = await User.findOne({where: { email: email } });
        if (user) {
            await bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    throw new Error(err);
                }
                if (result === true) {
                    const token = userservice.generatewebtoken(user.name,user.id)
                    console.log(token);
                    return res.status(200).json({ message: "user logged in successfully" , token });
                } else {
                    return res.status(401).json({ message: "user is unathorised"});
                }
            })
        } else {
            return res.status(404).json({ message: "user not found" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err, suceess: "false" })
    }
}

