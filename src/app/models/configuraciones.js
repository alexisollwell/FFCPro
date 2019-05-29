const mongoose = require("mongoose");

const confiSchema = new mongoose.Schema({
    local:{
        CIva : {type: Number,require: true}
    }
});

module.exports = mongoose.model("Configuracion",confiSchema);