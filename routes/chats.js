const chatController = require("../controller/chats");
const userAuthenticate = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/add-message", userAuthenticate.authenticate , chatController.addmessage);

router.get("/get-messages/:id" , userAuthenticate.authenticate, chatController.getmessages);

module.exports = router ;