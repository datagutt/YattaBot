var request = require('request');
module.exports = function(bot){
	bot.addCommand('weather', 'Find weather for location', '<location>', USER_LEVEL_NORMAL, false, function(event){
		var data;
		if(event.params && event.params[0]){
			request('http://www.worldweatheronline.com/feed/weather.ashx?key=' + bot.PluginConfigs.get('time.apikey') + '&q=' + event.params.join('+') + '&num_of_days=0&format=json', function(error, response, body){
				try{
					data = JSON.parse(body).data;
				}catch(e){
					data = '';
				}
				if(data && !data.error){
					conditions = data.current_condition[0];

					response  = conditions.weatherDesc[0].value + ', ';
					response += conditions.temp_C + '°C (' + conditions.temp_F + '°F) ';
					response += ', ' + conditions.humidity + '% humidity ';
					
					bot.message(event.target, event.source.nick + ': Weather for ' + data.request[0].query + ': ' + response);
				}else{
					bot.message(event.target, event.source.nick + ': Could not find weather for ' + event.params[0]);
				}
			});
		}
	});
};
