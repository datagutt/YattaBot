var Sandbox = require('sandbox'),
	s = new Sandbox()
module.exports = function(bot){
	bot.addCommand('eval', 'Executes the current code', '<code>', USER_LEVEL_OWNER, false, function(event){
		var code;
		if(event.params){
			code = event.params.join(' ');
		}
		s.run(code, function(output){
			bot.message(event.target, output.result);
		})
	});
};