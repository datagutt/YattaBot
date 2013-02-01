var responses = [
	'As I see it, yes.',
	'It is certain.',
	'It is decidedly so.',
	'Most likely.',
	'Outlook good.',
	'Signs point to yes.',
	'Without a doubt.',
	'Yes.',
	'Yes — definitely.',
	'You may rely on it.',
	'Reply hazy. Try again.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don\'t count on it.',
	'My reply is no.',
	'My sources say no.',
	'Outlook not so good.',
	'Very doubtful.'
];
module.exports = function(bot){
	var l = responses.length;
	bot.addCommand('8ball', 'Answers your question', '[<question>]', USER_LEVEL_NORMAL, false, function(event){
		var response = responses[Math.floor(Math.random()*(l-1))];
		bot.message(event.target, event.source.nick + ': ' + response);
	});
}