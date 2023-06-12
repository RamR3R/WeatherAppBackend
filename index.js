const express = require('express')
const connection = require('./db')
const userRouter = require('./routes/user.routes')
const app = express()
const  {createClient}  = require("redis");
const processRouter = require('./routes/process.routes');
app.use(express.json());

app.get('/', (req, res) => res.send('This is my weather app'))

app.use(userRouter);
app.use(processRouter);

app.listen(process.env.PORT, async() => {
    try{
        await connection;
        const client = createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        console.log(`Weather app listening on port ${process.env.PORT}`);
    }
    catch(err){
        console.log(err);
        console.log("Connection to Db failed");
    }
});