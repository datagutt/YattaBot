var http = require('http');
var responses = {
	'make me a sandwich': 'What? Make it yourself.',
	'sudo make me a sandwich': 'Okay.',
	'Did you really name your son Robert\'); DROP TABLE Students;--?': 'Oh, yes. Little Bobby Tables, we call him.',
	'correcthorsebatterystaple': 'http://xkcd.com/936/'
}
var xkcd = function(num, callback){
	var options = {
		host: 'dynamic.xkcd.com',
		path: '/api-0/jsonp/comic/' + num
	};
	var data = '';
	http.get(options, function(res){
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			if(res.statusCode !== 404){
				callback(data);
			}else{
				callback();
			}
		});
	});
};
module.exports = function(bot){
	bot.addCommand('xkcd', 'Shows xkcd comic', '<num>', USER_LEVEL_NORMAL, false, function(event){
		var message = '', num = '';
		if(event.params && event.params[0]){
			num = event.params[0];
		}
		xkcd(num, function(data){
			if(data){
				var object = JSON.parse(data);
				try{
					bot.message(event.target, object.title + ': ' + object.img + ' (' + object.alt + ')');
				}catch(e){
					bot.message(event.target, 'Comic not found.');
				}
			}else{
				bot.message(event.target, 'Comic not found.');
			}
		});
		bot.message(event.target, message);
	});
	bot.on('privmsg', function(event){
		var message;
		if(responses && responses[event.message]){
			message = responses[event.message];
			bot.message(event.target, message);
		}
	});
};