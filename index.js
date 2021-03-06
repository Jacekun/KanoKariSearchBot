console.log('Getting discord.js....');
const Discord = require('discord.js');
const client = new Discord.Client();
//const config = require("./config.json"); // for DEBUGGING

console.log('Creating MessageEmbed....');
const { MessageEmbed } = require('discord.js');

console.log('Getting fs....');
const fs = require("fs");

console.log('Reading JSON file...');
const json = fs.readFileSync("./KanoKariOCR.json", {"encoding": "utf-8"});

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
const MaxChPage = 7;

console.log('Loaded all dependencies!');

client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({
        status: 'Use ;khelp to View Help Message!',
        activity: {
            name: ';khelp',
            type: 'LISTENING'
        }
	});
	console.log('Status set!');
});

client.on('message', async message => {
	// received a request
	let query = message.content;
	if (query.substr(0, cmdPrefix.length) == cmdPrefix)
	{

		// !help command
		if (query == cmdHelp)
		{
		const textHelp = `**${cmdSearch}** *text_to_search*  -> to query for texts.\n**${cmdSearch}** *[sumi, chizuru, ruka, mami]* cover *[colored]* -> displays the pages of the covers\n**${cmdTitle}** *text_to_search* -> to find chapter whose title includes the query.\n\nNOTE: Use ONLY lowercase and AVOID using special characters.\nOnly special character allowed is an Apostrophe ( ' ) and Hyphen ( - ).\n\nExample: **${cmdSearch}** *sumi-chan's*\n\n**${cmdHelp}** will show this message.\n**${cmdExtra}** -> will show extra chapters.`;
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
			let searchForTitle = 0;
			let results = "";
			let pageRes = "";
			let len = query.length - cmdSearch.length;
			let searchString = query.substr(cmdSearch.length, len).trim().toLowerCase();
			let chapterCount = 0;
			let chapter = null;
			let link = null;
			let page = null;
			let text = null;
			let pageLink = null;
			
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
			let desc = `"${searchString}" search results`;
			
			// Create Regex Exp
			let searchRegex = new RegExp(`\\b${searchString}\\b`, "i");
			console.log(`Regex Exp: ${searchRegex}`);
			
			if (searchString !== "" && searchString.length > 2)
			{
				
				// Iterate through every chapter
				for (let iChapter in JSONObj.KK)
				{
					
					pageRes = "";
					chapter = JSONObj.KK[iChapter].chap;
					link = JSONObj.KK[iChapter].link;
					
					// Check if looking through all chapters
					if (searchForTitle < 1)
					{
						// Iterate through pages
						for (let iPages in JSONObj.KK[iChapter].page)
						{
							page = JSONObj.KK[iChapter].page[iPages].id;
							text = JSONObj.KK[iChapter].page[iPages].str;

							if (page !== "0")
							{
								if (searchRegex.test(text))
								{
									pageLink = `[${page}](${link}/${page})`;
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
						text = JSONObj.KK[iChapter].page[0].str;
						
						if (query === cmdExtra)
						{
							if (chapter.includes("."))
							{
								results = `[Ch. ${chapter}](${link}) : ${text}`;
								embedPages.push({ word: results });
								chapterCount = chapterCount + 1;
							}
							desc = `Extra chapters`;
						}
						else
						{
							let textLower = text.toLowerCase().replace(",", "");
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
					
					const embeds = generatePaginatedMsg(embedPages);
					console.log(`Length of embed (page count): ${embeds.length}\nTotal chapter results: ${chapterCount}`);
					
					// set title (Search Query + Page Count)
					let title = pageString(currentPage+1, embeds.length, chapterCount, desc);
					
					// change MessageEmbed Title
					const editEmbed = new MessageEmbed(embeds[currentPage])
						.setTitle(title);

					// send message
					const queueEmbed = await message.channel.send("", editEmbed);
					
					// Add paginator, if it exceeds 1 page
					if (chapterCount > MaxChPage + 1)
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
						if (chapterCount > MaxChPage + 1)
						{
							if (reaction.emoji.name === '⬅️')
							{
								if (currentPage !== 0)
								{
									--currentPage;
									title = pageString(currentPage+1, embeds.length, chapterCount, desc);
									const editEmbed = new MessageEmbed(embeds[currentPage])
										.setTitle(title);
									queueEmbed.edit("", editEmbed);
								}
								reaction.users.remove(user);
							}
							else if (reaction.emoji.name === '➡️')
							{
								if (currentPage < embeds.length-1)
								{
									currentPage++;
									title = pageString(currentPage+1, embeds.length, chapterCount, desc);
									const editEmbed = new MessageEmbed(embeds[currentPage])
										.setTitle(title);
									queueEmbed.edit("", editEmbed);
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
					let textNoResult = `Search for "${searchString}" returned no results!`;
					console.log(textNoResult);
					const noresEmbed = new MessageEmbed()
						.setTitle(textNoResult)
						.setColor(EMBEDColor);
					message.channel.send('', noresEmbed)
					.then(msg => {
						msg.delete({ timeout: 4000 })
					})
					.catch(err => console.error(err));
				}
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
//client.login(config.token); // For DEBUGGING

function generatePaginatedMsg(queue)
{
	let maxPP = MaxChPage;
	if (queue.length == MaxChPage+1)
	{
		maxPP = MaxChPage + 1;
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
			.setDescription(`${info}`)
			.setColor(EMBEDColor);
		embeds.push(embed);
	}
	return embeds;
}

function pageString(current, max, chapterCount, desc)
{
	return `${desc} | Page : ${current} / ${max} - (${chapterCount})`;
}