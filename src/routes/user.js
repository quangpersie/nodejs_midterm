const express = require("express");
const userControllers = require("../controllers/UserController");
const { verifyToken } = require("../middlewares/authenticate");

const router = express.Router();

router.get('/', verifyToken, userControllers.searchOtherUsers);
router.post('/', userControllers.registerUser);
router.post('/login', userControllers.loginUser);

module.exports = router;