const Discord = require('discord.js');
const client = new Discord.Client();
var fs = require("fs");
var json = fs.readFileSync("./KanoKariOCR.json", {"encoding": "utf-8"});
var JSONObj = JSON.parse(json);

client.once('ready', () => {
	//console.log(json);
	console.log('Ready!');
});

client.on('message', message => {
	// received a request
	var query = message.content;
	if (query.substr(0, 3) == "!kk")
	{

		// !help command
		if (query == '!kkhelp') {

		message.channel.send("```Use '!kksearch text_to_search'  to query.\nNOTE: Use ONLY lowercase and AVOID using special characters. Only special character allowed is an Apostrophe ( ' ).\nExample: !kksearch sumi-chan's```")
		.catch(err => console.error(err));

		}
		else if (query.includes('!kksearch')) {

		var results = "";
		var pageRes = "";
		var len = query.length - 9;
		var searchString = query.substr(9, len).trim();
		var chapterCount = 0;
		
		if (searchString !== "") {
			
			// Iterate through every chapter
			for (var iChapter in JSONObj.KK) {
				
				pageRes = "";
				var chapter = JSONObj.KK[iChapter].chap;
				
				// Iterate through pages
				for (var iPages in JSONObj.KK[iChapter].page) {
				
					var page = JSONObj.KK[iChapter].page[iPages].id;
					var text = JSONObj.KK[iChapter].page[iPages].str;
					//console.log(page);
					//console.log(text);
					
					if (text.includes(searchString))
					{
						if (page !== "0")
						{
							pageRes = pageRes.concat(page, ', ');
						}
						else
						{
							pageRes = pageRes.concat(text);
						}
					}
				}
				
				//console.log("Page Results: [" + pageRes + "]");
				if (pageRes !== "")
				{
					results = results.concat('\nChapter ', chapter, ' Pages: ', pageRes);
					chapterCount = chapterCount + 1;
				}
				
			}
			// check if there are no results.
			if (results === "") {
				results = "Nothing found!";
			}
			
			// send the message
			message.channel.send("```Results for search: '" + searchString + "'\nResult count: " + chapterCount + "\n" + results + "```")
			.catch(err => console.error(err));
			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
