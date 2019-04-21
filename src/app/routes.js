const Menu = require("../app/models/menu");
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
            user:req.user
        });
    });

    app.get('/Usuarios',islogged, (req,res)=>{
        res.render('UsuariosManager',{
            user:req.user,
            message: req.flash('signupMessage')
        });
    });

    app.post('/Usuarios',passport.authenticate('local-signup',{
        successRedirect:'/Usuarios',
        failureRedirect:'/Usuarios',
        failureFlash:true
    }));

    app.get('/menu', islogged ,(req,res)=>{
        res.render('menu',{
            user:req.user
        });
    });

    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/');
    });

    app.get('/menu/agregar', islogged, (req,res)=>{
        res.render('agregarMenu',{
            user: req.user
        })
    });

    app.post('/menu/agregar', islogged, (req,res)=>{
        var correcto = true;
        console.log(req.foto)
        const newMenu = new Menu();
        newMenu.local.Mtitulo  = req.body.nombre;
        newMenu.local.Mdescripcion = req.body.descripcion;
        newMenu.local.Mprecio= req.body.precio;
        newMenu.local.Mtiempo= req.body.time;
        // newMenu.local.Mfoto = req.body.
        
        // newMenu.save(function(err){
        //     if(err){console.log(err); correcto = false;}
        // });
       
        if(correcto){
            res.redirect('/menu')
        }else{
            res.render('/menu/agregar',req.flash("loginMessage","No se pudo guardar el alimento, intente nuevamente."));
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