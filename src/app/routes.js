const Menu = require("../app/models/menu");
const UsersData = require("../app/models/user");
const Order = require("../app/models/ticket");
const orderItem = require("../app/models/ticketDetalle");
const { randomNumber } = require('../helpers/libs');

const fs = require('fs-extra');
const path = require('path');

module.exports= (app,passport)=>{
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

    app.get('/Cocinero',(req,res)=>{
        res.render('Cocinero',{
            title: "Cocinero",
            user:req.user
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
        Menu.find()
        .then(function(mn) {
            res.render('menu', {
                title: "Menu",
                items: mn,
                user:req.user,
                message: req.flash('signupMessage')
            });
        });
        
      
    });

    app.post('/menu',islogged, (req,res) =>{
        console.log(req.body.comentario);
        const idOrder = randomNumber();
        const total = 0;
        req.body.Productos.forEach( elm => {
            elm = elm.replace(/\'/g,'"');
            var elmJS = JSON.parse(elm.toString());
            //add each product to order
            const OrderItem = new orderItem();
            OrderItem.local.TDticket = idOrder;
            OrderItem.local.TDproducto = elmJS.nombre;
            OrderItem.local.TDcantidad= elmJS.cantidad;
            OrderItem.local.TDprecio = elmJS.precio;
            OrderItem.save();
            total = total + (elmJS.cantidad*elmJS.precio);
            console.log(elmJS);
        });
        const NewOrder = new Order();
        NewOrder.local.Tticket = idOrder;
        NewOrder.local.Ttotal=total;
        NewOrder.local.Tcajero=req.user.UName+" "+req.user.ULastName;
        NewOrder.local.Tcomentaro=req.body.comentario;
        NewOrder.save();
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
            console.log("up");
            var id = req.body.idt;
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
        Menu.find()
        .then(function(doc) {
            res.render('agregarMenu', {
                title: "Productos",
                items: doc,
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
                const ext = path.extname(req.file.originalname).toLowerCase();
                const imageTempPath = req.file.path;
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
                const ext = path.extname(req.file.originalname).toLowerCase();
                const imageTempPath = req.file.path;
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

        if(req.file != undefined){
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
                    res.render('menu',{
                        title:"Menu",
                        user:req.user
                    });
                }
                if(userJob==3){
                    res.render('Cocinero',{
                        title:"Cocinero",
                        user:req.user
                    });
                }
            }
        }
    }else{
        return res.redirect('/');
    }
}