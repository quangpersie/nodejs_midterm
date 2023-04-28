const User = require("../models/User");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

// function to search other users (except current user)
const searchOtherUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).lean();
    
    if(users) {
        return res.json({
            success: true,
            error: '',
            result: users
        })
    } else {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

// function to create new user with name, email, password, avatar (nullable)
const registerUser = async (req, res) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            error: 'Missing param',
            result: []
        })
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.json({
            success: false,
            error: 'User already exist',
            result: []
        })
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar,
    });

    if (user) {
        let u = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            token: generateToken(user._id),
        };
        return res.json({
            success: true,
            error: '',
            result: u
        })
    } else {
        return res.json({
            success: false,
            error: 'User not found',
            result: []
        })
    }
};

// function to login with input email, password
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            error: 'Missing param',
            result: []
        })
    }

    const user = await User.findOne({ email }).lean();

    if (user && (await bcrypt.compare(password, user.password))) {
        let u = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            token: generateToken(user._id),
        };
        return res.json({
            success: true,
            error: '',
            result: u
        })
    } else {
        return res.json({
            success: false,
            error: 'Wrong email or password',
            result: []
        })
    }
};

module.exports = { searchOtherUsers, registerUser, loginUser };