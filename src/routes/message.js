const express = require("express");
const messageControllers = require("../controllers/MessageController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(verifyToken, messageControllers.allMessages);
router.route("/").post(verifyToken, messageControllers.sendMessage);

module.exports = router;