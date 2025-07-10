const express=require("express");
const app=express();
const router=express.Router();



//index posts
router.get("/",(req,res)=>{
    res.send("get for posts")
})


//show posts
router.get("/:id",(req,res)=>{
    res.send("get for show posts")
})


//post route
router.post("/",(req,res)=>{
    res.send("post for posts")
})


//delete route
router.delete("/:id",(req,res)=>{
    res.send("Delete for post id")
})

module.exports=router;