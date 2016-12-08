var mongoose = require('mongoose');

var QuedadaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: String,
        required: true,
        trim: true
    },
    hora: {
        type: String,
        required: true,
        trim: true
    },
    participantes: {
        type: [String]
    },
    tareas: {
        hacer: {
            type: [String]
        },
        hechas: {
            type: [String]
        }
    },
    hecha: {
        type: Boolean,
        required: true
    }
});

var Quedada = mongoose.model('Quedada', QuedadaSchema);
module.exports = Quedada;