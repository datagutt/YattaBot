var colors = [
	'red',
	'blue',
	'green',
	'orange',
	'brown'
];
var countdown;
var challenged = '';
var channel = '';
var color;
var isNuclear = false;

var explode = function(bot){
	bot.message(channel, 'BOOM!');
	if(isNuclear){
		bot.ban(channel, challenged);
	}
	bot.kick(channel, challenged, 'You failed to disarm the bomb! Correct wire was ' + color);
	challenged = '';
	channel = '';
	isNuclear = false;
	clearInterval(countdown);
};
var disarm = function(bot){
	bot.message(channel, 'Correct wire! Bomb disarmed.');
	challenged = '';
	channel = '';
	isNuclear = false;
	clearInterval(countdown);
};
var bomb = function(bot, event, nuclear){
	var timer = 10;
	if(challenged != ''){
		bot.message(event.target, event.source.nick + ': bomb already in progress');
		return;
	}
	if(nuclear){
		isNuclear = true;
	}
	challenged = event.params[0];
	channel = event.target;
	color = colors[Math.floor(Math.random()*(colors.length-1))];
	bot.message(channel, challenged + ', you have been challenged!');
	bot.message(event.target, 'Answer (' + colors.join(', ') + ') before time runs out!');
	countdown = setInterval(function(){
		bot.message(event.target, timer);
		timer--;
		if(timer < 0){
			explode();
		}
	}, 1000);
};
var nuclearBomb = function(bot, event){
	bomb(bot, event, true);
};
module.exports = function(bot){
	bot.addCommand('bomb', '<user>', 'Bombs a user', USER_LEVEL_ADMIN, false, function(event){
		if(event.params[0] !== ''){
			bomb(bot, event);
		}
	});
	bot.addCommand('nuclearbomb', '<user>', 'Bombs a user', false, USER_LEVEL_ADMIN, function(event){
		if(event.params[0] !== ''){
			nuclearBomb(bot, event);
		}
	});
	bot.on('privmsg', function(event){
		// hax
		if(event.params[1].indexOf(bot.CommandManager.prefix + 'bomb') == 0 || event.params[1].indexOf(bot.CommandManager.prefix + 'nuclearbomb') == 0){
			return;
		}
		if(event.source.nick == challenged){
			if(event.message == color || (event.message == '42' && bot.getLevel(event.source.host) >= USER_LEVEL_MODERATOR)){
				disarm(bot);
			}else{
				bot.message(channel, 'Wrong wire!');
				explode(bot);
			}
		}
	});
	bot.on('nick', function(event){
		if(event.source.nick == challenged) {
			challenged = event.source.nick;
		}
	});
}