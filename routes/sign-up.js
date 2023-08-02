const userController = require("../controller/user");
const express = require("express");
const router = express.Router();

router.post("user/sign-up", userController.addUser);

module.exports = router ;