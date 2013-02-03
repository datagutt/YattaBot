var request = require('request');
var twitterApi = function(api, action, callback){
	request('http://api.twitter.com/1/' + api + '/' + encodeURIComponent(action) + '.json', function(error, response, body){
		var data;
		try{
			data = JSON.parse(body);
		}catch(e){
			data = {};
		}
		if(typeof callback == 'function'){
			callback(data);
		}
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
	bot.addCommand('twitter', 'Twitter', '<type> <user/status>', USER_LEVEL_NORMAL, false, function(event){
		var type = event.params[0];
		switch(type){
			case 'user':
				if(event.params && event.params[1]){
					var user = event.params[1];
					twitterApi('statuses/user_timeline', user, function(data){
						console.log(data);
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
					twitterApi('statuses/show', status, function(data){
						console.log(data);
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