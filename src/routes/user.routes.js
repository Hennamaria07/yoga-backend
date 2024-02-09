const {Router} = require("express");
const { registerUser, userLogin } = require("../controllers/user.controllers.js");
// const verifyToken = require("../middleware/auth.middleware.js");

const router = Router();
router.route('/sign-up').post(registerUser);
router.route('/login').post(userLogin);

module.exports = router;