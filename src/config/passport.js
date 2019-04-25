const LocalStrategy = require("passport-local").Strategy;
const User = require("../app/models/user");

module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });

    //register New User
    passport.use('local-signup',new LocalStrategy({
        usernameField:"email",
        passwordField:"password",
        passReqToCallback:true
    },
    function(req,email,password,done){
        User.findOne({"local.email":email},function(err,user){
            if(err){return done(err);}
            if(user){
                return done(null,false,req.flash("signupMessage","Este correo ya ha sido registrado"))
            }else{
                var newUser = new User();
                newUser.local.email=email;
                newUser.local.password= newUser.generateHash(password);
                newUser.local.UName=req.body.Names;
                newUser.local.ULastName=req.body.LastNames;
                newUser.local.Ujob=req.body.Jobs;
                newUser.local.UPhone=req.body.Phones;
                console.log(newUser);
                newUser.save(function(err){
                    if(err){throw err;}
                    else{
                        done(null);
                    }
                });
            }
        });
    }));

    //login
    passport.use('local-login',new LocalStrategy({
        usernameField:"email",
        passwordField:"password",
        passReqToCallback:true
    },
    function(req,email,password,done){
        User.findOne({"local.email":email},function(err,user){
            if(err){return done(err);}
            if(!user){
                return done(null,false,req.flash("loginMessage","Usuario no encontrado."))
            }
            if(!user.validatePassword(password)){
                return done(null,false,req.flash("loginMessage","Contraseña incorrecta."))
            }
            return done(null,user);
        });
    }));
};