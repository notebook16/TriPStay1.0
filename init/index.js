//we are intializing our sample data here

const mongoose = require("mongoose");
const initData = require("./data.js");
//requiring our lising model as module
const Listing = require("../models/listing.js")

//databse block


    //setting up database
 
        //calling main function of db
        main().then(() => {
            console.log("connected to DB");
        }).catch((err) => {
            console.log(err);
        })

        async function main() {
            await mongoose.connect("mongodb://127.0.0.1:27017/TriPStay");
        }


    //finished setting databaseS


    

//database blocks end

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => 
    ({...obj,owner: "670b98f27dbed7afda2c0cdb"}))
   
    let result = await Listing.insertMany(initData.data);
    console.log(result)

}

initDB();