const toSay = 'whats up dood';
module.exports = function(bot){
	bot.addCommand('dood', 'dood', '[<user>]', USER_LEVEL_NORMAL, false, function(event){
		if(!event.params[0]){
			bot.message(event.target, toSay);
		}else if(event.params.length == 1){
			bot.message(event.target, event.params[0] + ',');
			bot.message(event.target, toSay);
		}else{
			bot.message(event.target, event.source.nick + ': Y U GREET SO MANY AT ONCE?!');
		}
	});
}
