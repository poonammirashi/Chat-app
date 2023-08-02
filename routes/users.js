const userController = require("../controller/users");
const express = require("express");
const router = express.Router();

router.post("/sign-up", userController.addUser);

router.post("/login", userController.getUser);

module.exports = router ;