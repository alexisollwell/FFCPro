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
        const{nombre}= req.body
        const newLink = { nombre}
        console.log(req.body)

        res.redirect('/menu')
    });
};

function islogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        return res.redirect('/');
    }
}