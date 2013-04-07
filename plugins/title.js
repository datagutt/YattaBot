var http = require('follow-redirects').http; 
var getHostname = function(str){
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	return str.match(re)[1].toString();
};
var checkForLinks = function(event, bot){
	if(match = event.message.match(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i)){
			var url = match[0], title, hostname;
			if(!url){
				return;
			}
			if(event.source.nick == 'clibot' || event.source.nick == bot.nick){
				return;
			}
			if(url.indexOf('http') !== 0){
				url = 'https://' + url;
			}
			console.log(url);
			hostname = getHostname(url);
			if(!hostname){
				return;
			}
			var options = {
				host: hostname,
				port: 80,
				path: '/' + url.split(/\/+/g).slice(2).join('/'),
				method: 'GET'
			};
			console.log(options);
			var req = http.get(options, function(res){
				var body = '', contentType = res.headers['content-type'].split(';');
				res.setEncoding('utf8');
				if(res.statusCode !== 200 && res.statusCode !== 304 && res.statusCode !== 400){
					req.abort();
					return;
				}
				if(!contentType || contentType[0] !== 'text/html'){
					console.log('Aborting...');
					req.abort();
					return;
				}
				res.on('data', function(chunk){
					body += chunk;
					if(body.length > 2 * 1024 * 1024){
						console.log(body.length);
						req.abort();
						return;
					}
				});
				res.on('end', function(){
					if(body){
						var match = /<head.*?>.*?<title.*?>(.*?)<\/title>.*?<\/head>/im.exec(body.replace(/(\r\n|\n|\r)/gm,'')), redirected;
						if(match && match[1]){
							title = match[1];
							if(title.length <= 0){
								title = 'Empty title';
							}else if(title.length > 100){
								title = title.substring(0, 100) + '...';
							}
							redirected = req.url && req.url !== url;
							bot.message(event.target, '[Link] ' + getHostname(req.url ? req.url : url) + ' ' + (redirected ?  '[redirected]' : '') + ': ' + title);
						}
					}
				});
			}).on('error', function(e){});
		}
};
module.exports = function(bot){
	bot.on('privmsg', function(event){
		var validChannels = bot.PluginConfigs.get('title.channels');
		if(validChannels){
			validChannels = validChannels.split(',');
		}
		if(validChannels){
			validChannels.forEach(function(channel){
				if(event.target == channel){
					try{
						checkForLinks(event, bot);
					}catch(e){}
				}
			});
		}
	});
};