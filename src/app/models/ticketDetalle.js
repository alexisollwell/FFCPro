const mongoose = require("mongoose");

const ticketDetalleSchema = new mongoose.Schema({
    local:{
        TDticket : {type: Number,require: true},
        TDproducto : {type: String,require: true},
        TDcantidad: {type: Number,require: true},
        TDprecio: {type: Float64Array, require: true}
    }
});

module.exports = mongoose.model("TicketDetalle",ticketDetalleSchema);