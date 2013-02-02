var request = require('request');
module.exports = function(bot){
	bot.on('privmsg', function(event){
		if(match = event.message.match(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i)){
			var url = match[0], title;
			if(!url){
				return;
			}
			if(event.source.nick == 'clibot' || event.source.nick == bot.nick){
				return;
			}
			if(url.indexOf('http') !== 0){
				url = 'https://' + url;
			}
			request(url, function(error, response, body){
				if(body){
					var match = /<title>(.*)<\/title>/.exec(body);
					if(match && match[1]){
						title = match[1];
						bot.message(event.target, title);
					}
				}
			});
		}
	});
};