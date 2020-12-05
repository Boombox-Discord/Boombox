<h1>Boombox</h1>

<h4>A Discord.js bot for playing music from Discord.<h4>

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/12aec9b09d3442db9d72b07f5988a8e0)](https://www.codacy.com/gh/Boombox-Discord/Boombox/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Boombox-Discord/Boombox&utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/11492/projects/14622/branches/276517/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11492&pid=14622&bid=276517)
[![DeepSource](https://deepsource.io/gh/Boombox-Discord/Boombox.svg/?label=active+issues&show_trend=true)](https://deepsource.io/gh/Boombox-Discord/Boombox/?ref=repository-badge)
<a href="https://discord.com/api/oauth2/authorize?client_id=678819994250772480&permissions=36785152&scope=bot">
<img src="https://img.shields.io/badge/Invite-to%20your%20server-blue.svg?style=for-the-badge" alt="Invite to Server">
</a>
<a href="https://discord.gg/invite/HKnyEB9">
<img src="https://discordapp.com/api/guilds/770511689258237973/widget.png?style=shield" alt="Discord Server">
</a>

## About

Boombox is a free, open source, music bot for Discord. It is built on JavaScript and uses Discord.js, and ytdl.

## Commands

The defualt prefix is "!" but this can be changed in the config.json file if you wish to self host the bot.

| Command     | Usage                             | Description                                                                                                                     |
| ----------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| Play        | !play [song name or youtube link] | This will find the song from youtube and start playing it. If there is something currently playing it will add it to the queue. |
| Skip        | !skip                             | Will skip the currently playing song.                                                                                           |
| Stop        | !stop                             | Will stop current playing music and delete the queue.                                                                           |
| Now Playing | !np                               | Displays what song is currently playing.                                                                                        | . |
| Lyrics      | !lyrics                           | Will get the currently playing songs lyrics. Lyrics are provided by Genius.                                                     |
| Lyrics      | !lyrics [song name]               | Will get the lyrics for the provided song. Lyrics are provided by Genius.                                                       |
| Queue       | !queue                            | Displays current songs queue.                                                                                                   |
| Volume      | !volume                           | Set's the volume. Use a number between 1 and 5.                                                                                 |
| Invite      | !invite                           | Sends an invite link for the bot.                                                                                               |
| Playlist    | !playlist [youtube playlist url]  | This command will add all songs from a youtube playlist into the queue.                                                         |

![GIF of commands](https://boombox.quirky.codes/IMG/Header.gif)

## Join The Community

Want to submit bug reports, feature requests, our just chat with our coumminty?

You can join us on our [Official Discord Server.](https://discord.gg/HKnyEB9)

# Install and Running

If you would like to add the bot to your Discord server [click here.](https://discord.com/api/oauth2/authorize?client_id=678819994250772480&permissions=36785152&scope=bot) If you would like to self-host the bot keep reading.

To install run the commands below.

# Docker

First, make a copy of config-example.json and call it config.json. Enter your own discord token, youtube api token, invite link, Genius API Client Access token, and error channel. You can also change the prefix here if you wish.

## Docker Compose

Use docker-compose if you don't already have a Graphite and statsD server. To start the bot simply run 

```
docker-compose up -d
```

#Docker Image

If you already have a statsd and Graphite server setup you can just the pull the image and run from that. Make sure to enter the correct ip address and port for statsD in the config.json file. To run the contianer run

```
docker run -d \
-it \
--name boombox \
-v config.json:/usr/src/app boomboxdev/boombox-bot
```


# Local install

First, make a copy of config-example.json and call it config.json. Enter your own discord token, youtube api token, invite link, statsD IP address and port, and Genius API Client Access token. You can also change the prefix here if you wish.

If you don't already have Graphite and statsD installed you can install it into a docker container with

```
docker run -d \
--name graphite \
--restart=always \
-p 80:80 \
-p 8080:8080 \
-p 2003-2004:2003-2004 \
-p 2023-2024:2023-2024 \
-p 8125:8125/udp \
-p 8126:8126 \
graphiteapp/graphite-statsd
```

This will install everything you need for statsd and graphite. You can view the graphite interface at http://<containerip>:8080

Note: statsD and graphite is **NOT** required and the bot will function without to not use it just leave the statsD port and IP address the same as it is in the config-example.json file.

Now run
```
npm install

node bot.js
```