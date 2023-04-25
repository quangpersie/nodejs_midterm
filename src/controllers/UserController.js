const User = require("../models/User");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).lean();
    return {
        success: true,
        error: '',
        result: users
    }
};

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = async (req, res) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
        return {
            success: false,
            error: 'Missing param',
            result: []
        }
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return {
            success: false,
            error: 'User already exist',
            result: []
        }
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
        return {
            success: true,
            error: '',
            result: u
        }
    } else {
        return {
            success: false,
            error: 'User not found',
            result: []
        }
    }
};

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        let u = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            avatar: user.avatar,
            token: generateToken(user._id),
        };
        return {
            success: true,
            error: '',
            result: u
        }
    } else {
        return {
            success: false,
            error: 'Wrong email or password',
            result: []
        }
    }
};

module.exports = { allUsers, registerUser, authUser };