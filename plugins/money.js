// I'M GONNA POP SOME TAGS, ONLY GOT TWENTY DOLLARS IN MY POCKET
var fx = require('money');
var http = require('http');
var getRates = function(key, callback){
	var options = {host: 'openexchangerates.org', path: '/latest.json?app_id=' + key};
	http.get(options, function(res) {
		var data = '';
		res.on('data', function (chunk){
			data += chunk;
		});
		console.log(key, res);
		res.on('end',function(err){
			if(err){
				throw err;
			}
			console.log(data);
			if(data){
				data = JSON.parse(data);
				if(typeof callback == 'function'){
					callback(data);
				}
			}
		});
	});
}
module.exports = function(bot){
	bot.addCommand('money', 'Converts currency', '<value> <from> <to>', USER_LEVEL_NORMAL, false, function(event){
		if(event.params && event.params[1] && event.params[2]){
			var value = parseInt(event.params[0]);
			var from = event.params[1].toUpperCase();
			var to = event.params[2].toUpperCase();
			var response;
			getRates(bot.PluginConfigs.get('money.apikey'), function(data){
				fx.rates = data.rates;
				try{
					var response = fx.convert(value, {'from': from, 'to': to});
				}catch(e){
					bot.message(event.target, 'We can not convert between those currencies!');
				}
				if(response){
					bot.message(event.target, value + ' ' + from + ' = ' +  response.toFixed(2) + ' ' + to);
				}
			});
		}
	});
};