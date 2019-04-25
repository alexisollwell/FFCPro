const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    local:{
        Mtitulo : {type: String,require: true},
        Mdescripcion : {type: String,require: true},
        Mprecio: {type: Number,require: true},
        Mtiempo: {type: Number,require: true},
        Mfoto : {type: String,require: true}
    }
});

module.exports = mongoose.model("Menu",menuSchema);