var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartidasSchema = new Schema({
   	id: String,
    NumClicks: Number,
    juego: Object,
    usuarios: Array
});

var Partida = mongoose.model('partidas', PartidasSchema);
