const {Router} = require("express");
const { yogaSession } = require("../controllers/session.controllers.js");

const router = Router();
router.route('/booking').post(yogaSession)

module.exports = router;