var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken'); 
var path = require("path")
var { userModel , tweetModel } = require("./dbrepo/models");
var authRoutes = require("./routes/auth");
var { SERVER_SECRET } = require("./core/index");
var http = require("http");
var socketIO = require("socket.io");
var server = http.createServer(app);
var io = socketIO(server);

io.on("connection",()=>{
    console.log("its running");
})

console.log("module: ", userModel);


var app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('dev'));
app.use("/",express.static(path.resolve(path.join(__dirname,"public"))));


app.use("/", authRoutes)
// app.use("/auth", authRoutes)


app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; 

            if (diff > 300000) { 
                res.status(401).send("token expired")
            } else { 
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    userModel.findById(req.body.jToken.id, 'name email phone gender createdOn',
        function (err, doc) {
            if (!err) {
                res.send({
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })

        
});

app.post("/tweet",function(req,res,next){
    if (!req.body.name && !req.body.tweet) {
        res.status(403).send(`
            please send body in json body
        {
            "tweet":"tweet"
            "name":"noman"
        }`)
        return;
    }
    var newTweet = new tweetModel({
        "name":req.body.name,
        "tweets":req.body.tweet
    });
    newTweet.save(function(err,data){
        if(data){
            res.status(200).send({
                message:"tweet created",
                data:data
            })
            console.log(data.tweets)
            io.emit("NEW_POST", data)
        }else{
            console.log(err)
            res.status.send({
                message: "user created err : " + err
            })
        }
    })
});
app.get("/getTweets",function(req,res,next){
    tweetModel.find({},function(err,data){
        if(data){
            res.send({
                message:"tweet created" , 
                data:data ,
                status:200
                
            })
        }else{
            console.log(err)
            res.send(err)
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})