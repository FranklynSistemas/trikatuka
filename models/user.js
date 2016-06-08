var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    provider: String,
    provider_id: {type: String, unique: true},
    createdAt: {type: Date, default: Date.now},
    tbEstadisticaI : [{
    	id: Number,
    	fecha: String,
    	resultado: String
    }],
    tbEstadisticaG : [{
    	id: Number,
    	fecha: String,
    	participantes: Array,
    	resultado: String
    }]

});

var User = mongoose.model('user', UserSchema);