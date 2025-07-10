require('dotenv').config();
// console.log(process.env.SECRET) // remove this after you've confirmed it is working
const express = require('express');
const app= express();
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const path= require("path")
const methodOverride = require('method-override');
 const wrapAsync=require("./utills/wrapAsync.js")
const ExpressError=require("./utills/ExpressError.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const ejsMate= require("ejs-mate");
 const { listingSchema, reviewSchema } = require('./schema');
 const Review=require("./models/reviews.js");
 const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User= require("./models/user.js")


// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{console.log("connected")})
.catch((err)=>{console.log(err)})

async function main(){
    await mongoose.connect(dbUrl);
}
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))


app.use(express.static(path.join(__dirname,"/public")));
const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("Error in mongo sesion store",err);
})

const sessionoptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        maxAge:7*24 *60*60*1000,
        httpOnly:true
    }
}

// app.get("/", (req,res)=>{
//     res.send("hi i am root")
// })


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.curruser=req.user;
next();
})

// app.get("/demouser", async(req,res)=>{
// let fakeUser= new User({
//     email:"rc8200469@gmail.com",
//     username:"delta-stidents",
// })
// let registeredUser=await User.register(fakeUser,"rahul");
// res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter);







// app.get("/testlisting",async(req,res)=>{
//     let samplelisting=new Listing({
//         title:"my home",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,goa",
//         country:"India"
//     })
//     await samplelisting.save();
//     console.log("response was saved");
//     res.send("successfull testing")


// Catch-all 404 for undefined routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Error handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})