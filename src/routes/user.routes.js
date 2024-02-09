const {Router} = require("express");
const { registerUser, userLogin, yogaSession } = require("../controllers/user.controllers.js");
// const verifyToken = require("../middleware/auth.middleware.js");

const router = Router();
router.route('/sign-up').post(registerUser);
router.route('/login').post(userLogin);
// router.route('/forget-password').post(forgetPassword);

// protected routers
// router.route('/booking').post(yogaSession);
module.exports = router;