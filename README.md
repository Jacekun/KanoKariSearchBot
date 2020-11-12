# KanoKariSearchBot

Discord Bot, written in Javascript. <br>
Searches for text in the Manga series [KanoKari](https://anilist.co/manga/99943/Kanojo-Okarishimasu). <br>
Finds where the text query is located, and returns the Chapter and Page. <br>

**Written in:** Discordjs v12.3.1. <br>
**For manga series:** [Kanojo, Okarishimasu](https://anilist.co/manga/99943/Kanojo-Okarishimasu).

*View Project History here* : [**HISTORY**](/HISTORY.md)

# String rules to follow
*when adding to [KanoKariOCR.json](/KanoKariOCR.json)*

- All **lowercase** only, *except for Chapter title*.
- *Chapter Page* with id **0** is the title of the chapter.
- **No special characters**, *aside from*:
  - "*single quotation*" ( **'** ).
  - "*hyphen*" ( **-** ).
- Simplify lines like "*Whaaaat*" to just "*what*".
- No line breaks. All strings must be separated by **spaces only**.
- Top most array is the latest chapter.

# Credits

**NOTE: Credits goes first to fansubs and scanlators who worked on the series.**

## Transcription :
- Me
	- Ch. 154 - 161
	- Extra Ch. 23.5, 160.5
- [lapis (provider)](https://discordhub.com/profile/377748624337272836)
	- Ch. 001 - 153
	- Extra Ch. 69.5
- [guardianofbooks](https://www.reddit.com/u/guardianofbooks)
    - Ch. 161
	
## Editing (Formatting and Adding to [KanoKariOCR.json](/KanoKariOCR.json) file) :
- Me
	- Ch. 003 - 160
	- Extra Ch. 23.5, 69.5, 160.5
	
## Proofreading:
- Me
- [Cloak](https://www.reddit.com/u/CloakedUnderShadows)
- [guardianofbooks](https://www.reddit.com/u/guardianofbooks)