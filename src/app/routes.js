const Menu = require("../app/models/menu");
const UsersData = require("../app/models/user");

module.exports= (app,passport)=>{
    app.get('/',(req,res)=>{
        res.render('index',{
            message: req.flash('loginMessage')
        });
    });

    app.post('/',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/',
        failureFlash:true
    }));

    app.get('/register',(req,res)=>{
        res.render('registrar',{
            title: "Registrar",
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
        res.render('menu',{
            title:"Menu",
            user:req.user
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

    app.post('/menu/agregar', islogged, (req,res)=>{
        var correcto = true;
        const newMenu = new Menu();
        newMenu.local.Mtitulo  = req.body.nombre;
        newMenu.local.Mdescripcion = req.body.descripcion;
        newMenu.local.Mprecio= req.body.precio;
        newMenu.local.Mtiempo= req.body.time;
        // newMenu.local.Mfoto = req.body.
        
         newMenu.save(function(err){
             if(err){console.log(err); correcto = false;}
         });
       
        if(correcto){
            res.redirect('/menu/agregar')
        }else{
            res.render('/menu/agregar',req.flash("loginMessage","No se pudo guardar el alimento, intente nuevamente."));
        }
    });
    
    app.get('/EditMenu', islogged ,(req,res)=>{
        var id = req.query.id;
        Menu.findById(id, function(err, doc) {
            if (err) {
            console.error('error, no entry found');
            }
            res.render('EditProduct',{
                title:"",
                items:doc,
                user:req.user,
                message:"",
            });
        })      
    });

    app.post('/EditMenu', islogged ,(req,res)=>{
        if(req.body.tipo=="updateData"){
            console.log("up");
            var id = req.body.idt;
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
            res.redirect('/menu/agregar');
        }

        if(req.body.tipo=="Delete"){
            console.log("del");
            var id = req.body.idt;
            Menu.findByIdAndRemove(id).exec();
            res.redirect('/menu/agregar');
        }   
    });
};

function islogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/');
    }
}