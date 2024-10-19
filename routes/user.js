const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const { saveRedirectUrl} = require("../middleware.js");


const userController = require("../controllers/users.js")


//render signup
router.get("/signup" ,
    userController.renderSignUpForm
 )

//perform signup
router.post("/signup" , wrapAsync(userController.signUp)
);


//render login
router.get("/login", userController.renderLogInForm)


//perform login
router.post("/login" ,

    saveRedirectUrl, //now it will call the export and boom we will have our redirect url in locals even on starting of new session
    passport.authenticate("local", {
        failureRedirect: '/login', 
        failureFlash: true
    }),
     
    userController.login
);
  


//logout
router.get("/logout" , userController.logout)

module.exports = router;