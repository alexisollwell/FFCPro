const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    local:{
        Mtitulo : String,
        Mdescripcion : String,
        Mprecio: Number,
        Mtiempo: Number,
        Mfoto : String
    }
});

module.exports = mongoose.model("Menu",menuSchema);