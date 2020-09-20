console.log('Getting discord.js....');
const Discord = require('discord.js');
const client = new Discord.Client();

console.log('Getting fs....');
var fs = require("fs");

console.log('Getting discord.js-paginationembed....');
const Pagination = require('discord-paginationembed');

console.log('Reading JSON file...');
var json = fs.readFileSync("./KanoKariOCR.json", {"encoding": "utf-8"});

console.log('Making JSON Object...');
var JSONObj = JSON.parse(json);

var embedPages = [];

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
		if (query == ';khelp')
		{

		message.channel.send("```Use ';ks text_to_search'  to query for texts.\nUse ';kt text_to_search'  to find chapter whose title includes the query.\nNOTE: Use ONLY lowercase and AVOID using special characters.\nOnly special character allowed is an Apostrophe ( ' ).\nExample: ;ks sumi-chan's\n\n;khelp will show this message.```")
		.catch(err => console.error(err));

		}
		// Search for text or chapter titles
		else if (query.includes(';ks') || query.includes(';kt`'))
		{
			// Setup variables
			var searchForTitle = 0;
			var results = "";
			var pageRes = "";
			var len = query.length - 3;
			var searchString = query.substr(3, len).trim().toLowerCase();
			var chapterCount = 0;
			
			embedPages = [];
			
			// Is it a search for Chapter titles?
			if (query.includes(';kt'))
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
								var textLower = text.toLowerCase();
								if (textLower.includes(searchString))
								{
									pageRes = pageRes.concat(page, ', ');
								}
							}
						}
						
						// Check Results
						if (pageRes !== "")
						{
							pageRes = pageRes.slice(0, -2); 
							results = 'Ch. ' + chapter + ' | Pages: ' + pageRes;
							embedPages.push({ word: results });
							chapterCount = chapterCount + 1;
						}
						
					}
					else
					{
						// Check only chapter 0 for title
						var text = JSONObj.KK[iChapter].page[0].str;
						var textLower = text.toLowerCase();
						if (textLower.includes(searchString))
						{
							results = 'Ch. ' + chapter + ' : ' + text;
							embedPages.push({ word: results });
							chapterCount = chapterCount + 1;
						}
					}
				}
				
				// check if there are no results.
				if (chapterCount > 0)
				{
					// send the message
					var msg = "Results for search: >" + searchString + "<";
					const FieldsEmbed = new Pagination.FieldsEmbed()
					  .setArray(embedPages)
					  .setAuthorizedUsers([message.author.id])
					  .setChannel(message.channel)
					  .setElementsPerPage(6)
					  // Initial page on deploy
					  .setPage(1)
					  .setPageIndicator(true)
					  .formatField('Chapters: ', el => el.word);
					 
					FieldsEmbed.embed
					  .setColor(0xFF00AE)
					  .setDescription(msg);
					 
					FieldsEmbed.build().catch(err => console.error(err));
					
				}
				else
				{
					message.channel.send("```css\nNo results found! for query: >" + searchString + "<```")
					.catch(err => console.error(err));
				}
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
