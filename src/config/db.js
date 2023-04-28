const mongoose = require('mongoose');

async function connectMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connect DB success !');
    } catch (error) {
        console.log('Connect error: ', error);
    }
}

module.exports = { connectMongo };