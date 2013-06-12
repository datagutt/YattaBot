var util = require('util'),
	twitter = require('twitter-api').createClient();
var consumerKey = '',
	consumerSec = '';
var twitterApi = function(api, action, callback){
	twitter.fetchBearerToken(function(bearer, raw, status){
		if(!bearer){
			return;
		}
		twitter.setAuth(bearer);
		twitter.get(api, action, function(data){
			if(data && typeof callback == 'function'){
				callback(data);
			}
			twitter.setAuth(consumerKey, consumerSec)
			twitter.invalidateBearerToken(bearer);
		});
	});
};
var formatTweet = function(tweet){
	var out, unDumbed;
	if(tweet && tweet.text && tweet.user){
		unDumbed = tweet.text.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>').replace(/\&amp;/g, '&');
		out =  '<@' + tweet.user.screen_name + '> ' + unDumbed;
	}
	return out;
};
module.exports = function(bot){
	consumerKey = bot.PluginConfigs.get('twitter.consumerkey');
	consumerSec = bot.PluginConfigs.get('twitter.consumersec');
	if(!consumerKey || !consumerSec){
		return;
	}
	twitter.setAuth(
		consumerKey,
		consumerSec
	);
	bot.addCommand('twitter', 'Twitter', '<type> <user/status>', USER_LEVEL_NORMAL, false, function(event){
		var type = event.params[0];
		switch(type){
			default:
				if(event.params && event.params[0]){
					var user = event.params[0];
					twitterApi('statuses/user_timeline', {screen_name: user}, function(data){
						var tweet = formatTweet(data[0]);
						if(tweet){
							bot.message(event.target, tweet);
						}else{
							bot.message(event.target, 'Could not find tweet for: ' + user);
						}
					});
				}
			break;
			case 'user':
				if(event.params && event.params[1]){
					var user = event.params[1];
					twitterApi('statuses/user_timeline', {screen_name: user}, function(data){
						var tweet = formatTweet(data[0]);
						if(tweet){
							bot.message(event.target, tweet);
						}else{
							bot.message(event.target, 'Could not find tweet for: ' + user);
						}
					});
				}
			break;
			case 'status':
				if(event.params && event.params[1]){
					var status = event.params[1];
					twitterApi('statuses/show/'+ status, function(data){
						var tweet = formatTweet(data);
						if(tweet){
							bot.message(event.target, tweet);
						}else{
							bot.message(event.target, 'Could not find tweet ' + status);
						}
					});
				}
			break;
		}
	});
}
