const User = require("../models/users");
const Group = require("../models/groups");
const Chat = require("../models/chats");
const { Op } = require("sequelize");
const socket = require("../app");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.not]: req.user.id,
                },
            }
        });
        res.status(200).json({ success: "true", users, admin: req.user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: "false", err });
    }
}

exports.addGroup = async (req, res) => {
    try {
        const { groupName, selectedUsers, selectedAdmins } = req.body;
        const adminId = req.user.id;
        if (!adminId || !groupName) throw new Error("Invalid request!");
        const exist = await Group.findOne({
            where: {
                name: groupName,
            }
        })
        if (exist) return res.status(205).json({ message: "Group Name already exists choose other name" });

        const group = await Group.create({ name: groupName });

        await group.addUser(adminId);
        await group.addAdmin(adminId);

        console.log(selectedUsers);

        for (const userId of selectedUsers) {
            await group.addUser(parseInt(userId));
        }

        for (const adminId of selectedAdmins) {
            if (selectedUsers.includes(adminId)) await group.addAdmin(adminId);
        } 
        res.status(200).json({ success: "true", group: group });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: "false", err });
    }
}

exports.getgroups = async (req, res) => {
    try {
        const groups = await req.user.getGroups();
        res.status(200).json({ success: "true", groups });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: "false", err });
    }
}

exports.getGroupUsers = async (req, res) => {
    try {
        const group = await Group.findOne({ where: { name: req.header("Groupname") } })
        const groupusers = await group.getUsers();
        const groupadmins = await group.getAdmin();
        res.status(200).json({ success: "true", groupusers, groupadmins });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: "false", err })
    }
}

exports.exitGroup = async (req, res) => {
    try{
        const group = await findOne({name:req.params.groupName});
        const admin = await  group.hasAdmin(req.user);
        if(admin) {
           var result  =await  group.distroy()
        } else {
            var result = await group.removeUser(req.user);

        }
        res.status(200).json({message: result, success:"true"})
    }
    catch(err) {
        console.log(err);
        res.status(400).json({err,success:false});
    }
}