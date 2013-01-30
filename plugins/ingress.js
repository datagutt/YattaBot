var http = require('http'),
	cache = require('memory-cache');
var getInfo = function(token, acsid, callback){
	var options = {
		host: 'www.ingress.com', 
		path: '/rpc/dashboard.getGameScore',
		method: 'POST',
		headers: {
			'X-CSRFToken': token,
			'X-Requested-With': 'XMLHttpRequest',
			'Cookie': 'csrftoken=' + token + '; ACSID=' + acsid + ' ingress.intelmap.lat=51.44990005494227; ingress.intelmap.lng=-1.29638671875; ingress.intelmap.zoom=6; __utma=24037858.2033149229.1355337972.1355583187.1355690799.5; __utmb=24037858.15.6.1355690812442; __utmc=24037858; __utmz=24037858.1355337972.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided)'
		}
	};
	var postBody = {
		'method': 'dashboard.getGameScore'
	};
	postBody = JSON.stringify(postBody);
	var data = '';
	var req = http.request(options, function(res){
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function(){
			if(res.statusCode !== 404){
				callback(data);
			}else{
				callback();
			}
		});
	});
	req.write(postBody);
	req.end();
};
var showScores = function(bot, event, ingressScore){
	if(ingressScore){
		bot.message(event.target, 'Resistance Mind Units: ' + ingressScore.resistance);
		bot.message(event.target, 'Enlightened Mind Units: ' + ingressScore.enlightened);
	}
};		
module.exports = function(bot){
	var token = bot.PluginConfigs.get('ingress.token'),
		acsid = bot.PluginConfigs.get('ingress.acsid');
	bot.addCommand('ingress', 'Shows faction info', '', USER_LEVEL_NORMAL, false, function(event){
		var ingressScore = cache.get('ingress.score'), result;
		if(!ingressScore){
			getInfo(token, acsid, function(data){
				try{
					var data = JSON.parse(data);
					if(result = data.result){
						console.log('Caching ingress data...');
						// Now cache this for 5 minutes
						cache.put('ingress.score', {'resistance' : result.resistanceScore, 'enlightened': result.alienScore}, 5 * 60 * 1000);
						ingressScore = cache.get('ingress.score');
						showScores(bot, event, ingressScore);
					}
				}catch(e){}
			});
		}else{
			console.log('Getting cached ingress data...');
			showScores(bot, event, ingressScore);
		}
	});
};