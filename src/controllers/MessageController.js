const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email avatar")
            .populate("chat")
            .lean();
            return res.json({
                success: true,
                error: '',
                result: messages
            })
    } catch (error) {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.json({
            success: false,
            error: 'Missing param',
            result: []
        })
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email avatar",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        return res.json({
            success: true,
            error: '',
            result: message
        })
    } catch (error) {
        return res.json({
            success: false,
            error: 'Interval timeout',
            result: []
        })
    }
};

module.exports = { allMessages, sendMessage };