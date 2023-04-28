require("dotenv").config();
const express = require("express");
const { connectMongo } = require("./config/db");
const route = require('../src/routes')
const app = express();
const cors = require('cors')
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: "http://localhost:3000"
}))

app.get("/", (req, res) => {
    res.send("API is running...");
});
route(app)

// error handle
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message
    });
});

connectMongo().then(e => {
    const server = app.listen(
        PORT,
        console.log(`Server running on PORT ${PORT}...`)
    );

    const io = require("socket.io")(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:3000"
        },
    });

    io.on("connection", (socket) => {
        console.log("Connected to socket.io");
        socket.on("setup", (dataUser) => {
            socket.join(dataUser._id);
            socket.emit("connected");
        });

        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User joined room: " + room);
        });
        
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("new message", (newMsgReceived) => {
            let users = newMsgReceived.chat.users
            if (!users) return console.log("Users in chat have not defined");

            users.forEach((user) => {
                if (user._id == newMsgReceived.sender._id) return;
                socket.in(user._id).emit("received message", newMsgReceived);
            });
        });

        socket.off("setup", (dataUser) => {
            console.log("USER DISCONNECTED");
            socket.leave(dataUser._id);
        });
    });
})