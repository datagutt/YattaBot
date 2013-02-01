var geoip = require('geoip'),
	time = require('time');
var City = geoip.City;
var city = new City('./plugins/GeoLiteCity.dat');
var parseData = function(data){
	var currentTime = new time.Date();
	currentTime.setTimezone(data.time_zone);
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	
	if(minutes < 10){
		minutes = '0' + minutes;
	}

	var time = hours + ':' + minutes + ':' + seconds;
	return {
		'country' : data.country_name,
		'city': data.city,
		'latitude': data.latitude,
		'longitude': data.longitude,
		'time': time
	};
};
module.exports = function(bot){
	bot.addCommand('geo', 'Stalk user/host', '[<type>] [<user>]', USER_LEVEL_NORMAL, false, function(event){
		var type = event.params[0];
		switch(type){
			case 'user':
			break;
			case 'host':
				if(event.params && event.params[1]){
					var geo = city.lookupSync(event.params[1]);
					if(geo){
						bot.message(event.target, event.source.nick + ': ' + parseData(geo));
					}else{
						bot.message(event.target, event.source.nick + ': Could not find host for ' + event.params[1]);
					}
				}
			break;
			default:
				var geo = city.lookupSync(event.source.host);
				if(geo){
					bot.message(event.target, event.source.nick + ': ' + parseData(geo));
				}else{
					bot.message(event.target, event.source.nick + ': Could not find host for ' + event.source.host);
				}
			break;
		}
	});
}