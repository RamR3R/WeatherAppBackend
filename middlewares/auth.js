const jwt  = require("jsonwebtoken");
const {createClient} = require("redis");
const client = createClient();
// client.on('error', err => console.log('Redis Client Error', err));

const auth = async(req,res,next)=>{
    let token = req.headers.authorization.split(" ");
    token = token[1];
    await client.connect();
    const black = await client.get('BlacklistTokens');
    if(!black.includes(token))
    {
        try{
            var decoded = jwt.verify(token, 'masai');
            console.log(decoded);
            req.body.name = decoded.name;
            next();
        }
        catch(err){
            res.status(400).json({message : "Error" , error : err.message});
        }
    }
    else{
        res.status(401).json({message : "Invlaid token login again"});
    }
}


module.exports = auth;


