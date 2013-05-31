var parse = function(uptime){
	var minutes = Math.round(uptime / 60) % 60;
	var hours = Math.round(uptime / 60 / 60) % 24;
	var days = Math.round(uptime / 60 / 60 / 24);
	var seconds = Math.round(uptime) % 60;

	uptime = [];
	if (days >= 1) {
		uptime.push(days + ' day' + (days > 1 ? 's' : ''));
	}
	if (hours >= 1) {
		uptime.push(hours +' hour' + (hours > 1 ? 's' : ''));
	}
	if (minutes >= 1) {
		uptime.push(minutes + ' minute' + (minutes > 1 ? 's' : ''));
	}
	if (seconds >= 1) {
		uptime.push(seconds + ' second' + (seconds > 1 ? 's' : ''));
	}
	uptime = uptime.join(', ');
	return uptime;
};
module.exports = function(bot){
	bot.addCommand('uptime', 'Shows bot uptime', '', USER_LEVEL_NORMAL, false, function(event){
		var time = (new Date().getTime() - bot.startTime) / 1000;
		bot.message(event.target, event.source.nick + ': Current bot uptime: ' + parse(time));
	});
};