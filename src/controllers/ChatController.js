const User = require("../models/User");
const Chat = require("../models/Chat");

// function to create chat between current user and a user with input userId
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

// function to get all chats of current user
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

module.exports = {
    accessOneToOne,
    getAllChats,
};