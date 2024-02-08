const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
    origin: "https://great-fitness-yoga-studio.netlify.app",
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// import of routes
const userRouter = require("./routes/user.routes.js");

// routes defination
app.use("/api/v1/user", userRouter)
module.exports = app;