const express = require("express");
const processRouter = express.Router();
const {createClient} = require("redis");
const axios = require("axios");
const auth = require("../middlewares/auth");
const apiLimiter = require("../middlewares/ratelimitter");
const stringValidator = require("../middlewares/stringValidator");

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));

processRouter.post("/weather",auth,stringValidator,apiLimiter,async (req,res)=>{
    await client.connect();
    let data = await client.get(req.body.city)
    if(data)
    {
        res.status(200).json({message : "Weather report taken" , data : data});
    }
    else
    {
        await axios({
            method: 'get',
            url: 'https://api.openweathermap.org/data/2.5/weather?appid=935eaa3531bc3bf5c9c8e8c44d35fe1a',
            params: {
                q : req.body.city
            },        
        })
            .then(async(response)=>{
            console.log(response.data.weather[0]);
            data = await response.data;
            let token = req.headers.authorization.split(" ");
            console.log(token[1]);
            await client.set(req.body.city, data.weather[0].main);
            await client.set(req.body.name, data.weather[0].main);
            res.status(200).json({message : "Weather report taken" , data : response.data.weather});
            });
    }
})

module.exports = processRouter;