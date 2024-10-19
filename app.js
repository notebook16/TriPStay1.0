if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express");
const app  = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


//requiring routes
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


//databse block


    //setting up database

        const   MONGO_URL = process.env.ATLASDB_URL;

        //calling main function of db
        main().then(() => {
            console.log("connected to DB");
        }).catch((err) => {
            console.log(err);
        });

        async function main() {
            await mongoose.connect(MONGO_URL);
        }


    //finished setting databaseSq


    

//database blocks end


//setting middelewares for ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true})) //for form 
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))



//session and flash block


    const store = MongoStore.create({
        mongoUrl: MONGO_URL,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,               //no need to login again and again 
    });


    store.on("error", () =>{
        console.log("error in MONGO SESSION Store" , err)
    })

    const sessionOptions = {
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized : true,
        cookie:{
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //one week
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };


    
    // app.get("/", (req,res) => {
    //     res.send("i am groot");
    // })


  

    app.use(session(sessionOptions));
    app.use(flash());


//session and flash block ends    


//passport authentication setup mw

    app.use(passport.initialize());
    app.use(passport.session()); //humesa login rahoge on different pages but in same session
    passport.use(new LocalStrategy(User.authenticate()));


    // use static serialize and deserialize of model for passport session support
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


//passport authentication setup ENDS  



//FLASH variables and to define res.locals variable that will live throughout the session and will keep changing of request is changed
//here is the flow for this flash
//1-> A post request us send on "/listing" to add a new listing
//2-> in "req" variable there will a info about the user 
//3-> and in the request we will also add flash in "req" bu using "req.flash"
//4-> we know that MW works between request and response hence here request comes , information about user and flash are in "req"
//5-> in below MW we store that info in our "res.locals.success" variable where "succeses,eror,currUser" are the user define varibale
//6-> and then on response or redirecting the response information will be displayed on the page 

//Note:> thew locals are avilable in response so we can access it through the ejs templating

app.use((req,res,next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user; //informatin related to current user session "jis bhi user ka session chal rha hai"
        next();
    })

//ENDS







//ROUTES

    // //route for testing our database
    // app.get("/testListing"  , async (req,res) =>{
    //     let sampleListing = new Listing({
    //         title: "My new villa",
    //         description : "bt the villa",
    //         price: 1200,
    //         location: "calangute, Goa",
    //         country: "India",
    //     })

    //     await sampleListing.save();
    //     console.log("sample was saved");
    //     res.send("succesul testing");
    // });







    //listings API's
    app.use("/listings", listingsRouter);
    app.use("/listings/:id/reviews", reviewsRouter);
    app.use("/", userRouter);

//ENDS




//error handeling



    //for wrong route
    app.all("*", (req,res,next) => {
        next(new ExpressError(404,"page not Found"));
    })

    //for any error occured above
    app.use((err, req ,res,next) => {
        let {statusCode = 500,message="something went wrong"} = err;

        //res.status(statusCode).send(message);
        res.status(statusCode).render("error.ejs",{message});
    })

//ENDS


app.listen(8080, () => {
    console.log("server is listening on 8080")
})
