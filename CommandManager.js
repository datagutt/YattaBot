var Command = require('./Command');
var CommandManager = function(bot, prefix){
	var self = this;
	self.commands = {};
	self.bot = bot;
	self.prefix = prefix || '!';
};
CommandManager.prototype = {
	addCommand: function(name, description, usage, level, hidden, callback){
		var self = this;
		self.commands[name] = new Command(name, description, usage, level, hidden, callback);
	},
	addListeners: function(){
		var self = this,
			commands = self.commands;
		self.bot.event.on('privmsg', function(event){
			var params = [];
			if(event.message.indexOf(self.prefix) == 0){
				var split = event.message.split(' ');
				command = split[0].substring(self.prefix.length).toLowerCase();	
				if(commandObj = commands[command]){
					if(self.bot.getLevel(event.source.host) >= commandObj.level){
						if(typeof commandObj.callback == 'function'){
							params = split.slice(1);
							console.log(event.params);
							commandObj.callback.apply(self, [{
								'target': event.target,
								'message': event.message,
								'source': event.source,
								'params': params
							}]);
						}
					}else{
						self.bot.message(event.target, event.source.nick + ': You are not allowed to execute that command!');
					}
				}else{
					self.bot.message(event.target, event.source.nick + ': Command does not exist!');
				}
			}
			
		});
	}
}
module.exports = CommandManager;