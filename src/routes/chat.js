const express = require("express");
const chatControllers = require("../controllers/ChatController");
const { verifyToken } = require("../middlewares/authenticate");

const router = express.Router();

router.post('/' ,verifyToken, chatControllers.accessOneToOne);
router.get('/', verifyToken, chatControllers.getAllChats);

module.exports = router;
