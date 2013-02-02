var Bot = require('./bot'),
	fs = require('fs'),
	config = require('./config.json');
var bot = new Bot(config);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(msg){
	try{
		bot.raw(msg);
	}catch(e){
		console.log(e);
	}
});
bot.on('join', function(event){
	console.log('[JOIN] ' + event.source.nick + ' joined ' + event.channel);
});
bot.on('privmsg', function(event){
	console.log('[MSG] [' + event.target + '] '+event.source.nick+' says: ' + event.message);
});