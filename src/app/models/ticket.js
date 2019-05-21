const mongoose = require("mongoose");

const ticket = new mongoose.Schema({
    local:{
        Tticket : {type: String,require: true},
        Ttotal : {type: Number,require: true},
        Tcajero: {type: String,require: true},
        Tfecha: {type: Date, require: true},
        Testado: {type: String},
        Tcomentaro: {type: String, require: true},
        Tllevar: {type: Boolean},
        Testado: {type: String, require: true}
    }
});

module.exports = mongoose.model("Ticket",ticket);