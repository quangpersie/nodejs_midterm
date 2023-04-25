const userRouter = require('./user');
const chatRouter = require('./chat');
const messageRouter = require('./message');

const route = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/message", messageRouter);
};

module.exports = route;