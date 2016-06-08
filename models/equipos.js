var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipoSchema = new Schema({
    name: String,
    id: String,
    createdAt: {type: Date, default: Date.now},
    evento: String,
    participantes: Array,
    creador: String,
    puntaje: Number,
    numJugadores: Number,
    jugando: Boolean
});

var Equipo = mongoose.model('equipos', EquipoSchema);