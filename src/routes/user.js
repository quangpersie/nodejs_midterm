const express = require("express");
const userControllers = require("../controllers/userControllers");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(verifyToken, userControllers.allUsers);
router.route("/").post(userControllers.registerUser);
router.post("/login", userControllers.authUser);

module.exports = router;