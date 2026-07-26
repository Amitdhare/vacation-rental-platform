const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users.js");



router.get("/signup", userController.signup)

router.post("/signup", wrapAsync(userController.renderSignupform));

router.get("/login", userController.login)

router.post("/login", saveRedirectUrl ,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.renderloginForm )

router.get("/logout", userController.logout)

module.exports = router;