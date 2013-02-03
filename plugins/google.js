var http = require('http'),
	c = require('irc-colors');
var google = function(keyword, callback){
	var options = {
		host: 'ajax.googleapis.com',
		path: '/ajax/services/search/web?v=1.0&q=' + keyword
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
	bot.addCommand('google', 'Search for the keyword', '<keyword>', USER_LEVEL_NORMAL, false, function(event){
		var keyword = '', message = '';
		if(event.params && event.params[0]){
			keyword = event.params.join('+');
		}
		google(keyword, function(data){
			try{
				result = JSON.parse(data);
			}catch(e){
				message = 'Google returned an error.';
			}
			if(result && result.responseData && result.responseData.results && result.responseData.results[0]){
				var returned = result.responseData.results[0];
				message = c.bold(returned.titleNoFormatting) + ' - ' + decodeURIComponent(returned.url);
			}else{
				message = 'No search results returned for that keyword.';
			}
			bot.message(event.target, message);
		});
	});	
	bot.addCommand('images', 'Find image', '<keyword>', USER_LEVEL_NORMAL, false, function(event){
		var keyword = '', message = '';
		if(event.params && event.params[0]){
			keyword = event.params.join('+');
		}
		bot.message(event.target, event.source.nick + ': http://google.com/search?q=' + keyword + '&tbm=isch');
	});
	bot.addCommand('tts', 'Generate tts link', '<lang> [<text>]', USER_LEVEL_NORMAL, false, function(event){
		var lang = '', keyword = '';
		if(event.params && event.params[0] && event.params[1]){
			lang = event.params[0];
			keyword = event.params.slice(1).join('+');
			bot.message(event.target, event.source.nick + ': http://translate.google.com/translate_tts?ie=utf-8&tl=' + lang + '&q=' + keyword);
		}
	});
};