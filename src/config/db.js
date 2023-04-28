const mongoose = require('mongoose');

async function connectMongo() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/chatApp');
        console.log('Connect DB success !');
    } catch (error) {
        console.log('Connect error: ', error);
    }
}

module.exports = { connectMongo };