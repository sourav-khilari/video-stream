import express from "express"
//const express =require('express')
const app=express()

app.get("/",function(req,res,next){
    //res.send("inside app")
    console.log("Hello World")
    return next(new Error("something went wrong inside app get"))
});

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('Something broke!')
    
})

app.listen(8000)