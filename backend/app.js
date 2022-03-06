import express from "express";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser('1234-4353-9879-8438'));

function basicAuth(req, res, next){

    console.log(req.signedCookies);

    if(!req.signedCookies?.user){
        const authHead = req.headers.authorization;
        if(!authHead){
            const err = new Error("You need to authenticate first");
            res.statusCode = 401;
            res.set("WWW-Authenticate", "Basic");
            return next(err)
        }
        const [username, password] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(":");
        if(username === 'admin' && password === "12345"){
            res.cookie('user', 'admin', {signed:true})
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
    else{
        if(req.signedCookies.user === 'admin'){
            next()
        }
        else{
            const err = new Error("Username or Password didn't match");
            res.statusCode = 401;
            return next(err)
        }
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
