var Fs = require('fs'),
	path = require('path');
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
					if(tmpDir.hasOwnProperty(file) && tmpDir[file].indexOf('.js') == tmpDir[file].length - 3){
						self.load(dir, tmpDir[file]); 
					}
				}
			}
		});
	},
	load: function(dir, file){
		var self = this;
		delete require.cache[path.resolve(__dirname + '/plugins/', file)];
		self.plugins[file] = require(dir + file)(self.bot);
		//self.watch(dir, file);
	},
	watch: function(dir, file){
		var self = this;
		Fs.watchFile(dir + file, function(curr, prev) {
			if (curr.mtime > prev.mtime) { 
				self.load(dir, file);
			}
		});
	}
}
module.exports = PluginManager;