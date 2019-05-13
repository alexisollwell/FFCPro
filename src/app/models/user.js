const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    local:{
        UName : {type: String,require: true},
        ULastName : {type: String,require: true},
        Ujob: {type: Number,require: true},
        UPhone: {type: Number,require: true},
        email: {type: String,require: true},
        password: {type: String,require: true}
    }
});

userSchema.methods.generateHash= function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password,this.local.password);
};

module.exports = mongoose.model("User",userSchema);