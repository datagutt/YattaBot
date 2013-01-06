var Command = function(name, description, usage, level, hidden, callback){
	var self = this;
	self.name = name;
	self.description = description;
	self.usage = usage;
	self.level = level || USER_LEVEL_NORMAL;
	self.hidden = !!hidden;
	self.callback = callback;
	self.enabled = true;
}
module.exports = Command;