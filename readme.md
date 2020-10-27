<h1>Boombox</h1>

<h4>A Discord.js bot for playing music from Discord.<h4>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5cdfe7f2879e4af4a04dc41bd0cbefc2)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=AjayACST/Boombox&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/11492/projects/14394/branches/266677/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11492&pid=14394&bid=266677)
<a href="https://discord.com/api/oauth2/authorize?client_id=678819994250772480&permissions=36785152&scope=bot">
    <img src="https://img.shields.io/badge/Invite-to%20your%20server-blue.svg?style=for-the-badge" alt="Invite to Server">
  </a>

## About

Boombox is a free, open source, music bot for Discord. It is built on JavaScript and uses Discord.js, and ytdl. 

## Commands

The defualt prefix is "!" but this can be changed in the config.json file if you wish to self host the bot.

| Command | Usage | Description |
| ------------- |:------------- | :----- |
| Play | !play [song name or youtube link] | This will find the song from youtube and start playing it. If there is something currently playing it will add it to the queue. |
| Skip | !skip | Will skip the currenty playing song. |
| Stop | !stop | Will stop current playing music and delete the queue. |
| Now Playing | !np | Displays what song is currently playing. |
| Queue | !queue | Displays current songs queue. |
| Volume | !volume | Set's the volume. Use a number between 1 and 5. | 

## Join The Community

Want to submit bug reports, feature requests, our just chat with our coumminty?

You can join us on our [Official Discord Server.](https://discord.gg/HKnyEB9)

## Insatll and Running

To install run the commands below.

`npm install` and `node bot.js`

Docker support is going to be added at a later date.