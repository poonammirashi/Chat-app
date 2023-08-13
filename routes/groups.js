const groupController = require("../controller/groups")
const userAuthenticate = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/get-users",userAuthenticate.authenticate, groupController.getAllUsers);

router.get("/get-groups", userAuthenticate.authenticate, groupController.getgroups);

router.get("/group-users", userAuthenticate.authenticate, groupController.getGroupUsers);

router.post("/add-group", userAuthenticate.authenticate, groupController.addGroup);

router.delete("/delete/:groupName", userAuthenticate.authenticate, groupController.exitGroup)

module.exports = router ;