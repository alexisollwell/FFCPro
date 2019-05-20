const mongoose = require("mongoose");

const ticket = new mongoose.Schema({
    local:{
        Tticket : {type: Number,require: true},
        Ttotal : {type: Float32Array,require: true},
        Tcajero: {type: String,require: true},
        Tfecha: {type: Date, require: true},
        Testado: {type: String},
        Tcomentaro: {type: String, require: true},
        Tllevar: {type: Boolean}
    }
});

module.exports = mongoose.model("Ticket",ticket);