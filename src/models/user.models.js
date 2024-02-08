const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "fullname is required"],
            minlength: [5, "the minimum character should be 5"],
            maxlength: [20, "fullname should not exceed 20 characters"]
        },
        password: {
            type: String,
            required: true
          }, 
          email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true
          },
          confirmPassword: {
            type: String,
            required: true
          }
    },
    {
        timestamps: true
    }
    )
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10)
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
// accesss token for forget password
userSchema.methods.generateAuthAccessToken = async function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "5min"
        }
    )
}
const User = mongoose.model("User", userSchema);

    module.exports = User;