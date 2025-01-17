const User = require("../models/user.js")


module.exports.renderSignUpForm = (req,res) => {
    res.render("users/signup.ejs");
}


module.exports.signUp = async(req,res) =>{

    try{
     let {username ,email, password} = req.body;
 
     const newUser = new User({
         email,
         username
     });
 
     let redu = await User.register(newUser,password)
     console.log(redu)
 
     //automatically login by the passport methid "login()"
     req.login(redu , (err) =>{
         if(err)
         {
             return next(err);
         }
 
         req.flash("success" , "welcome to TripStay");
         res.redirect("/listings")
     });
 
    
    } catch (e) {
 
         req.flash("error", e.message);
         res.redirect("/signup")
 
    }
 
 }



 module.exports.renderLogInForm = (req,res) => {
    res.render("users/login.ejs")
}

module.exports.login = async(req,res) => {



    req.flash("success","you loged in");
    let  redirectUrl =  res.locals.redirectUrl || "/listings"; //we are using locals instead of session because session will delete the old session info on intializing new session, here new session is login
    res.redirect(redirectUrl)

}


module.exports.logout = (req,res,next) =>{
    req.logout((err) =>{
        if(err)
        {
            return next(err);
        }

        req.flash("success", "you are logout");
        res.redirect("/listings")
    })
}