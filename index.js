console.log('Getting discord.js....');
const Discord = require('discord.js');
const client = new Discord.Client();

console.log('Creating MessageEmbed....');
const { MessageEmbed } = require('discord.js');

console.log('Getting fs....');
var fs = require("fs");

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

client.on('message', async message => {
	// received a request
	var query = message.content;
	if (query.substr(0, 2) == ";k")
	{

		// !help command
		if (query == cmdHelp)
		{

		message.channel.send("```" + cmdSearch + " 'text_to_search'  -> to query for texts.\n" + cmdSearch + " [sumi, chizuru, ruka, mami] cover [colored] -> displays the pages of the covers\n" + cmdTitle + " 'text_to_search' -> to find chapter whose title includes the query.\n\nNOTE: Use ONLY lowercase and AVOID using special characters.\nOnly special character allowed is an Apostrophe ( ' ) and Hyphen ( - ).\n\nExample: > " + cmdSearch + " sumi-chan's <\n\n" + cmdHelp + " will show this message.```")
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
			
			if (searchString !== "" && searchString.length > 3)
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
						var textLower = text.toLowerCase().replace(",", "");
						if (textLower.includes(searchString))
						{
							results = 'Ch. ' + chapter + ' : ' + text;
							embedPages.push({ word: results });
							chapterCount = chapterCount + 1;
						}
					}
				}
				
				// check if there are results
				if (chapterCount > 0)
				{
					// send the message
					let currentPage = 0;
					const embeds = generatePaginatedMsg(embedPages, searchString);
					console.log(`Length of embed (page count): ${embeds.length}\nTotal chapter results: ${chapterCount}`);
					
					const queueEmbed = await message.channel.send(`Current Page : ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
					await queueEmbed.react('⬅️');
					await queueEmbed.react('➡️');
					await queueEmbed.react('❌');
					
					const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
					const collector = queueEmbed.createReactionCollector(filter);
					
					collector.on('collect', async (reaction, user) =>
					{
						if (reaction.emoji.name === '⬅️')
						{
							if (currentPage !== 0)
							{
								--currentPage;
								queueEmbed.edit(`Current Page : ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
							}
						}
						else if (reaction.emoji.name === '➡️')
						{
							if (currentPage < embeds.length-1)
							{
								currentPage++;
								queueEmbed.edit(`Current Page : ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
							}
						}
						else
						{
							collector.stop();
							console.log("Deleted the Results embeds!");
							await queueEmbed.delete();
						}
						reaction.users.remove(user);
					} );
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

function generatePaginatedMsg(queue, query)
{
	const embeds = 	[];
	let k = 5;
	for (let i=0; i<queue.length; i += 5)
	{
		const current = queue.slice(i, k);
		let j = i;
		k += 5;
		const info = current.map(obj => obj.word).join('\n');
		const embed = new MessageEmbed()
			.setDescription(`Search results for query : **${query}**\n${info}`)
			.setColor(0x226BDD);
		embeds.push(embed);
	}
	return embeds;
}