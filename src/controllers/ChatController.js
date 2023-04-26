const User = require("../models/User");
const Chat = require("../models/Chat");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessOneToOne = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.json({
            success: false,
            error: 'Missing userId param',
            result: []
        })
    }

    let chatObj = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    chatObj = await User.populate(chatObj, {
        path: "latestMessage.sender",
        select: "name email avatar",
    });

    // case: 2 user have already accessed before
    if (chatObj.length > 0) {
        return res.json({
            success: true,
            error: '',
            result: chatObj[0]
        })
    }
    // case: 2 user have not already accessed before
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const newChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: newChat._id })
                .populate("users", "-password")
                .lean();
            return res.json({
                success: true,
                error: '',
                result: fullChat
            })
        } catch (error) {
            return res.json({
                success: false,
                error: 'Interval timeout',
                result: []
            })
        }
    }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const getAllChats = async (req, res) => {
    try {
        let response = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
        response = await User.populate(response, {
            path: "latestMessage.sender",
            select: "name email avatar",
        });
        
        return res.json({
            success: true,
            error: '',
            result: response
        })
    } catch (error) {
        
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

// GROUP

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.json({
            success: false,
            error: 'Please Fill all the fields',
            result: []
        })
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.json({
            success: false,
            error: 'Please Fill all the fields',
            result: []
        })
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .lean();

        return res.json({
            success: true,
            error: '',
            result: fullGroupChat
        })
    } catch (error) {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroupChat = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .lean();

    if (!updatedChat) {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    } else {
        return res.json({
            success: true,
            error: '',
            result: updatedChat
        })
    }
};

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeMemberFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .lean();

    if (removed) {
        return res.json({
            success: true,
            error: '',
            result: removed
        })
    } else {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addMemberToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .lean();

    if (added) {
        return res.json({
            success: true,
            error: '',
            result: added
        })
    } else {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

module.exports = {
    accessOneToOne,
    getAllChats,
    createGroupChat,
    renameGroupChat,
    addMemberToGroup,
    removeMemberFromGroup,
};