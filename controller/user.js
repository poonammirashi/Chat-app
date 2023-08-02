const User = require("../model/user");
const userservice = require("../service/user-service");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res, next) => {
    try {
        const { name, email, phonenumber, password } = req.body;
        if (userservice.isvalid(name) || userservice.isvalid(email) || userservice.isvalid(phonenumber) || userservice.isvalid(password)) {
            res.status(501).json({ message: "invalid inputs" });
        }
        const exUser = await User.findOne({ where: { email: email } });
        if (exUser) {
            return res.status(504).json({ message: "user already is there" });
        }
        await bcrypt.hash(password, 10, async (err, hash) => {
            const user = await User.create({ name, email, phonenumber, password: hash })
            res.status(200).json({ message: "successfully created new user" });
        })

    } catch (err) {
        console.log(err);
        res.status(501).json({ message: "success" });
    }
}
