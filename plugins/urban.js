var request = require('request');
module.exports = function(bot){
	bot.addCommand('define', 'Define', '[<keyword>]', USER_LEVEL_NORMAL, false, function(event){
		var keyword = event.params.join('+');
		request('http://api.urbandictionary.com/v0/define?term=' + keyword, function(error, response, body){
			if(body){
				try{
					var parsed = JSON.parse(body).list[0];
					if(parsed){
						bot.message(event.target, 'Definition for ' + parsed.word + ': ' + parsed.definition);
					}else{
						bot.message(event.target, 'Could not find definition.');
					}
				}catch(e){}
			}
		});
	});
}