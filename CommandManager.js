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
			for(key in commands){
				var command = self.prefix + key,
					commandObj = commands[key],
					params = [];
				if(event.message.indexOf(command) == 0){
					console.log(command, commandObj);
					if(self.bot.getLevel(event.source.host) >= commandObj.level){
						if(typeof commandObj.callback == 'function'){
							params = event.message.slice(command.length + 1).split(' ');
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
				}
			}
		});
	}
}
module.exports = CommandManager;