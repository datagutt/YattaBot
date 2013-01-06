var Fs = require('fs');
var PluginManager = function(bot){
	var self = this;
	self.plugins = {};
	self.bot = bot;
};
PluginManager.prototype = {
	loadPlugins: function(dir){
		var self = this;
		if(!dir){
			throw new Error('Dude.. You did not specifiy a plugin directory!')
		}
		Fs.exists(dir, function(exists){
			if(exists){
				var tmpDir = Fs.readdirSync(dir);
				for(file in tmpDir){
					if(tmpDir.hasOwnProperty(file)){
						self.load(dir, tmpDir[file]); 
					}
				}
			}
		});
	},
	load: function(dir, file){
		var self = this;
		console.log(dir, file);
		self.plugins[file] = require(dir + file)(self.bot);
		//self.watch(dir + file);
	},
	reload: function(file){
		var self = this, 
			events = self.bot.event.events;
		self.plugins[file] = require(file)(self.bot);
	},
	watch: function(file){
		var self = this;
		Fs.watchFile(file, function(curr, prev) {
			if (curr.mtime > prev.mtime) { 
				self.reload(file);
			}
		});
	}
}
module.exports = PluginManager;