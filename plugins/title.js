var http = require('follow-redirects').http; 
var getHostname = function(str){
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	return str.match(re)[1].toString();
};
module.exports = function(bot){
	bot.on('privmsg', function(event){
		if(match = event.message.match(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i)){
			var url = match[0], title;
			if(!url){
				return;
			}
			if(event.source.nick == 'clibot' || event.source.nick == bot.nick){
				return;
			}
			if(url.indexOf('http') !== 0){
				url = 'https://' + url;
			}
			var options = {
				host: getHostname(url),
				port: 80,
				path: url.replace(getHostname(url), ''),
				method: 'GET'
			};
			var req = http.get(options, function(res) {
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
						var match = /<head><title>(.*)<\/title><\/head>/.exec(body), redirected;
						if(match && match[1]){
							title = match[1];
							if(title.length <= 0){
								title = 'Empty title';
							}else if(title.length > 100){
								title = title.substring(0, 100) + '...';
							}
							redirected = req.url !== url;
							bot.message(event.target, '[Link] ' + getHostname(req.url) + (redirected ?  '[redirected]' : '') + ': ' + title);
						}
					}
				});
			});
		}
	});
};