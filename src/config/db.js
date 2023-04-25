const mongoose = require('mongoose');

// function connet to mongoDB
async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connect db success !');
    } catch (error) {
        console.log('Connect error: ', error);
    }
}

module.exports = { connect };