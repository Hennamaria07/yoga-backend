const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        phone: {
            type: Number,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        participant: {
            type: Number,
            required: true,
        }
        },
        {
            timestamps: true
        }
        
)

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;