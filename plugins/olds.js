var Storage = require('../Storage'),
	olds = new Storage('olds');
var parse = function(time){
	time =  Math.floor((new Date() - time) / 1000);
	var minutes = Math.round(time / 60) % 60;
	var hours = Math.round(time / 60 / 60) % 24;
	var days = Math.round(time / 60 / 60 / 24);
	var seconds = Math.round(time) % 60;

	if (days >= 1) {
		time = days + ' day' + (days > 1 ? 's' : '');
	}else if (hours >= 1) {
		time = hours +' hour' + (hours > 1 ? 's' : '');
	}else if (minutes >= 1) {
		time = minutes + ' minute' + (minutes > 1 ? 's' : '');
	}else if(seconds >= 1) {
		time = seconds + ' second' + (seconds > 1 ? 's' : '');
	}
	return time;
};
var checkLinkAge = function(event, bot){
	if(match = event.message.match(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i)){	
		var url = match[0], urls, str = '';
		urls = olds.get('urls');
		
		if(urls && urls.hasOwnProperty(url)){
			urls[url].times++;
			urls[url].nick = event.source.nick;
			urls[url].last = new Date().getTime();
			str = 'That link is old! It has been linked ' + urls[url].times.toString() + ' times!';
			str += ' First used by ' + event.source.nick + ' ' + parse(urls[url].first) + ' ago.';
			bot.message(event.target, event.source.nick + ': ' + str);
		}else{
			urls[url] = {
				'times': 1,
				'nick': event.source.nick,
				'first': new Date().getTime()
			};
		}
		olds.set('urls', urls);
	}
};
module.exports = function(bot){
	bot.on('privmsg', function(event){
		var validChannels = bot.PluginConfigs.get('olds.channels');
		if(validChannels){
			validChannels = validChannels.split(',');
		}
		if(validChannels){
			validChannels.forEach(function(channel){
				if(event.target == channel){
					try{
						checkLinkAge(event, bot);
					}catch(e){}
				}
			});
		}
	});
};