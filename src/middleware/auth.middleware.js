const User = require("../models/user.models.js");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthenicated request",
                isAuthenticated: false
            });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken);
        const user = await User.findById(decodedToken?.id).select("-password -confirmPassword");
        if(!user){
            return res.status(401).json({
                success: false,
                message:"invalid Access Token",
                isAuthenticated: false
            })
        }
        req.user = user;
        return res.status(401).json({
            success: true,
            user,
            message:"Authenticated successfully",
            isAuthenticated: true
        })
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message:error.message,
            isAuthenticated: false
        })
    }
}

module.exports = verifyToken;