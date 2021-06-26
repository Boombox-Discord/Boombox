[![Codacy Badge](https://app.codacy.com/project/badge/Grade/12aec9b09d3442db9d72b07f5988a8e0)](https://www.codacy.com/gh/Boombox-Discord/Boombox/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Boombox-Discord/Boombox&utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/11492/projects/14622/branches/276517/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11492&pid=14622&bid=276517)
[![DeepSource](https://deepsource.io/gh/Boombox-Discord/Boombox.svg/?label=active+issues&show_trend=true&token=aWXhwOLYoOTzXhDTc8mNzvRk)](https://deepsource.io/gh/Boombox-Discord/Boombox/?ref=repository-badge)
<a href="https://discord.com/api/oauth2/authorize?client_id=678819994250772480&permissions=36785152&scope=bot">
<img src="https://img.shields.io/badge/Invite-to%20your%20server-blue.svg?style=for-the-badge" alt="Invite to Server">
</a>
<a href="https://discord.gg/invite/HKnyEB9">
<img src="https://discordapp.com/api/guilds/770511689258237973/widget.png?style=shield" alt="Discord Server">
</a>

<p align="center">
    <a href="https://github.com/Boombox-Discord/Boombox">
        <img src="https://boomboxdiscord.dev/IMG/favicon.png" alt="Logo" width="80" height="80">
    </a>
    <h2 align="center">Boombox Music Bot</h2>
    <p align="center">
        A free and open source Discord music bot built on Discord.js
        <br>
        <a href="https://docs.boomboxdiscord.dev"><strong>Read the docs >></strong></a>
        <br>
        <br>
        <a href="https://discord.com/api/oauth2/authorize?client_id=678819994250772480&permissions=36785152&scope=bot">Invite to your server</a>
        ·
        <a href="https://github.com/Boombox-Discord/Boombox/issues">Report bug</a>
        ·
        <a href="https://github.com/Boombox-Discord/Boombox/issues"> Request Feature</a>
    </p>
</p>

<details open="open">
    <summery>Table of Contents</summery>
    <ol>
        <li>
            <a href="about-the-project">About The Project</a>
            <ul>
                <li><a href="#commands">Commands</a></li>
            </ul>
        </li>
        <li>
            <a href="#getting-started">Getting Started</a>
            <ul>
                <li><a href="#prerequisites">Prerequisites</a></li>
                <li><a href="#docker-install">Docker Install</a></li>
                <li><a href="#other-ways-to-install">Other Ways To Install</a></li>
            </ul>
        <li><a href="#license">License</a></li>
        <li><a href="#contact">Contact</a></li>
    </ol>
</details>

## About The Project

![gif of Boombox commands](https://boomboxdiscord.dev/IMG/Header.gif)

Boombox is a free and open source music bot for Discord built on Disocrd.js. Boombox uses Lavalink as it's music server and redis as it's database. All commands on Boombox are free and will always be free to use.

### Commands

Below is a table of all of Boombox's commands.

| Command Name | Usage                             | Description                                                                                                                  |
| ------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Play         | !play [song name or youtube link] | This will find the song from youtube and start playing. If there is something currently playing it will add it to the queue. |
| Skip         | !skip                             | Will skip the currently playing song.                                                                                        |
| Stop         | !stop                             | Will stop currently playing song and delete the queue.                                                                       |
| Now Playing  | !np                               | Displays what song is currently playing.                                                                                     |
| Lyrics       | !lyrics                           | Will get the currently playing songs lyrics. Lyrics are provided by Genius                                                   |
| Lyrics       | !lyrics [song name]               | Will get the lyrics for the provided song. Lyrics are provided by Genius                                                     |
| Queue        | !queue                            | Displays the first 20 songs in the queue.                                                                                    |
| Volume       | !volume                           | Set's the volume. Use a number between 1 and 100.                                                                            |
| Invite       | !invite                           | Sends an invite link for the bot.                                                                                            |
| Playlist     | !playlist [youtube playlist url]  | This command will add all songs from a youtube playlist into the queue.                                                      |
| Pause        | !pause                            | Will pause the song that is currently playing.                                                                               |
| Remove       | !remove [position in queue]       | Will remove that song from the queue.                                                                                        |
| Play File    | !playfile {attachment}            | Will play the attached song. File format needs to be either MP3 or WAV.                                                      |

## Getting Started

The eaisest way to start Boombox is by using docker. Docker will automaticly install Lavalink, Redis and build the image for the bot. To get started follow the instructions below.

### Prerequisites

Make sure you have Docker and docker-compose installed. You can find instructions on how to install <a href="https://docs.docker.com/docker-for-windows/install/">Docker here, </a> and <a href="https://docs.docker.com/compose/install/"> docker-compose here. </a>

### Docker Install

1.  Clone the repo

```sh
git clone https://github.com/Boombox-Discord/Boombox.git
```

2.  Rename config-example.json to config.json and insert your own values. Leave the redis, and statsD config fields as they are. Also rename lavalink-config-example.yml to lavalink-config.yml and replace password with something different. Make sure to put this password in the config.json file under lavalinkPassword.

3.  Run docker-compose

```sh
docker-compose up -d
```

### Other ways to install

If you would like to run Boombox using Node or using our Docker image then you can find more information about this on our <a href="https://docs.boomboxdiscord.dev/installing-boombox"> docs here. </a>

## License

Distributed under the AGPL-3.0 License. See `LICENSE` for more details.

## Contact

If you have any questions or would like to talk with other Boombox users you can join or <a href="https://discord.gg/invite/HKnyEB9"> Discord server here. </a>
