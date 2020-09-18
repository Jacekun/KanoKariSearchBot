console.log('Getting discord.js....');
const Discord = require('discord.js');
const client = new Discord.Client();

console.log('Getting fs....');
var fs = require("fs");

console.log('Getting discord.js-pagination....');
const paginationEmbed = require('discord.js-pagination');

console.log('Reading JSON file...');
var json = fs.readFileSync("./KanoKariOCR.json", {"encoding": "utf-8"});

console.log('Making JSON Object...');
var JSONObj = JSON.parse(json);

const RESULTS_LIMIT = 2;
embedPages = [];
console.log('Loaded all dependencies!');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// received a request
	var query = message.content;
	if (query.substr(0, 3) == "!kk")
	{

		// !help command
		if (query == '!kkhelp')
		{

		message.channel.send("```Use '!kksearch text_to_search'  to query for texts.\nUse '!kktitles text_tp_search'  to find chapter whose title includes the query.\nNOTE: Use ONLY lowercase and AVOID using special characters.\nOnly special character allowed is an Apostrophe ( ' ).\nExample: !kksearch sumi-chan's```")
		.catch(err => console.error(err));

		}
		// Search for text or chapter titles
		else if (query.includes('!kksearch') || query.includes('!kktitles'))
		{
			var searchForTitle = 0;
			var results = "";
			var pageRes = "";
			var len = query.length - 9;
			var searchString = query.substr(9, len).trim();
			var chapterCount = 0;
			
			// Is it a search for Chapter titles?
			if (query.includes('!kktitles'))
			{
				searchForTitle = 1;
			}
			
			if (searchString !== "")
			{
				
				// Iterate through every chapter
				for (var iChapter in JSONObj.KK)
				{
					
					pageRes = "";
					var chapter = JSONObj.KK[iChapter].chap;
					
					// Check if looking through all chapters
					if (searchForTitle < 1)
					{
						// Iterate through pages
						for (var iPages in JSONObj.KK[iChapter].page)
						{
							var page = JSONObj.KK[iChapter].page[iPages].id;
							var text = JSONObj.KK[iChapter].page[iPages].str;

							if (page !== "0")
							{
								if (text.includes(searchString))
								{
									pageRes = pageRes.concat(page, ', ');
								}
							}
						}
						
						// Check Results
						if (pageRes !== "")
						{
							chapterCount = chapterCount + 1;
							results = results.concat('\nChapter ', chapter, ' Pages: ', pageRes);
						}
						
					}
					else
					{
						// Check only chapter 0 for title
						var text = JSONObj.KK[iChapter].page[0].str;
							
						if (text.includes(searchString))
						{
							results = results.concat('\nChapter ', chapter, ' : ', text);
							chapterCount = chapterCount + 1;
							if (chapterCount >= RESULTS_LIMIT)
							{
								var msgEmbed = new Discord.MessageEmbed();
								msgEmbed.addField('Results:', results, true);
								
								chapterCount = 0;
								results = '';
								embedPages.push(msgEmbed);
							}
						}
					}
				}
				
				// check if there are no results.
				if (results === "")
				{
					results = "Nothing found!";
				}
				
				// send the message
				var msg = "```Results for search: '" + searchString + "'";
				
				message.channel.send(paginationEmbed(msg, embedPages))
				.catch(err => console.error(err));
				console.log("Chapters Result count: " + chapterCount);
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
