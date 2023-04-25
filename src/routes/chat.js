const express = require("express");
const chatControllers = require("../controllers/ChatController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(verifyToken, chatControllers.accessChat);
router.route("/").get(verifyToken, chatControllers.getAllChats);
router.route("/group").post(verifyToken, chatControllers.createGroupChat);
router.route("/rename").put(verifyToken, chatControllers.renameGroup);
router.route("/add-group").put(verifyToken, chatControllers.addMemberToGroup);
router.route("/remove-group").put(verifyToken, chatControllers.removeMemberFromGroup);

module.exports = router;
