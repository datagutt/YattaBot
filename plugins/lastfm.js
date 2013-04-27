var request = require('request');
var nowplaying = function(user, apikey, bot, event){
console.log('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + user + '&api_key=' + apikey + '&format=json');
	request('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + user + '&api_key=' + apikey + '&format=json', function(error, response, body){
		console.log(body);
		var message = 'Could not get now playing data for ' + user + '.';
		if(body){
			var results = JSON.parse(body);
			if(results.error){
				message = results.message;
			}else if(results.recenttracks && results.recenttracks.track){
				song = results.recenttracks.track[0];
				message = user + ' is listening to ' + song.name + ' by ' + song.artist['#text'];	
			}
		}
		bot.message(event.target, event.source.nick + ': ' + message);
	});
};
module.exports = function(bot){
	var apikey = bot.PluginConfigs.get('lastfm.apikey'), user;
	
	bot.addCommand('np', 'Show what the user is playing on last.fm', '<user>', USER_LEVEL_NORMAL, true, function(event){
		if(event.params[0]){
			user = event.params[0];
		}else{
			user = event.source.nick;
		}
		nowplaying(user, apikey, bot, event);
	});
	
	bot.addCommand('lastfm', 'Show what the user is playing on last.fm', '<user>', USER_LEVEL_NORMAL, false, function(event){
		if(event.params[0]){
			user = event.params[0];
		}else{
			user = event.source.nick;
		}
		nowplaying(user, apikey, bot, event);
	});
};