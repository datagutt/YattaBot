var request = require('request');
module.exports = function(bot){
	bot.addCommand('time', 'Find time for location', '<location>', USER_LEVEL_NORMAL, false, function(event){
		var data, currenetTime, timeZone;
		if(event.params && event.params[0]){
			request('http://www.worldweatheronline.com/feed/tz.ashx?key=' + bot.PluginConfigs.get('time.apikey') + '&q=' + event.params.join(' ') + '&format=json', function(error, response, body){
				try{
					data = JSON.parse(body).data;
				}catch(e){
					data = '';
				}
				if(data && data.time_zone && data.time_zone[0]){
					bot.message(event.target, event.source.nick + ': Time for ' + event.params.join(' ') + ': ' + data.time_zone[0].localtime);
				}else{
					bot.message(event.target, event.source.nick + ': Could not find time for ' + event.params[0]);
				}
			});
		}
	});
};
