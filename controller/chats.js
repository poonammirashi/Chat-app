const Chats = require("../models/chats");
const Group = require("../models/groups");
const User = require("../models/users");
const { Op } = require("sequelize");
const s3Service = require("../services/s3-serveces");
const userService = require("../services/user-service");

exports.uploadImageFile = async (req, res) => {
    try {
        const file = req.file;
        console.log(file);
        if (file) {
            const groupName = req.header("Groupname")
            const grp = await Group.findOne({ where: { name: groupName } })
            const fileUrl = await s3Service.uploadFile(file);
            console.log(fileUrl);
            const message = await req.user.createChat({ image: fileUrl, GroupId: grp.id })
            res.status(200).json({ message, success: true });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ err, success: false });
    }

}

exports.addmessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (userService.isvalid(message)) {
            return res.status(500).json({ success: false, message: "invalid inputs" })
        }

        const grp = await Group.findOne({
            where: {
                name: req.header("Groupname")
            }
        });
        const msg = await req.user.createChat({ message, GroupId: grp.id });
        res.status(200).json({ success: "success", message: msg });

    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

exports.getmessages = async (req, res, next) => {
    try {
        const grp = await Group.findOne({
            where: {
                name: req.header("Groupname")
            }
        });
        const chatCount = await Chats.count();
        const messages = await Chats.findAll({
            where: {
                GroupId: grp.id,
                id: {
                    [Op.gt]: chatCount - 10,
                },
            },
            //   raw: true,
            attributes: ["message", "id", "image", "createdAt"],
            include: [
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
        })
        res.status(200).json({ success: "true", messages });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: "false", err })
    }
}


