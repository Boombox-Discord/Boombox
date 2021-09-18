import { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js';
import { Player, Track } from 'erela.js';
import { Event } from '../types/Event';

export default class TrackStart extends Event {
    run = async (player: Player, track: Track): Promise<void> => {
        const redisReply = await this.client.redis.get(`guild_${player.guild}`);
        const serverQueue = JSON.parse(redisReply);
        if (!player.textChannel) return;
        const channel = this.client.channels.cache.get(player.textChannel) as TextChannel;
        if (!channel || !this.client.hasPermissionsSend(channel)) return;
        const newQueueEmbed = new MessageEmbed()
            .setColor('#ed1c24')
            .setTitle(track.title)
            .setURL(track.uri)
            .setAuthor(this.client.user.username, this.client.user.avatarURL())
            .setDescription(
                `[${track.title}](${track.uri}) is now playing and is number 1 in the queue!`
            )
            .setThumbnail(track.thumbnail);

        const Buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('stop')
                .setLabel('⏹️')
                .setStyle('SECONDARY'),

            new MessageButton()
                .setCustomId('pause')
                .setLabel('⏯️')
                .setStyle('SECONDARY'),

            new MessageButton()
                .setCustomId('skip')
                .setLabel('⏭️')
                .setStyle('SECONDARY')
        );

        const message = await channel.send({
            embeds: [newQueueEmbed],
            components: [Buttons],
        });

        const collector = message.createMessageComponentCollector({
            time: serverQueue.songs[0].duration,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'stop') {
                if (!player) {
                    return collector.stop();
                }
                serverQueue.songs = [];
                await clientRedis.set(
                    `guild_${i.guildId}`,
                    JSON.stringify(serverQueue)
                );
                player.stop();
                i.reply('Stoping the music!');
                return collector.stop();
            }
            if (i.customId === 'pause') {
                if (!player) {
                    return collector.stop();
                }
                player.pause(!player.paused);
                const pauseText = player.paused ? 'paused' : 'unpaused';
                i.reply(`I have ${pauseText} the music!`);
            } else if (i.customId === 'skip') {
                if (!player) {
                    return collector.stop();
                }
                player.stop();
                i.reply('I have skipped to the next song!');
                if (serverQueue.songs.length === 1) {
                    return collector.stop();
                }
            }
        });
    }
}