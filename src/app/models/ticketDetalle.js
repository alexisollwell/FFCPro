const mongoose = require("mongoose");

const ticketDetalleSchema = new mongoose.Schema({
    local:{
        TDticket : {type: String,require: true},
        TDproducto : {type: String,require: true},
        TDcantidad: {type: Number,require: true},
        TDprecio: {type: Number, require: true},
        TDestado: {type: String, require: true}
    }
});

module.exports = mongoose.model("TicketDetalle",ticketDetalleSchema);