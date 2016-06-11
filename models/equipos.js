var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = mongoose.model('user');

var PromoSchema = new Schema({
    id: Number,
    fechaIni: String,
    fechaFin: String,
    numParticipantes: Number,
    descripcion: String,
    img: String,
    terminos: String,
    nombre: String

});

var Promo = mongoose.model('promo', PromoSchema);

var EquipoSchema = new Schema({
    name: String,
    id: String,
    createdAt: {type: Date, default: Date.now},
    evento: { type: Schema.ObjectId, ref: "Promo"},
    participantes: Array,
    creador:  { type: Schema.ObjectId, ref: "user" },
    puntaje: Number,
    numJugadores: Number,
    jugando: Boolean,
    gano: Boolean
});

var Equipo = mongoose.model('equipos', EquipoSchema);