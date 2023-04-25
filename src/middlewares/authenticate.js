const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.json({
        success: false,
        error: 'Not authorized, token failed',
        result: []
      })
    }
  }

  if (!token) {
    return res.json({
      success: false,
      error: 'Not authorized, no token',
      result: []
    })
  }
};

module.exports = { verifyToken };