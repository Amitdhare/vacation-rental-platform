const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get( userController.signup)
    .post( wrapAsync(userController.renderSignupForm));


router
    .route("/login")
    .get( userController.login)
    .post(saveRedirectUrl ,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.renderloginForm )


router.get("/logout", userController.logout)

module.exports = router;