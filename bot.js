var YattaIRC = require('yattairc');
var CommandManager = require('./CommandManager');
var PluginManager = require('./PluginManager')
var Storage = require('./Storage');
var IRC = new YattaIRC;
// User levels
global['USER_LEVEL_NORMAL'] = 0;
global['USER_LEVEL_MODERATOR'] = 1;
global['USER_LEVEL_ADMIN'] = 2;
global['USER_LEVEL_OWNER'] = 3;
var Bot = function(config){
	var self = this;
	var session = self.session = IRC.connect(config.server, config.port);
	
	self.startTime = (new Date).getTime();
	
	if(config.nick){
		self.nick = config.nick;
		IRC.nick(session, config.nick);
	}
	if(config.user && config.realname){
		IRC.user(session, config.user, 8, config.realname);
	}
	if(channels = config.channels){
		if(typeof channels == 'object'){
			channels.forEach(function(channel){
				IRC.join(session, channel);
			});
		}
	}
	if(config.auth && config.auth.user && config.auth.pass){
		IRC.message(session, 'NickServ', 'IDENTIFY ' + config.auth.user + ' ' + config.auth.pass);
	}
	
	self.event = IRC.event;
	self.UserStorage = self.UserStorage =new Storage('users');
	self.PluginConfigs = self.PluginConfigs =new Storage('pluginconfigs');
	
	CommandManager = self.CommandManager = new CommandManager(self, config.prefix);
	CommandManager.addListeners();
	PluginManager = self.PluginManager = new PluginManager(self);
	PluginManager.loadPlugins(config.plugins || './plugins/');
};
Bot.prototype = {
	on: function(event, callback){
		var self = this;
		self.event.on(event, callback);
	},
	raw: function(message){
		var self = this;
		IRC.raw(self.session, message);
	},
	message: function(target, message){
		var self = this;
		IRC.message(self.session, target, message || '');
	},
	op: function(channel, user){
		var self = this;
		IRC.op(self.session, channel, user);
	},
	deop: function(channel, user){
		var self = this;
		IRC.deop(self.session, channel, user);
	},
	join: function(channel){
		var self = this;
		IRC.join(self.session, channel);
	},
	part: function(channel){
		var self = this;
		IRC.part(self.session, channel);
	},
	kick: function(channel, user, message){
		var self = this;
		IRC.kick(self.session, channel, user, message);
	},
	ban: function(channel, user){
		var self = this;
		IRC.ban(self.session, channel, user);
	},
	addCommand: function(){
		var self = this;
		self.CommandManager.addCommand.apply(self.CommandManager, arguments);
	},
	getLevel: function(host){
		var self = this,
			level = self.UserStorage.get(host).level;
		return level ? level : USER_LEVEL_NORMAL;
	}
};
module.exports = Bot;