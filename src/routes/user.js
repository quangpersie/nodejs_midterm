const express = require("express");
const userControllers = require("../controllers/UserController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(verifyToken, userControllers.searchOtherUsers);
router.route("/").post(userControllers.registerUser);
router.post("/login", userControllers.loginUser);

module.exports = router;