var request = require('request');
var languages = {
	'af': 'Afrikaans',
	'sq': 'Albanian',
	'ar': 'Arabic',
	'az': 'Azerbaijani',
	'eu': 'Basque',
	'bn': 'Bengali',
	'be': 'Belarusian',
	'bg': 'Bulgarian',
	'ca': 'Catalan',
	'zh-CN': 'Simplified-Chinese',
	'zh-TW': 'Traditional-Chinese',
	'hr': 'Croatian',
	'cs': 'Czech',
	'da': 'Danish',
	'nl': 'Dutch',
	'en': 'English',
	'eo': 'Esperanto',
	'et': 'Estonian',
	'tl': 'Filipino',
	'fi': 'Finnish',
	'fr': 'French',
	'gl': 'Galician',
	'ka': 'Georgian',
	'de': 'German',
	'el': 'Greek',
	'gu': 'Gujarati',
	'ht': 'Haitian Creole',
	'iw': 'Hebrew',
	'hi': 'Hindi',
	'hu': 'Hungarian',
	'is': 'Icelandic',
	'id': 'Indonesian',
	'ga': 'Irish',
	'it': 'Italian',
	'ja': 'Japanese',
	'kn': 'Kannada',
	'ko': 'Korean',
	'la': 'Latin',
	'lv': 'Latvian',
	'lt': 'Lithuanian',
	'mk': 'Macedonian',
	'ms': 'Malay',
	'mt': 'Maltese',
	'no': 'Norwegian',
	'fa': 'Persian',
	'pl': 'Polish',
	'pt': 'Portuguese',
	'ro': 'Romanian',
	'ru': 'Russian',
	'sr': 'Serbian',
	'sk': 'Slovak',
	'sl': 'Slovenian',
	'es': 'Spanish',
	'sw': 'Swahili',
	'sv': 'Swedish',
	'ta': 'Tamil',
	'te': 'Telugu',
	'th': 'Thai',
	'tr': 'Turkish',
	'uk': 'Ukranian',
	'ur': 'Urdu',
	'vi': 'Vietnamese',
	'cy': 'Welsh',
	'yi': 'Yiddish'
};
var getCode = function(language, languages){
	var code, lang;
	if(!language){
		return;
	}
	for(code in languages){
		lang = languages[code];
		if(lang.toLowerCase() === language.toLowerCase()){
			return code;
		}
	}
};
module.exports = function(bot){
	bot.addCommand('translate', 'Translate', '[<from>] [<to>] [<keywords]', USER_LEVEL_NORMAL, false, function(event){
		var keyword = event.params.slice(2).join('+'),
			to, from;
		if(event.params.length < 1){
			bot.message(event.target,  event.source.nick + ': ' + bot.CommandManager.prefix + 'translate ' + '[<from>] [<to>] [<keywords]');
			return;
		}
		if(event.params[0] !== ''){
			from = getCode(event.params[0], languages);
		}else{
			from = 'auto';
		}
		if(event.params[1]){
			to = getCode(event.params[1], languages);
		}else{
			to = 'en';
		}
		request('http://translate.google.com/translate_a/t?client=t&hl=en&multires=1&sc=1&sl=' + from + '&ssel=0&tl=' + to + '&tsel=0&uptl=en&text=' + keyword, function(error, response, body){
			if(body){
				try{
					var parsed = eval(body),
						language = languages[parsed[2]];
					parsed = parsed[0] && parsed[0][0] && parsed[0][0][0];
					if(parsed && languages[to]){
						bot.message(event.target, event.source.nick + ': ' + parsed);
					}else{
						bot.message(event.target, event.source.nick + ': Could not find translation.');
					}
				}catch(e){}
			}else{
				console.log(error);
				bot.message(event.target, event.source.nick + ': Could not contact server.');
			}
		});
	});
}