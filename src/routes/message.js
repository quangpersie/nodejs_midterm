const express = require("express");
const messageControllers = require("../controllers/MessageController");
const { verifyToken } = require("../middlewares/authenticate");

const router = express.Router();

router.get('/:chatId', verifyToken, messageControllers.allMessages);
router.post('/', verifyToken, messageControllers.sendMessage);

module.exports = router;