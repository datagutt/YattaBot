var colors = ['RED', 'GREEN', 'BLUE', 'YELLOW', 'ORANGE', 'PURPLE', 'BROWN', 'WHITE', 'BLACK', 'GREY', 'AQUA', 'AZURE', 'BEIGE', 'CHOCOLATE', 'CRIMSON', 'CYAN', 'FUSCHIA', 'GOLD', 'INDIGO', 'IVORY', 'KHAKI', 'LAVENDER', 'LIME', 'LINEN', 'MAGENTA', 'MAROON', 'NAVY', 'OLIVE', 'ORCHID', 'PERU', 'PINK', 'PLUM', 'SALMON', 'SIENNA', 'SILVER', 'SNOW', 'TAN', 'TEAL', 'TOMATO', 'TURQUOISE', 'VIOLET', 'WHEAT'];
var easyColors = colors.slice(0, 3),
	mediumColors = colors.slice(0, 5),
	hardColors = colors.slice(0, 10),
	deathColors = colors;
var bombColors;
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
	bombColors = easyColors;
	challenged = '';
	channel = '';
	isNuclear = false;
	clearInterval(countdown);
};
var disarm = function(bot){
	bot.message(channel, 'Correct wire! Bomb disarmed.');
	bombColors = easyColors;
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
	color = bombColors[Math.floor(Math.random()*(bombColors.length-1))];
	bot.message(channel, challenged + ': you have been challenged! Choose which wire to cut (' + bombColors.join(', ') + ') before time runs out!');
	countdown = setInterval(function(){
		bot.message(event.target, timer);
		timer--;
		if(timer <= 0){
			explode(bot);
		}
	}, 1000);
};
var nuclearBomb = function(bot, event){
	bomb(bot, event, true);
};
module.exports = function(bot){
	bot.addCommand('bomb', '<user>', 'Bombs a user', USER_LEVEL_ADMIN, false, function(event){
		bombColors = easyColors;
		switch(event.params[1]){
			case 'easy':
			case '1':
				bombColors = easyColors;
			break;
			case 'medium':
			case '2':
				bombColors = mediumColors;
			break;
			case 'hard':
			case '3':
				bombColors = hardColors;
			break;
			case 'death':
			case '9':
				bombColors = deathColors;
			break;
		}
		if(event.params[0] !== ''){
			if(event.params[0].toLowerCase() !== bot.nick.toLowerCase()){
				bomb(bot, event);
			}else{
				bot.kick(event.target, event.source.nick, 'NOU');
			}
		}
	});
	bot.addCommand('nuclearbomb', '<user>', 'Bombs a user', USER_LEVEL_ADMIN, false, function(event){
		bombColors = easyColors;
		switch(event.params[1]){
			case 'easy':
			case '1':
				bombColors = easyColors;
			break;
			case 'medium':
			case '2':
				bombColors = mediumColors;
			break;
			case 'hard':
			case '3':
				bombColors = hardColors;
			break;
			case 'death':
			case '9':
				bombColors = deathColors;
			break;
		}
		if(event.params[0] !== ''){
		console.log(bot.nick);
			if(event.params[0].toLowerCase() !== bot.nick.toLowerCase()){
				nuclearBomb(bot, event);
			}else{
				bot.kick(event.target, event.source.nick, 'NOU');
			}
		}
	});
	bot.on('privmsg', function(event){
		// hax
		if(event.params[1].indexOf(bot.CommandManager.prefix + 'bomb') == 0 || event.params[1].indexOf(bot.CommandManager.prefix + 'nuclearbomb') == 0){
			return;
		}
		if(event.source.nick == challenged){
			if(event.message.toUpperCase() == color || (event.message == '42' && bot.getLevel(event.source.host) >= USER_LEVEL_MODERATOR)){
				disarm(bot);
			}else{
				bot.message(channel, event.source.nick + ': Wrong wire!');
				explode(bot);
			}
		}
	});
	bot.on('nick', function(event){
		if(event.source.nick == challenged) {
			challenged = event.source.nick;
			bot.message(event.target, event.source.nick + ': Nice try. You can not hide from the bomb!');
		}
	});
}