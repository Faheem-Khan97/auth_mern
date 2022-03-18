import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import sessionFileStore from "session-file-store";
// import req from "express/lib/request";
// import res from "express/lib/response";
const app = express();
const PORT = 5000;
const FileStore = sessionFileStore(session)
app.use(express.json());

app.use(session({
    name:"session-id",
    secret: '1234-5678-9101-4556',
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
}));


// We are not using Cookies anymore. SO comment this out
// app.use(cookieParser('1234-4353-9879-8438'));

// function basicAuthSignedCookiesBased(req, res, next){

//     console.log(req.signedCookies);

//     if(!req.signedCookies?.user){
//         const authHead = req.headers.authorization;
//         if(!authHead){
//             const err = new Error("You need to authenticate first");
//             res.statusCode = 401;
//             res.set("WWW-Authenticate", "Basic");
//             return next(err)
//         }
//         const [username, password] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(":");
//         if(username === 'admin' && password === "12345"){
//             res.cookie('user', 'admin', {signed:true})
//             res.statusCode = 200;
//             next();
//         }
//         else{
//             const err = new Error("Username or Password didn't match");
//             res.statusCode = 401;
//             res.set("WWW-Authenticate", "Basic");
//             return next(err)
//         }

//     }
//     else{
//         if(req.signedCookies.user === 'admin'){
//             next()
//         }
//         else{
//             const err = new Error("Username or Password didn't match");
//             res.statusCode = 401;
//             return next(err)
//         }
//     }
    
// }

// Comment out this cookies based auth. We will use sessions now.
// app.use(basicAuthSignedCookiesBased);

function basicAuthSessionBased(req,res, next){
    console.log("request received")
    console.log(req.session)
    if(!req.session?.user){

        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            const err = new Error("You're not authenticated");
            err.status = 401;
            res.set('WWW-authenticate', 'Basic');
            return next(err);
        }

        const [username, password] = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString().split(':');
        if(username === 'admin' && password === '12345'){
            req.session.user = 'admin'
            next()
        }
        else{
            const err = new Error("You're not authenticated");
            err.status = 401;
            res.set('WWW-authenticate', 'Basic');
            return next(err);
        }
    }
    else{
        if(req.session.user === 'admin'){
            next();
        }
        else{
            const err = new Error("You're not authenticated");
            err.status = 401;
            res.set('WWW-authenticate', 'Basic');
            return next(err);
        }
    }
}
app.use(basicAuthSessionBased);

app.get('/', (req,res,next) =>{
    res.statusCode = 200;
    res.send("Hello World")
});

app.listen(PORT, '127.0.0.1', () =>{
    console.log("App is up and running");
});
