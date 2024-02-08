// const { render } = require("../app.js");
// const User = require("../views/index.ejs");

const User = require("../models/user.models.js");
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        if ([fullName, email, password, confirmPassword].some((field) => field?.trim() === "")) {
            return res.status(400).json({
                status: false,
                message: "All fields are required"
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Password doesn't match"
            });
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "user already exists"
            });
        }
        const user = await User.create({
            fullName,
            email,
            password,
            confirmPassword
        });
        const createdUser = await User.findById(user._id).select("-password -confirmPassword")
        if (!createdUser) {
            return res.status(500).json({
                success: false,
                message: "Oops! something went wrong!"
            });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hennamaria2001@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'hennamaria2001@gmail.com',
            to: `${createdUser.email}`,
            subject: 'Welcome to A Great Fitness - Your Journey Begins Here!',
            text: `Dear ${createdUser.fullName},

        Namaste and welcome to A Great Fitness, your new sanctuary for yoga and wellness. We are thrilled to have you join our community of health enthusiasts, yogis, and individuals passionate about nurturing their body, mind, and spirit. At A Great Fitness, we believe in the transformative power of yoga and its ability to bring balance, strength, and serenity into our lives. Our mission is to support you on your journey to greater well-being through our comprehensive range of yoga classes, resources, and supportive community.
        
        What You Can Expect:
        
        --> Personalized Yoga Programs: Whether you're a beginner or an experienced yogi, we have programs tailored to your level and goals.
        
       --> Expert Guidance: Learn from our team of certified and experienced yoga instructors who are dedicated to your growth and well-being.
        
       --> Flexible Scheduling: Access our classes online from the comfort of your home or in-person at our serene studio, with schedules designed to fit your busy life.
        
       --> Community Support: Join a vibrant community of like-minded individuals who are on a similar path of personal growth and wellness. 
        
       --> Exclusive Member Benefits: As a valued member of A Great Fitness, you'll enjoy exclusive access to workshops, special events, and a variety of wellness resources.
        
        Get Started:
        
        Log in to Your Account: Use the credentials provided to log in to our website and access your member dashboard.
        Explore Our Classes: Browse our class schedule and book your first session. Your journey to a more balanced and healthy life starts now! Join Our Community: Connect with fellow members through our forums and social media groups to share experiences, tips, and encouragement. We're here to support you every step of the way. If you have any questions or need assistance, please don't hesitate to reach out to us at greatfitness@gmail.com.
        
        Thank you for choosing A Great Fitness. We can't wait to be a part of your wellness journey and see the incredible transformations you'll achieve.`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
        });
        return res.status(201).json({
            success: true,
            message: "user registered successfully",
            user: createdUser
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required"
            });
        }
        const user = await User.findOne({ email })
        // console.log(user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }
        const correctPassword = await user.isPasswordCorrect(password);
        console.log(correctPassword);
        if (!correctPassword) {
            return res.status(401).json({
                success: false,
                message: "invalid user credentials"
            });
        }
        const accessToken = await user.generateAccessToken();
        const loggedUser = await User.findById(user._id).select("-password -confirmPassword");
        // console.log(`accessToken ---> ${accessToken}`);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200).cookie("accessToken", accessToken, options).json({
            success: true,
            isAuthenticated: true,
            user: loggedUser,
            message: "Logged in succcessfully!",
            accessToken
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

// const forgetPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         if (email === "") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email is required"
//             });
//         }
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "user not found"
//             });
//         }
//         const accessToken = await user.generateAuthAccessToken();
//         console.log(accessToken);
//         const link = `http://localhost:1573/reset-password/${user._id}`;
//         console.log(link);
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'hennamaria2001@gmail.com',
//                 pass: 'jevb bajh sbko jcyq'
//             }
//         });

//         const mailOptions = {
//             from: 'hennamaria2001@gmail.com',
//             to: `${user.email}`,
//             subject: 'Reset your password',
//             text: `Dear ${user.fullName},

// We've received a request to reset the password for your account. To proceed with the password reset process, please click on the link below :
//             \n${link}

// If you did not initiate this request or believe it was sent in error, you can safely ignore this email. Your account security is important to us, and no action will be taken unless you confirm it by clicking the link above. 

// Please note that this link is only valid for a limited time. If you don't reset your password within 5 mintues, you'll need to request another reset link.

// If you encounter any issues or need further assistance, please don't hesitate to contact our support team at fake2001@gmail.com.
            
// Thank you for using our service.`
//         };

//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 const options = {
//                     httpOnly: true,
//                     secure: true
//                 }
//                 return res.status(200).cookie("accessToken", accessToken, options).json({
//                     success: true,
//                     message: "Check your email for reset password link",
//                     accessToken,
//                     link
//                 });
//             }
//         });

//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: error.message
//         })
//     }
// }




module.exports = {
    registerUser,
    userLogin,
}