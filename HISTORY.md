# KanoKari Search Discord Bot

# Version 1.11.0
  **Changes to Bot:**
  - Shortened Descriptions on MessageEmbeds.

  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 001, 002** -> Title, Contents, Link, and Cover info.

# Version 1.10.0
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 161** -> Title, Contents, Link, and Cover info.
  - Added **Extra Ch. 5.5** -> Title, Contents, and Link.
  - Completed **Extra Ch. 10.5** -> Contents.
  - Added various tags to pages. -> Ch. **3**, **152-157**.
  - Fixed spelling mistakes.
  - Cleaned placeholders.

# Version 1.9.0
  **Changes to [KanoKariOCR.json] File:**
  - Added **Extra Ch. 10.5, 14.5, 23.5, 69.5** -> Title, Contents, Link, and Cover info.
  - Cleaned most placeholders.

# Version 1.8.0
  **Changes to Bot:**
  - Remove **'No Result found'** message after **4 seconds**.
  - Changed **'Search Result'** and **'No Result Found'** messages.
  - Moved *MessageEmbeds* **'Descriptions'** to **'Title'**.
  - Set **'Chapter per Page'** results from **5** to **7**.
  
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 103 - 118** -> Contents.
  - Changes in **tags**.

# Version 1.7.0
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 3 - 27** -> Contents.
  - Added some cover info, and tags.
  - Minor Cleanups.

# Version 1.6.0
  **Changes to Bot:**
  - Changed **searching** from **'.include'** -> **'Regex Expression'**.
    - This makes the search results more accurate.
	- For example: searching for **tea** returns **'darjeeling tea'**, but not **'teacher'**.
  - Moved **Current Page** text to be included in **MessageEmbed**.
  
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 28 - 48** -> Contents.
  - Added **Extra Ch.: 32.5, 32.6, 41.5** -> Contents.
  - Removed [ **'** ] from words, *except in possessive words*.
  
# Version 1.5.0
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 160.5** -> Title, Contents, Link, and Cover info.
  - Added **Ch. 68 - 83** -> Contents.
  - Added some missing texts.
  - Fixed Spelling mistakes.

# Version 1.4.0
  **Changes to Bot:**
  - Updated **'help'** message.
  
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 84 - 102, 119 - 137** -> Contents.
  - Fixed Spelling mistakes.

# Version 1.3.1
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 138 - 153** -> Contents.
  - Added **Ch. 160** -> Title, Contents, Link, and Cover info.

# Version 1.3.0
  **Changes to Bot:**
  - Added Chapter result count on Paginator.
  - Removed Next/Prev reactions for single page results.
	
  **Changes to [KanoKariOCR.json] File:**
  - Fixed spelling mistakes.

# Version 1.2.2
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 49 - 66** -> Contents.
  - Added **Ch. 51 - 52, 54 - 66** -> Cover info.

# Version 1.2.1
  **Changes to Bot:**
  - Added **;kextra** to **help** command.
	
  **Changes to [KanoKariOCR.json] File:**
  - Added **Ch. 159** -> Title, Contents, Link, and Cover info.
  - Completed **Ch. 67** -> Contents and Cover info.

# Version 1.2.0
  **Changes to Bot:**
  - Added new command -> **;kextra**.
    - Shows all **.x** (extra) chapters, *where x is a number*.
  - If chapter results is 6, don't add additional page.
	
  **Changes to [KanoKariOCR.json] File:**
  - Added missing texts for cover infos.
    - Chapters: 6-8, 12-17
  - Added **Ch. 67** -> Incomplete contents.

# Version 1.1.1
  **Changes to Bot:**
  - Added some comments.
	
  **Changes to [KanoKariOCR.json] File:**
  - Added missing texts for cover infos.
  - Added **Ch. 158** -> Title, Contents, Link, and Cover info.
	
# Version 1.1.0
  **Changes to Bot:**
  - Reduced allowed word lengths to **[3]**.
  - Replace newlines / line breaks with *whitespace*.
  - Change **["No Result found"]** message to a *MessageEmbed*.
  - Added *links* to **[Chapter Pages]**.
  - Changed *MessageEmbed* Background color to *Dark Green*.

  **Changes to [KanoKariOCR.json] File:**
  - Added chapter links to : Ch. 001 - 157 (*Skipped Chapters with more than 1 fansub source*).
  - Added cover info to chapters:
    - 001 - 005, 137,

# Version 1.0.0
  *For history purposes*
  
  - **First stable version of the bot**:
    - Search for more than 3 letters, in the text.
    - Search for titles and covers.
    - Added chapter links to result.
    - Paginated embeds.
	
  - **Chapters included**:
	- **[Titles]** : **Ch. 001-157**,
    - **[Complete texts]** : **Ch. 154-157**,
    - **[Cover characters]** : **Ch. 139-157**