const express=require("express");
const app=express();
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("hi i am root")
})
//index users
router.get("/users",(req,res)=>{
    res.send("get for users")
})
//show user
router.get("/users/:id",(req,res)=>{
    res.send("get for show users")
})

//post route
router.post("/users",(req,res)=>{
    res.send("post for users")
})
//delete route
router.delete("/users/:id",(req,res)=>{
    res.send("Delete for user id")
})

module.exports=router;