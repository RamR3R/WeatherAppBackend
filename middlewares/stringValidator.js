const vali = require("validator");

const stringValidator = (req,res,next)=>{
    if(!req.body.city)
    res.status(400).json({message : "Enter city in body to find the weather"});

    if(!vali.isAlpha(req.body.city))
    res.status(400).json({message : "Enter valid City name"});

    next();
}

module.exports = stringValidator;