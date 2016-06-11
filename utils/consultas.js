var mongoose = require('mongoose');
var uuid = require('uuid');


require('../models/user');
require('../models/promociones');
require('../models/equipos');
var User = mongoose.model('user');
var Promo = mongoose.model('promociones');
var Equipo = mongoose.model('equipos');


exports.traeUser =  function (req, res) {
	User.findOne({"_id" : req.body.id}, function(err, data){
		if(data){
			res.json({status:true, datos: data});
		}else{
			res.json({status:false});
		}
		
	});
}

exports.traeEventos =  function (req, res) {
	Promo.find({}, function(err, data){
		if(data){
			res.json({status:true, datos: data});
		}else{
			res.json({status:false});
		}
		
	});
}

exports.traeEvento =  function (req, res) {
	if(req.user){
	Promo.findOne({"_id":req.query.id}, function(err, data){
		if(data){
			res.render('evento',{datos: data, user: req.user, idEvent: req.query.id, token: uuid.v1()});
		}else{
			res.json({status:false});
		}
	});
	}else{
		res.render('index');
	}
}

exports.creaEquipo = function(req, res){
	var equipo = new Equipo({
                name: req.body.name,
    			id: req.body.id,
    			evento: req.body.eventId,
    			participantes: 	[{ 	Nombre: req.body.nameUser,
    							  	Puntaje: 0
    							}],
    			creador: req.body.userId,
    			numJugadores: req.body.numPart,
    			puntaje: 0,
    			jugando: false,
    			gano: false
            });
            equipo.save(function(err) {
                if(err) throw err;
                res.json({status:true});
            });
}

exports.traeGrupos =  function(req, res){
 Equipo.find({},function(err,data){
 	if(data){
 		res.json(data);
 	}
 });
}

exports.agregarUser = function(req, res){
 User.findOne({provider_id: req.body.provider_id}, function(err, user) {
            if(err) throw(err);
            if(!err && user!= null){
              ActualizaGrupo({name: req.body.name, token: req.body.tokeGrupo},function(data){
              	res.json(data);
              });
            }else{
            	var user = new User({
	                provider_id: req.body.provider_id,
	                provider: "facebook",
	                name: req.body.name,
	                tbEstadisticaI: [],
	                tbEstadisticaG: []
            	});
	            user.save(function(err) {
	                if(err) throw err;
	                ActualizaGrupo({name: req.body.name, token: req.body.tokeGrupo},function(data){
		              	res.json(data);
              		});
	            });
            }
        });
}

function ActualizaGrupo(data, callback){
	 Equipo.findOne({id: data.token},function(err, equipo){
           if(!err && equipo != null){
           	if(equipo.participantes.length < equipo.numJugadores){
	          		equipo.participantes.push({		                			
							          			Nombre: data.name,		                			
							          			Puntaje: 0	
	          								 });
	          		Equipo.update({id : data.token},{participantes:equipo.participantes},{upsert:true},function(Error,numAffected){
		            console.log(numAffected);
		            if(numAffected){
		              callback({status:true});
		            }else{
		              callback({status:false,info:"ErrorActulizando"});
		            }
		        });
           	}else{
           		callback({status:false, info:"SinCupo"});
           	}
           }else{
           	console.log("Error "+err);
           	callback({status:false, info:"NoEquipo"});
           }
    });
}

exports.gruposCompletos = function(callback){
	var list = [];
	Equipo.find({},function(err,response){
		if(response){
			for(i in response){
			if(response[i].participantes.length === response.numJugadores && response.jugando === false){
				list.push(response[i].name);
			}
		}
		callback({equipos:list});
		}else{
			callback({err:err});
		}
		
	});
}

exports.traeEstadisticas = function(req, res){
	var result = [];
	Equipo.find({},function(err,equipos){
		User.populate(equipos,{path:"creador"},function(err,usuarios){
			Promo.populate(usuarios,{path:"evento"},function(err,response){
				if(response){
					for(i in response){
						if(response[i].gano){
							result.push(response[i]);
						}
					}
					res.status(200).json(result);
				}else{
					res.json({status:false});
				}
			});	
		});

	});
}