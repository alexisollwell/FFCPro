const express= require("express");
const app = express();
//Sockets
var http = require('http').Server(app);
var io = require('socket.io')(http);
//End sockets

//MODELOS PARA SOCKETS
const Order = require("./app/models/ticket");
const orderItem = require("./app/models/ticketDetalle");
//

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
app.use(multer({dest: path.join(__dirname,'./public/uploads/temp')}).fields([{name:'image'},{name: 'imageUser'}]))
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

//Sockets
io.on('connection', function(socket){
    socket.on('updateDetail', function (data) {
        orderItem.findById(data.detail).then((elm)=>{
            if(data.check)
            { elm.local.TDestado = 'Tomado'; }
            else{ elm.local.TDestado = 'Pendiente'; }
            elm.save()
        });
        io.emit('updateDetailR', data);
        
    });
    socket.on('endTicket', function (data) {
        Order.findById(data.ticket).then((elm)=>{
            elm.local.Testado = 'Terminado';
            elm.save()
        });
        io.emit('removeTicket', data);
    });
    socket.on('orderAdded', function (data) {
        Order.find({'local.Tticket':idOrder}).then((elm)=>{
            orderItem.find({'local.TDticket': idOrder}).then((tds)=>{
                var resp = {
                    order: elm,
                    detail: tds
                }
                io.emit('newOrden', resp);
            });
        });
    });
});

http.listen(app.get('port'),()=>{
    console.log('server on port ',app.get('port'));
});