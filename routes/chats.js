const chatController = require("../controller/chats");
const userAuthenticate = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
 // This stores the file in memory, change as needed
const upload = multer({ storage: storage });
router.post("/add-message", userAuthenticate.authenticate , chatController.addmessage);

router.post("/add-file", upload.single('file'), userAuthenticate.authenticate, chatController.uploadImageFile);

router.get("/get-messages/" , userAuthenticate.authenticate, chatController.getmessages);



module.exports = router ;