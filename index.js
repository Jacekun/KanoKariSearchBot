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

console.log('Creating variables...');
var embedPages = [];
const cmdSearch = ';ks';
const cmdTitle = ';kt';
const cmdHelp = ';khelp';

console.log('Loaded all dependencies!');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// received a request
	var query = message.content;
	if (query.substr(0, 2) == ";k")
	{

		// !help command
		if (query == cmdHelp)
		{

		message.channel.send("```" + cmdSearch + " 'text_to_search'  -> to query for texts.\n" + cmdTitle + " 'text_to_search' -> to find chapter whose title includes the query.\n" + cmdSearch + " [sumi, chizuru, ruka, mami] cover [colored] -> displays the pages of the covers\n\nNOTE: Use ONLY lowercase and AVOID using special characters.\nOnly special character allowed is an Apostrophe ( ' ).\n\nExample: > " + cmdSearch + " sumi-chan's <\n\n" + cmdHelp + " will show this message.```")
		.catch(err => console.error(err));

		}
		// Search for text or chapter titles
		else if (query.includes(cmdSearch) || query.includes(cmdTitle))
		{
			// Setup variables
			var searchForTitle = 0;
			var results = "";
			var pageRes = "";
			var len = query.length - cmdSearch.length;
			var searchString = query.substr(cmdSearch.length, len).trim().toLowerCase();
			var chapterCount = 0;
			
			embedPages = [];
			
			// Is it a search for Chapter titles?
			if (query.includes(cmdTitle))
			{
				searchForTitle = 1;
				len = query.length - cmdTitle.length;
				searchString = query.substr(cmdTitle.length, len).trim().toLowerCase();
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
							pageRes = pageRes.slice(0, -2); 
							results = 'Ch. ' + chapter + ' | Page: ' + pageRes;
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
					// sort array
					embedPages.sort(function(a, b) {
						return a.word - b.word;
					});
					// send the message
					var msg = "Results for search: > " + searchString + " <";
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
					message.channel.send("```css\nNo results found! for query: > " + searchString + " <```")
					.catch(err => console.error(err));
				}
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
