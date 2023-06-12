const express = require("express");
const UserModel = require("../models/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const {createClient} = require("redis");
const auth = require("../middlewares/auth");
const logger = require("../middlewares/logger");

// const client = createClient();
// client.on('error', err => console.log('Redis Client Error', err));

userRouter.use(logger);
userRouter.post("/register",async(req,res)=>{
    try{
       await UserModel.insertMany([req.body]);
       console.log(req.body)
       res.status(200).json({message : "User registered" ,data:req.body});
    }
    catch(err){
        console.log(err);
    }
});

userRouter.get("/list",auth,async(req,res)=>{
    try{
        const data = await UserModel.find();
        console.log(data);
        res.status(200).json({message : "User data fetched", Data : data});
    }
    catch(err)
    {
        console.log("error occured");
        res.status(400).json({message : err});
    }
})

userRouter.post("/login",async (req,res)=>{
    try{
        const data = await UserModel.find({email : req.body.email});
        console.log(data[0]);
        if(data[0])
        {
            const token = await jwt.sign(data[0].email, 'masai');
            console.log(token);
            if(data[0].password === req.body.password)
            res.status(200).json({message : "Logged in sucessfull",token : token});
            else
            res.status(400).json({message: "Enter Valid Password"});
        }
        else
        {
            res.status(400).json({message : "No user Found register first"});
        }
    }
    catch(err)
    {
        res.status(400).json({message : "Error occured",error : err.message});
    }
});

userRouter.post("/logout",async(req,res)=>{
    await client.connect();
    let token = req.headers.authorization.split(" ");
    token = token[1];
    console.log(token);
    await client.set('BlacklistTokens', token);
    const data = await client.get('BlacklistTokens');
    console.log(data);
    res.status(200).json({message : "Logged out sucessfully and blacklisted the JWT token in redis"});
})

module.exports = userRouter;