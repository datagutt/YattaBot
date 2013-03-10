var request = require('request'),
	dateFormat = require('../dateFormat.js'),
	time = require('time');
const GEOCODE_API_URL = 'http://maps.googleapis.com/maps/api/geocode/json'
const TIMEZONE_API_URL = 'https://maps.googleapis.com/maps/api/timezone/json';
const STATUS_OK = 'OK';
const STATUS_NO_RESULTS = 'ZERO_RESULTS';
const STATUS_OVER_LIMIT = 'OVER_QUERY_LIMIT';
module.exports = function(bot){
	bot.addCommand('time', 'Find time for location', '<location>', USER_LEVEL_NORMAL, false, function(event){
		var geocode, currentTime;
		if(event.params && event.params[0]){
			request(GEOCODE_API_URL + '?address=' + event.params.join('+') + '&sensor=false', function(error, response, body){
					try{
						geocode = JSON.parse(body);
					}catch(e){
						geocode = '';
					} 
					if(geocode && geocode.results && geocode.results[0]){
						if(geocode && geocode.status && geocode.status !== STATUS_OK){
							switch(geocode.status){
								case STATUS_NO_RESULTS:
									bot.message(event.target, event.source.nick + ': No geodata found for request');
								break;
								case STATUS_OVER_LIMIT:
									bot.message(event.target, event.source.nick + ': Geocode api over limit');
								break;
								default:
									bot.message(event.target, event.source.nick + ': Error fetching geodata');
								break;
							}
						}
						request(TIMEZONE_API_URL + '?location=' +  geocode.results[0].geometry.location.lat + ',' + geocode.results[0].geometry.location.lng + '&timestamp=' + ((new Date).getTime() / 1000)  + '&sensor=false', function(error, response, body){
							if(body){
								try{
									var timezone = JSON.parse(body);
								}catch(e){}
							}
							
							if(timezone && timezone.status && timezone.status !== STATUS_OK){
								switch(timezone.status){
									case STATUS_NO_RESULTS:
										bot.message(event.target, event.source.nick + ': No timezone data found for location');
										return;
									break;
									case STATUS_OVER_LIMIT:
										bot.message(event.target, event.source.nick + ': Timezone api over limit');
										return;
									break;
									default:
										bot.message(event.target, event.source.nick + ': Error fetching geocode data');
										return;
									break;
								}
							}
							if(timezone){
								currentTime = new time.Date();
								currentTime.setTimezone(timezone.timeZoneId);
								var formatted = dateFormat(currentTime, 'ddd d mmm HH:MM');
								bot.message(event.target, event.source.nick + ': Time for ' + geocode.results[0].formatted_address + ' (' + timezone.timeZoneName + '): ' + formatted);
							}
						});
					}
				});
			}
	});
};
