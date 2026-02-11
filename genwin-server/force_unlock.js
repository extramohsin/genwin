const mongoose = require('mongoose');
const Match = require('./models/Match');
const User = require('./models/User');
require('dotenv').config();

async function forceUnlock() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const user = await User.findOne({ username: 'alice' });
        if (!user) {
            console.log("User Alice not found.");
            process.exit(1);
        }

        const result = await Match.findOneAndUpdate(
            { userId: user._id },
            { revealDate: new Date(Date.now() - 86400000) }, // Yesterday
            { new: true }
        );

        if (result) {
            console.log(`Updated revealDate for Alice: ${result.revealDate}`);
        } else {
            console.log("No match entry found for Alice.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

forceUnlock();
