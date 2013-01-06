var Bot = require('./bot');
var bot = new Bot({
	server: 'irc.freenode.net',
	port: 6667,
	nick: 'YattaBot',
	user: 'yatta',
	realname: 'Hiro Nakamura',
	channels: [
		'#bbqdroid'
	],
	plugins: './plugins/',
	prefix: '.'
});
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