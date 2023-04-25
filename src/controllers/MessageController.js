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
            return {
                success: true,
                error: '',
                result: messages
            }
    } catch (error) {
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name avatar").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email avatar",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        return {
            success: true,
            error: '',
            result: message
        }
    } catch (error) {
        return {
            success: false,
            error: 'Interval timeout',
            result: []
        }
    }
};

module.exports = { allMessages, sendMessage };