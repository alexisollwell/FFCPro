const express= require("express");
const app = express();


const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

//conect  database
const {url} = require("./config/database");
mongoose.connect(url,{
    useMongoClient:true
});

//require file passport
require('./config/passport')(passport);

//setings
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//middelwears
app.use(morgan('dev'));
app.use(multer({dest: path.join(__dirname,'./public/uploads/temp')}).single('image'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:"alexis",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require("./app/routes")(app,passport);

//static files
app.use(express.static(path.join(__dirname,"public")));



app.listen(app.get('port'),()=>{
    console.log('server on port ',app.get('port'));
});