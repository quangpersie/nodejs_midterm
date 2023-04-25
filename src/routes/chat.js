const express = require("express");
const chatControllers = require("../controllers/ChatController");
const { verifyToken } = require("../middlewares/authenticate");

const router = express.Router();

router.post('/' ,verifyToken, chatControllers.accessChat);
router.get('/', verifyToken, chatControllers.getAllChats);

router.post('/group', verifyToken, chatControllers.createGroupChat);
router.put('/rename', verifyToken, chatControllers.renameGroup);

router.put('/add-group', verifyToken, chatControllers.addMemberToGroup);
router.put('/remove-group', verifyToken, chatControllers.removeMemberFromGroup);

module.exports = router;
