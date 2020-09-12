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
		var searchString = query.substr(10, len).trim();
		var chapterCount = 0;
		
		if (searchString !== "") {
			
			// Iterate through every chapter
			for (var i in JSONObj.KK) {
				
				pageRes = "";
				var chapter = JSONObj.KK[i].chap;
				//console.log("Chapter: [" + chapter + "]");
				
				// Iterate through pages
				for (var ii in JSONObj.KK[i].page) {
				
					var page = JSONObj.KK[i].page[ii].id;
					var text = JSONObj.KK[i].page[ii].str;
					//console.log(page);
					//console.log(text);
					
					if (text.includes(searchString))
					{
						pageRes = pageRes.concat(page, ', ');
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
			message.channel.send("```Results for search: '" + searchString + "'\nResult count: " + chapterCount + "\n" +results + "```")
			.catch(err => console.error(err));

			}
		}
	}
});

client.login(process.env.BOT_TOKEN);
