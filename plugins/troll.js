const toSay = 'whats up dood';
module.exports = function(bot){
	bot.addCommand('dood', 'dood', '[<user>]', USER_LEVEL_NORMAL, false, function(event){
		if(!event.params[0]){
			bot.message(event.target, toSay);
		}else if(event.params && event.params.length < 5){
			event.params.forEach(function(user){
				bot.message(event.target, user + ',');
			});
			bot.message(event.target, toSay);
		}else{
			bot.message(event.target, event.source.nick + ': You can not greet this many!');
		}
	});
}
