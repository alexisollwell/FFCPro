const Menu = require("../app/models/menu");
const UsersData = require("../app/models/user");
const Order = require("../app/models/ticket");
const orderItem = require("../app/models/ticketDetalle");
const configuraciones = require("../app/models/configuraciones");
const { randomNumber } = require('../helpers/libs');
const listFecha =[];
const listCantidad =[];
const listCuantos= [];
const list2= [];
// var terminado =0;
// var noterm = 0;

const fs = require('fs-extra');
const path = require('path');

module.exports= (app,passport)=>{
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    app.get('/',(req,res)=>{
        res.render('index',{
            title: "Iniciar seción",
            message: req.flash('loginMessage')
        });
    });

    app.post('/',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/',
        failureFlash:true
    }));

    app.get('/Cocinero',islogged,AllOrders, async(req,res)=>{
        Order.find()
        .then(function(doc) {
            res.render('Cocinero', {
                title: "Cocinero",
                items: req.data,
                user:req.user,
                ordenes:doc
            });
        });
    });

    app.get('/Reportes',islogged,ChartData, async(req,res)=>{     
        res.render('reportes', {
            title: "Reportes",
            user:req.user,
            listaFechas:listFecha,
            listaCantidad:listCantidad
        });
    });

    app.get('/ReportesSegundo',islogged,SegundoChart, async(req,res)=>{
        console.log(req.data);     
        res.render('reportesSegunda', {
            title: "Reportes",
            user:req.user,
            listaCuantos:req.data
        });
    });

    app.get('/register',(req,res)=>{
        res.render('registrar',{
            
            message: req.flash('signupMessage')
        });
    });

    app.post('/register',passport.authenticate('local-signup',{
        successRedirect:'/profile',
        failureRedirect:'/register',
        failureFlash:true
    }));

    app.get('/profile', islogged ,(req,res)=>{
        res.render('profile',{
            title: "Perfil",
            user:req.user
        });
    });

    app.get('/Usuarios',islogged, (req,res)=>{
        UsersData.find()
        .then(function(doc) {
            res.render('UsuariosManager', {
                title: "Usuarios",
                items: doc,
                user:req.user,
                message: req.flash('signupMessage')
            });
        });
    });

    app.post('/Usuarios',passport.authenticate('local-signup',{
        successRedirect:'/Usuarios',
        failureRedirect:'/Usuarios',
        failureFlash:true
    }));

    app.get('/menu', islogged ,(req,res)=>{
        var iva = 8;
        configuraciones.findOne().then((elm)=>{ 
            if(elm != null){
                iva = elm.local.CIva;                
            }
            Menu.find()
            .then(function(mn) {
                res.render('menu', {
                    title: "Menu",
                    items: mn,
                    iva: iva,
                    user:req.user,
                    message: req.flash('signupMessage')
                });
            });
        });       
      
    });

    app.post('/menu',islogged, async(req,res) =>{

        var ivaC = 8;
        configuraciones.findOne().then((elmc)=>{ 
            if(elmc != null){
                ivaC = elmc.local.CIva;                
            }
        });

        const idOrder = randomNumber();
        var TDate = new Date();
        const dataProductos = JSON.parse(req.body.Productos);        
        var total = 0;        
        dataProductos.Productos.forEach( (elm) => {
            //add each product to order
            const OrderItem = new orderItem();
            OrderItem.local.TDticket = idOrder;
            OrderItem.local.TDproducto = elm.nombre;
            OrderItem.local.TDcantidad= elm.Cantidad;
            OrderItem.local.TDprecio = elm.precio;
            OrderItem.local.TDestado="Pendiente";
            OrderItem.save();
            total += (elm.precio);
        });
        const NewOrder = new Order();
        NewOrder.local.Tticket = idOrder;
        NewOrder.local.Ttotal=total;
        NewOrder.local.Tcajero=req.user.local.UName+" "+req.user.local.ULastName;
        NewOrder.local.Tcomentaro=req.body.comentario;
        NewOrder.local.Testado = "Pendiente";
        NewOrder.local.TFecha=TDate.toISOString().slice(0,10);
        NewOrder.save();
        
        Menu.find()
        .then(function(mn) {
            res.render('menu', {
                title: "Menu",
                items: mn,
                iva: ivaC,
                user:req.user,
                message: "Guardado correctamente con folio " + idOrder,
                ord: idOrder
            });
        });
    });

    app.get('/EditUser', islogged ,(req,res)=>{
        var id = req.query.id;
        UsersData.findById(id, function(err, doc) {
            if (err) {
            console.error('error, no entry found');
            }
            res.render('EditUser',{
                title:"Editar usuario",
                items:doc,
                user:req.user,
                message:"",
            });
        })      
    });

    app.post('/EditUser', islogged ,(req,res)=>{
        if(req.body.tipo=="updateData"){
            var id = req.body.idt;
            const saveUser = async (file) => {

                var correcto = true;
                const imgUrl = randomNumber();
                const images = await UsersData.find({ UFoto: imgUrl });  
                
                if(images.length > 0){
                    saveUser(file);
                }else{
                    const ext = path.extname(file.originalname).toLowerCase();
                    const imageTempPath = file.path;
                    const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);
    
                    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                        // you wil need the public/temp path or this will throw an error
                        const ad = await fs.rename(imageTempPath, targetPath);
    
                        UsersData.findById(id, function(err, doc) {
                            if (err) {
                            console.error('error, no entry found');
                            }
                            doc.local.UFoto=imgUrl + ext;
                            doc.save();
                        });
    
                        if(correcto){
                            res.redirect('/Usuarios')
                        }else{
                            res.render('/EditUser',req.flash("loginMessage","No se pudo guardar la foto, intente nuevamente."));
                        }
                    } else {
                        await fs.unlink(imageTempPath);
                        res.render('/EditUser',req.flash("loginMessage","Solo se permiten imagenes."));
                    }
                }
            }
            
            
            console.log("up");
            var id = req.body.idt;
            var editPick = false;
            UsersData.findById(id, function(err, doc) {
                if (err) {
                console.error('error, no entry found');
                }
                doc.local.email=req.body.email;
                doc.local.UName=req.body.name;
                doc.local.ULastName=req.body.lastname;
                doc.local.UPhone=req.body.phone;
                doc.local.Ujob=req.body.Jobs;
                doc.save();
                console.log(req.files)
                if(typeof req.files.imageUser !== 'undefined'){
                    saveUser(req.files.imageUser[0]);
                }
            })
            res.redirect('/Usuarios');
        }
        
        if(req.body.tipo=="updatePassword"){
            console.log("pass"); 
            var id = req.body.idt;     
            UsersData.findById(id, function(err, doc) {
                if(req.body.password1==req.body.password2){
                    doc.local.password=doc.generateHash(req.body.password1);
                    doc.save();
                    res.redirect('/Usuarios');
                }
                else{  
                    res.render('EditUser',{
                        title:"Editar usuario",
                        items:doc,
                        user:req.user,
                        message:"Las contraseñas no coinciden",
                    });
                }
            })                             
        }

        if(req.body.tipo=="Delete"){
            console.log("del");
            var id = req.body.idt;
            UsersData.findByIdAndRemove(id).exec();
            res.redirect('/Usuarios');
        }   
    });

    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/');
    });

    app.get('/menu/agregar', islogged, (req,res)=>{
        var iva = 8;
        configuraciones.findOne().then((elm)=>{ 
            if(elm != null){
                iva = elm.local.CIva;                
            }
        });
        Menu.find()
        .then(function(doc) {
            res.render('agregarMenu', {
                title: "Productos",
                items: doc,
                iva:iva,
                user:req.user,
                message: req.flash('signupMessage')
            });
        });
    });

    app.post('/menu/agregar', islogged, async (req,res)=>{
        const saveProduct = async () => {

            var correcto = true;
            const imgUrl = randomNumber();
            const images = await Menu.find({ Mfoto: imgUrl });  
            
            if(images.length > 0){
                saveProduct();
            }else{
                const ext = path.extname(req.files.image[0].originalname).toLowerCase();
                const imageTempPath = req.files.image[0].path;
                const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);

                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                    // you wil need the public/temp path or this will throw an error
                    await fs.rename(imageTempPath, targetPath);

                    const newMenu = new Menu();
                    newMenu.local.Mtitulo  = req.body.nombre;
                    newMenu.local.Mdescripcion = req.body.descripcion;
                    newMenu.local.Mprecio= req.body.precio;
                    newMenu.local.Mtiempo= req.body.time;
                    newMenu.local.Mfoto = imgUrl + ext;
                    
                    correcto = await newMenu.save();

                    if(correcto){
                        res.redirect('/menu/agregar')
                    }else{
                        res.render('/menu/agregar',req.flash("loginMessage","No se pudo guardar el alimento, intente nuevamente."));
                    }
                } else {
                    await fs.unlink(imageTempPath);
                    res.render('/menu/agregar',req.flash("loginMessage","Solo se permiten imagenes."));
                }
            }
        }

        saveProduct();
    });
    
    app.post('/configuracion', islogged, (req,res)=>{
        var newIVA = req.body.IVA;

        configuraciones.findOne().then((elm)=>{
            if(elm == null){
                const newConfig = new configuraciones();
                newConfig.local.CIva  = newIVA;
                newConfig.save();
            }else{
                elm.local.CIva = newIVA;
                elm.save();
            }
        });
        res.redirect('/menu/agregar');
    })

    app.get('/EditMenu/:producto_id', islogged ,(req,res)=>{
        var id = req.params.producto_id;
        Menu.findById(id, function(err, doc) {
            if (err) {
                console.error('error, no entry found');
            }
            res.render('EditProduct',{
                title:"Editar producto",
                items:doc,
                user:req.user,
                message:"",
            });
        })      
    });

    app.post('/EditMenu/:producto_id', islogged ,(req,res)=>{
        const id = req.params.producto_id;
        Menu.findById(id, function(err, doc) {
            if (err) {
            console.error('error, no entry found');
            }
            doc.local.Mtitulo=req.body.Mtitulo;
            doc.local.Mdescripcion=req.body.Mdescripcion;
            doc.local.Mprecio=req.body.Mprecio;
            doc.local.Mtiempo=req.body.Mtiempo;
            doc.save();
        })
        


        const changeImage = async () => {
            var correcto = true;
            const imgUrl = randomNumber();
            const images = await Menu.find({ Mfoto: imgUrl });  
            
            if(images.length > 0){
                changeImage();
            }else{
                const ext = path.extname(req.files.image[0].originalname).toLowerCase();
                const imageTempPath = req.files.image[0].path;
                const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);

                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                    // you wil need the public/temp path or this will throw an error
                    await fs.rename(imageTempPath, targetPath);
                    var prod = await Menu.findById(id);
                    await fs.remove(imageTempPath);
                    
                    //Eliminar foto anterior
                    if(prod.local.Mfoto != undefined){
                        const deletePath = path.resolve(`src/public/uploads/${prod.local.Mfoto}`);                        
                        var detele = await fs.remove(deletePath);
                    }
                    await Menu.findById(id, function(err, doc) {
                            if (err) {
                                correcto = false;
                                console.error('error, no entry found');
                            }else{
                                doc.local.Mfoto = imgUrl + ext;
                                doc.save();
                            }
                    }).then(() => {
                        if(!correcto){
                            res.render('/menu/agregar',req.flash("loginMessage","No se pudo actualizar la foto."));
                        }
                    }
                    );
                } else {
                    await fs.unlink(imageTempPath);
                    res.render('/menu/agregar',req.flash("loginMessage","Solo se permiten imagenes."));
                }
            }
        }

        if(req.files.image != undefined){
            changeImage().then(res.redirect('/menu/agregar'));
        }else{   
            res.redirect('/menu/agregar');
        }
    });

    app.post('/DeleteMenu/:producto_id', islogged, (req, res)=>{
        const id = req.params.producto_id;
        Menu.findByIdAndRemove(id).exec();
        res.redirect('/menu/agregar');
    })
};
const SegundoChart = async(req,res,next)=>{
    while(listCuantos.length > 0){
        listCantidad.pop(); 
    }
    while(list2.length > 0){
        list2.pop(); 
    }  
    await Order.find()
        .then(function(doc) {       
            doc.forEach((elm)=>{
                if(elm.local.Testado=="Terminado"){
                    listCuantos.push(elm.local.Ttotal)
                }else{
                    list2.push(elm.local.Ttotal)
                }
            });
            req.data=[listCuantos.length,list2.length];
        });
    next();
}
const ChartData = async(req,res,next)=>{
    while(listCantidad.length > 0){
        listCantidad.pop(); 
    }
    while(listFecha.length > 0){
        listFecha.pop(); 
    }
    await Order.find()
        .then(function(doc) {       
            doc.forEach((elm)=>{
                listFecha.push(elm.local.TFecha);
                listCantidad.push(elm.local.Ttotal);
            });
        });
    next();
}

const AllOrders= async(req,res,next)=>{
        // const Ordenes = [];
        const Items = [];
        // await Order.find()
        // .then(function(doc) {       
        //     doc.forEach((elm)=>{
        //         if(elm.local.Testado=="Pendiente"){
        //             Ordenes.push(elm.local);
        //         }
        //     });
        // });
        //req.data=Ordenes;
        await orderItem.find()
        .then(function(doc){
            doc.forEach((elm)=>{
                if(elm.local.TDestado== "Pendiente" || elm.local.TDestado== "Tomado"){
                    Items.push(elm);
                }
            });
        });
        req.data=Items;
        next();
}

function islogged(req,res,next){
    if(req.isAuthenticated()){
        var userJob = req.user.local.Ujob;
        if(userJob==1){
            return next();
        }else{
            if(req.route.path=='/profile'){
                return next();
            }else{
                if(userJob==2){
                    if(req.route.path == "/menu"){
                        return next();
                    }else{
                        res.render('menu',{
                            title:"Menu",
                            user:req.user
                        });

                    }
                }
                if(userJob==3){
                    if(req.route.path == "/Cocinero")
                        return next();
                    else
                        res.redirect('/')
                }
            }
        }
    }else{
        return res.redirect('/');
    }
}