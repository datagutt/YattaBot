var util = require('util');
var evaluate = function(code){
	try{
		return eval(code);
	}catch(e){
		return e;
	}
};
module.exports = function(bot){
	bot.addCommand('eval', 'Executes the current code', '<code>', USER_LEVEL_OWNER, false, function(event){
		var code;
		if(event.params){
			code = event.params.join(' ');
		}
		evaluated = evaluate.apply(this, [code]);
		result = util.inspect(evaluated);
		if(result){
			bot.message(event.source.nick, result);
		}
	});
};