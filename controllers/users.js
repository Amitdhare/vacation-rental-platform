const User = require("../models/user");
const passport = require("passport");


module.exports.signup=(req, res) => {
    res.render("user/signup.ejs")
}

module.exports.renderSignupForm = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email, username
        })
        
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "welcome to wonderlust");
            res.redirect("/listings");
        })

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}


module.exports.login = (req, res) => {
    res.render("user/login.ejs")
}

module.exports.renderloginForm=async (req, res) => {
    req.flash("success", "welcome back to wonderlust!")
     const redirectUrl = res.locals.redirectUrl || "/listings";
     delete req.session.redirectUrl; // optional but recommended
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)

        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
}