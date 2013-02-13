var request = require('request');
const changelogURL = 'http://changelog.bbqdroid.org/';
const changelogDeviceURL = 'http://changelog.bbqdroid.org/#_DEVICE_/cm10.1/latest';
const defaultDownloadLink = 'http://get.cm';
var devices = {};
var addDevice = function(manufacturer, name, downloadLink){
	if(!devices[manufacturer]){
		devices[manufacturer] = {};
	}
	devices[manufacturer][name] = {};
	devices[manufacturer][name].name = name;
	devices[manufacturer][name].manufacturer = manufacturer;
	if(downloadLink){
		devices[manufacturer][name].downloadLink = downloadLink;
	}
};
var getDevice = function(name){
	for(manufacturer in devices){
		if(devices[manufacturer] && devices[manufacturer][name] && devices[manufacturer][name].name == name){
			return devices[manufacturer][name];
		}
	}
};
var getDevices = function(manufacturer){
	var result = {}, device;
	if(manufacturer){
		return devices[manufacturer];
	}else{
		for(manufacturer in devices){
			for(key in devices[manufacturer]){
				device = devices[manufacturer][key];
				result[device.name] = device; 
			}
		}
	}
	return result;
};
var getLatestNightly = function(name, callback){
	request({
		uri: defaultDownloadLink + '/api',
		method: 'POST',
		json: {'method': 'get_all_builds', 'params':{'device':'' + name + '', 'channels': ['nightly']}}
	}, function(error, response, body){
		if(body && body.result && body.result[0]){
			var data = body.result[0];
			if(typeof callback == 'function'){
				if(data.url){
					callback(data.url);
				}else{
					callback('http://get.cm/?device=' + name);
				}
			}
		}
	});
};
module.exports = function(bot){
	var tmpDevices = bot.PluginConfigs.get('cm.devices');
	for(manufacturer in tmpDevices){
		if(mDevices = tmpDevices[manufacturer]){
			for(key in mDevices){
				if(mDevices.hasOwnProperty(key)){
					addDevice(manufacturer, mDevices[key]);
				}
			}
		}
	}
	bot.addCommand('download', 'Shows download link', '[<device>]', USER_LEVEL_NORMAL, false, function(event){
		if(event.params && event.params[0] !== ''){
			var device = getDevice(event.params[0]);
			if(typeof device == 'object'){
				getLatestNightly(device.name, function(link){
					bot.message(event.target, event.source.nick + ': Download at: ' + link);
				});
			}else{
				bot.message(event.target, event.source.nick + ': Device is not supported!')
			}
		}else{
			bot.message(event.target, 'Downloads: ' + defaultDownloadLink);
		}
	});
	bot.addCommand('supported', 'Shows supported devices', '[<manufacturer>]', USER_LEVEL_NORMAL, false, function(event){
		var supported, message = '';
		if(event.params && event.params[0] !== ''){
			supported = getDevices(event.params[0]);
		}else{
			supported = getDevices();
		}
		for(key in supported){
			message += key + ' ';
		};
		if(message){
			bot.message(event.target, 'Supported devices: ' + message);
		}else{
			bot.message(event.target, event.source.nick + ': That manufacturer is not supported!');
		}
	});
	bot.addCommand('changelog', 'Shows CyanogenMod device changelog', '[<device>]', USER_LEVEL_NORMAL, false, function(event){
		if(event.params && event.params[0] !== ''){
			bot.message(event.target, event.source.nick + ': ' + changelogDeviceURL.replace('_DEVICE_', event.params[0]));
		}else{
			bot.message(event.target, event.source.nick + ': ' + changelogURL);
		}
	});
}