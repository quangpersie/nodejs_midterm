const express = require("express");
const chatControllers = require("../controllers/ChatController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(verifyToken, chatControllers.accessChat);
router.route("/").get(verifyToken, chatControllers.fetchChats);
router.route("/group").post(verifyToken, chatControllers.createGroupChat);
router.route("/rename").put(verifyToken, chatControllers.renameGroup);
router.route("/groupremove").put(verifyToken, chatControllers.removeFromGroup);
router.route("/groupadd").put(verifyToken, chatControllers.addToGroup);

module.exports = router;
