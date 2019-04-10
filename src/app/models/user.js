const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    local:{
        UName : String,
        ULastName : String,
        Ujob: Number,
        UPhone: Number,
        email: String,
        password: String
    }
});

userSchema.methods.generateHash= function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

userSchema.methods.validatePassword = function(password){
    console.log(password)
    console.log(this.local.password)
    return bcrypt.compareSync(password,this.local.password);
};

module.exports = mongoose.model("User",userSchema);