const Session = require("../models/session.models");

const yogaSession = async (req, res) => {

    try {
        const {phone, date, time, category, experience, participant} = req.body;
        console.log(req.body);
        if ([phone, date, time, category, experience, participant].some((field) => field?.trim() === "")) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }
        const session = await Session.create({
            phone,
            date,
            time,
            category,
            experience,
            participant
        })
        return res.status(201).json({
            success: true,
            message: "Yoga session is booked Successfully!",
            session
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    yogaSession
}