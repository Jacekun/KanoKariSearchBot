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
const cmdPrefix = ";k";
const cmdSearch = ';ks';
const cmdTitle = ';kt';
const cmdHelp = ';khelp';
const cmdExtra = ";kextra";
const EMBEDColor = 0x155A1B;

console.log('Loaded all dependencies!');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	// received a request
	var query = message.content;
	if (query.substr(0, cmdPrefix.length) == cmdPrefix)
	{

		// !help command
		if (query == cmdHelp)
		{
		var textHelp = `**${cmdSearch}** *text_to_search*  -> to query for texts.\n**${cmdSearch}** *[sumi, chizuru, ruka, mami]* cover *[colored]* -> displays the pages of the covers\n**${cmdTitle}** *text_to_search* -> to find chapter whose title includes the query.\n\nNOTE: Use ONLY lowercase and AVOID using special characters.\nOnly special character allowed is an Apostrophe ( ' ) and Hyphen ( - ).\n\nExample: **${cmdSearch}** *sumi-chan's*\n\n**${cmdHelp}** will show this message.\n**${cmdExtra}** -> will show extra chapters.`;
		const helpEmbed = new MessageEmbed()
			.setDescription(textHelp)
			.setColor(EMBEDColor)
			.setTitle("How to Use?")
			.addField("Link:", "[Click to View Project on Github](https://github.com/Jacekun/KanoKariSearchBot)");
			
		message.channel.send('', helpEmbed)
		.catch(err => console.error(err));

		}
		// Search for text or chapter titles
		else if ((query.substr(0, cmdSearch.length)===cmdSearch) || (query.substr(0, cmdTitle.length)===cmdTitle) || (query === cmdExtra))
		{
			// Setup variables
			var searchForTitle = 0;
			var results = "";
			var pageRes = "";
			var len = query.length - cmdSearch.length;
			var searchString = query.substr(cmdSearch.length, len).trim().toLowerCase();
			var chapterCount = 0;
			
			embedPages = []; // reset embedPages obj array
			
			// Search only on titles...Useful for chapter title search
			if ((query.substr(0, cmdTitle.length) === cmdTitle) || (query === cmdExtra))
			{
				searchForTitle = 1;
				len = query.length - cmdTitle.length;
				searchString = query.substr(cmdTitle.length, len).trim().toLowerCase();
			}
			
			// Remove newlines
			searchString = searchString.replace(/\n/g, " ");
			console.log(`User: ${message.author.username} (${message.author}), Query: [ ${query} ]`);
			
			// Declare the title (desc) of the search results
			var desc = `Search results for query : **${searchString}**`;
			
			// Create Regex Exp
			var searchRegex = new RegExp(searchString, "i");
			console.log(`Regex Exp: ${searchRegex}`);
			
			if (searchString !== "" && searchString.length > 2)
			{
				
				// Iterate through every chapter
				for (var iChapter in JSONObj.KK)
				{
					
					pageRes = "";
					var chapter = JSONObj.KK[iChapter].chap;
					var link = JSONObj.KK[iChapter].link;
					
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
								if (searchRegex.test(text))
								{
									var pageLink = `[${page}](${link}/${page})`;
									pageRes = pageRes.concat(pageLink, ', ');
								}
							}
						}
						
						// Check All pages Results
						if (pageRes !== "")
						{
							// remove last comma
							pageRes = pageRes.slice(0, -2);
							// Push the result to obj array
							results = `[Ch. ${chapter}](${link}) | Page: ${pageRes}`;
							embedPages.push({ word: results });
							chapterCount = chapterCount + 1;
						}
						
					}
					else
					{
						// Check only chapter 0 for title
						var text = JSONObj.KK[iChapter].page[0].str;
						
						if (query === cmdExtra)
						{
							if (chapter.includes("."))
							{
								results = `[Ch. ${chapter}](${link}) : ${text}`;
								embedPages.push({ word: results });
								chapterCount = chapterCount + 1;
							}
							desc = `**Extra chapters** [ Count: **${chapterCount}** ]`;
						}
						else
						{
							var textLower = text.toLowerCase().replace(",", "");
							if (textLower.includes(searchString))
							{
								results = `[Ch. ${chapter}](${link}) : ${text}`;
								embedPages.push({ word: results });
								chapterCount = chapterCount + 1;
							}

						}
					}
				}
				
				// check if there are results
				if (chapterCount > 0)
				{
					// make the embed
					let currentPage = 0;
					
					const embeds = generatePaginatedMsg(embedPages, desc);
					console.log(`Length of embed (page count): ${embeds.length}\nTotal chapter results: ${chapterCount}`);
					
					// send message
					const queueEmbed = await message.channel.send(pageString(currentPage+1, embeds.length, chapterCount), embeds[currentPage]);
					
					// Add paginator, if it exceeds 1 page
					if (chapterCount > 6)
					{
						await queueEmbed.react('⬅️');
						await queueEmbed.react('➡️');
					}
					await queueEmbed.react('❌');
					
					// add reaction methods, and reaction collector
					const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
					const collector = queueEmbed.createReactionCollector(filter);
					
					collector.on('collect', async (reaction, user) =>
					{
						// Add paginator, if it exceeds 1 page
						if (chapterCount > 6)
						{
							if (reaction.emoji.name === '⬅️')
							{
								if (currentPage !== 0)
								{
									--currentPage;
									queueEmbed.edit(pageString(currentPage+1, embeds.length, chapterCount), embeds[currentPage]);
								}
								reaction.users.remove(user);
							}
							else if (reaction.emoji.name === '➡️')
							{
								if (currentPage < embeds.length-1)
								{
									currentPage++;
									queueEmbed.edit(pageString(currentPage+1, embeds.length, chapterCount), embeds[currentPage]);
								}
								reaction.users.remove(user);
							}
							else if (reaction.emoji.name === '❌')
							{
								collector.stop();
								console.log("Deleted the Results embeds!");
								await queueEmbed.delete().catch(err => console.error(err));
							}
						}
						else
						{
							if (reaction.emoji.name === '❌')
							{
								collector.stop();
								console.log("Deleted the Results embeds!");
								await queueEmbed.delete().catch(err => console.error(err));
							}
						}
					} );
				}
				else
				{
					// no results
					console.log(`No results for query: ${searchString}`);
					const noresEmbed = new MessageEmbed()
						.setDescription(`No results found for query: [ **${searchString} ]**`)
						.setColor(EMBEDColor);
					message.channel.send('', noresEmbed)
					.catch(err => console.error(err));
				}
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);

function generatePaginatedMsg(queue, desc)
{
	var maxPP = 5;
	if (queue.length == 6)
	{
		maxPP = 6;
	}
	const embeds = 	[];
	let k = maxPP;
	for (let i=0; i<queue.length; i += maxPP)
	{
		const current = queue.slice(i, k);
		let j = i;
		k += maxPP;
		const info = current.map(obj => obj.word).join('\n');
		const embed = new MessageEmbed()
			.setDescription(`${desc}\n${info}`)
			.setColor(EMBEDColor);
		embeds.push(embed);
	}
	return embeds;
}

function pageString(current, max, chapterCount)
{
	return `**Current Page : ${current}/${max}** - ( **${chapterCount}** )`;
}