import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json())

function basicAuth(req, res, next){
    const authHead = req.headers.authorization;
    if(!authHead){
        const err = new Error("You need to authenticate first");
        res.statusCode = 401;
        res.set("WWW-Authenticate", "Basic");
        return next(err)
    }

    const [username, password] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(":");
    if(username === 'admin' && password === "12345"){
        res.statusCode = 200;
        next();
    }
    else{
        const err = new Error("Username or Password didn't match");
        res.statusCode = 401;
        res.set("WWW-Authenticate", "Basic");
        return next(err)
    }

}

app.use(basicAuth);
app.get('/', (req,res,next) =>{
    res.statusCode = 200;
    res.send("Hello World")
});

app.listen(PORT, '127.0.0.1', () =>{
    console.log("App is up and running");
});
