module.exports = function(bot){
	bot.addCommand('help', 'Shows help', '<command>', USER_LEVEL_NORMAL, false, function(event){
		var message = '',
			prefix = bot.CommandManager.prefix;
			commands = bot.CommandManager.commands;
		if(event.params && event.params[0]){
			var name = event.params[0];
			if(commands && commands[name]){
				var command = commands[name];
				message += 'Usage: ' + (prefix + command.name) + ' ' + command.usage;
				message += '\nDescription: ' + command.description;
			}
		}else{
			message = 'Available commands: ';
			for(key in commands){
				var command = commands[key];
				if(bot.getLevel(event.source.host) >= command.level){
					message += (prefix + command.name) + ' ';
				}
			}
		}
		if(message){
			bot.message(event.target, message);
		}
	});
};