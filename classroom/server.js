const express = require("express");
const session = require("express-session");
const  flash=require("connect-flash");
const app = express();
const path = require("path");


app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))

const sessionoptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: false, // better practice
};

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionoptions));
app.use(flash())

// Route to register a name using query parameter
app.get("/register", (req, res) => {
  let { name = "Anonymous" } = req.query;
  req.session.name = name;
   req.flash("success","file is rendered successfully")
//   res.send(`Name stored in session: ${req.session.name}`);
  res.redirect("/hello");
});

// Route to count how many times user visited
// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You requested this page ${req.session.count} times`);
// });

app.get("/hello",(req,res)=>{
// res.send(`hello ${req.session.name}`)
res.locals.messages=req.flash("success")

 res.render("page.ejs",{name:req.session.name})
})

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
