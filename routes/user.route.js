const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Usermodel } = require("../models/user.model");

const userRouter = express.Router();

// Signup
userRouter.post("/register", async (req,res)=>{
    try {
        let data = req.body;
        const user = new Usermodel(data);
        const salt = await bcrypt.genSalt(5);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send(user);
    } catch (err) {
        console.log(err);
        res.send({message: err.message});
    }
})

// Login
userRouter.post("/login", async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user = await Usermodel.findOne({email});
        if(user != undefined){
            let result = await bcrypt.compare(password, user.password);
            if(result == true){
                let token = await jwt.sign({userId: user._id, username: user.username}, process.env.key);
                res.send({token,userId: user._id, username: user.username});
            }else{
                res.send({message: "Wrong credentials"})
            }
        }else{
            res.send({message: "Wrong credentials"})
        }
    } catch (err) {
        console.log(err);
        res.send({message: err.message});
    }
})

module.exports = {
  userRouter,
};
