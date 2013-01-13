var fs = require('fs');
var Storage = function(file){
	var self = this;
	self.file = './db/' + file + '.json';
	self.db = require(self.file);
};
Storage.prototype = {
	db: {},
	get: function(key){
		var self = this;
		return (self.db && self.db[key]) ? self.db[key] : false;
	},
	set: function(key, value){
		var self = this;
		if(self.db && key){
			self.db[key] = value;
			self.save();
			return self.db[key];
		}
		return false;
	},
	save: function(){
		var self = this;
		fs.writeFile(self.file, JSON.stringify(self.db), function(err){});
	}
}
module.exports = Storage;