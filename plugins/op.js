module.exports = function(bot){
	bot.on('join', function(event){
		var nick = event.source.nick, user = bot.UserStorage.get(nick);
		if(user && user.autoOP && user.level == USER_LEVEL_ADMIN){
			bot.op(event.target, nick);
		}
	});
	bot.addCommand('op', 'Give +o to the user', '<user>', USER_LEVEL_ADMIN, false, function(event){
		var nick = '';
		if(event.params && event.params[0]){
			nick = event.params[0];
		}else{
			nick = event.source.nick;
		}
		bot.op(event.target, nick);
	});
	bot.addCommand('deop', 'Give -o to the user', '<user>', USER_LEVEL_ADMIN, false, function(event){
		var nick = '';
		if(event.params && event.params[0]){
			nick = event.params[0];
		}else{
			nick = event.source.nick;
		}
		bot.deop(event.target, nick);
	});
	bot.addCommand('join', 'Join the channel', '[<channel>]', USER_LEVEL_OWNER, false, function(event){
		var channel;
		if(event.params && event.params[0]){
			channel = event.params[0];
			bot.join(channel);
		}
	});
	bot.addCommand('part', 'Part the channel', '[<channel>]', USER_LEVEL_OWNER, false, function(event){
		var channel;
		if(event.params && event.params[0]){
			channel = event.params[0];
			bot.part(channel);
		}
	});
	bot.addCommand('kick', 'Kicks the user', '<user>', USER_LEVEL_ADMIN, false, function(event){
		var nick = '';
		if(event.params && event.params[0]){
			nick = event.params[0];
		}else{
			nick = event.source.nick;
		}
		bot.kick(event.target, nick);
	});
	bot.addCommand('ban', 'Bans the user', '<user>', USER_LEVEL_ADMIN, false, function(event){
		var nick = '';
		if(event.params && event.params[0]){
			nick = event.params[0];
		}else{
			nick = event.source.nick;
		}
		bot.ban(event.target, nick);
	});
	bot.addCommand('unban', 'Unbans the user', '<user>', USER_LEVEL_ADMIN, false, function(event){
		var nick = '';
		if(event.params && event.params[0]){
			nick = event.params[0];
		}else{
			nick = event.source.nick;
		}
		bot.raw('MODE ' + event.target + ' -b ' + nick);
	});
	bot.addCommand('prefix', 'Change the prefix of the bot', '[<prefix>]', USER_LEVEL_OWNER, false, function(event){
		var prefix = '!';
		if(event.params && event.params[0]){
			prefix = event.params[0];
		}
		bot.CommandManager.prefix = prefix;
	});
	bot.addCommand('reload', 'Reload all plugins', '', USER_LEVEL_OWNER, false, function(event){
		bot.PluginManager.loadPlugins('./plugins/');
	});
	bot.addCommand('level', 'Get/set/list level of user', '[<user>] [<level>] <autoOP>', USER_LEVEL_OWNER, false, function(event){
		var type = event.params[0];
		switch(type){
			case 'get':
				var user = event.params[1];
				if(user){
					bot.message(event.target, user + ' has level ' + bot.UserStorage.get(user).level);
				}
			break;
			case 'set':
				var user = event.params[1],
					level = event.params[2];
				if(user && level){
					bot.UserStorage.set(user, {
						level: level,
						autoOP: true
					});
				}
			break;
			case 'list':
				var message = '', 
					db = bot.UserStorage.db,
					length = Object.keys(db).length - 1,
					i = 0;
				for(key in db){
					var item = db[key];
					message += key + ' (Level ' + item.level +')';
					if(i < length){
						message += ', ';
					}
					i++;
				}
				bot.message(event.target, message);
			break;
		}
	});
};