import { Command } from "../../types";

export default {
    name: "music",
    description: "Play music in your voice channel",
    options: [
        {
            name: "play",
            description: "Play a song",
            type: 1,
            options: [{
                name: "link",
                description: "The link to the song",
                type: 3,
                required: true
            }]
        },
        {
            name: 'loop',
            description: 'Loop the current song',
            type: 1,
            options: [{
                name: 'repeat',
                description: '(0) to disable, (1) to repeat the song, (2) to repeat the queue/playlist',
                type: 4,
                required: true,
                choices: [
                    {
                        name: "Disable", value: 0
                    },
                    {
                        name: "Repeat the song", value: 1
                    },
                    {
                        name: "Repeat the queue/playlist", value: 2
                    }
                ]
            }]
        },
        {
            name: "stop",
            description: "Stop the music",
            type: 1
        },
        {
            name: "skip",
            description: "Skip the current song",
            type: 1
        },
        {
            name: "queue",
            description: "Show the current queue",
            type: 1
        },
        {
            name: "pause",
            description: "Pause the current song",
            type: 1
        },
        {
            name: "resume",
            description: "Resume the current song",
            type: 1
        },
        {
            name: "join",
            description: "Join the voice channel",
            type: 1
        },
        {
            name: "leave",
            description: "Leave the voice channel",
            type: 1
        }
    ],
    async run(client, interaction) {
        const {options, member, guild} = interaction
        const commands = options.getSubcommand()

        const voiceChannel = interaction.guild?.members.cache.filter((member) => member.voice.channel).get(member?.user.id as string)?.voice.channel;
        if (!voiceChannel) return interaction.reply({content: "You are currently not in a voice channel", ephemeral: true});

        switch (commands) {
            case "play": {
                const link = interaction.options.getString("link");
                if (!link) return interaction.reply({content: "You must provide a link", ephemeral: true});

                client.distube?.play(voiceChannel, link, {
                    member: member as any,
                    textChannel: interaction.channel as any,
                })
            }
            break;
            case "loop": {
                const repeat = interaction.options.getInteger("repeat");
                if (!repeat) return interaction.reply({content: "You must provide a number", ephemeral: true});

                const queue = client.distube?.getQueue(interaction)
                if (!queue) return interaction.reply({content: "There is no song being played", ephemeral: true});

                const mode = repeat === 0 ? "off" : repeat === 1 ? "song" : "queue"

                queue.setRepeatMode(repeat)
                interaction.reply({content: `Repeat mode set to ${mode}`, ephemeral: true})

            }
            break;
            case "stop": {
                const queue = client.distube?.getQueue(interaction)
                if (!queue) return interaction.reply({content: "There is no song being played", ephemeral: true});
                queue.stop()
                interaction.reply({content: "Stopped the music", ephemeral: true})
            }
            break;
            case "skip": {
                const queue = client.distube?.getQueue(interaction)
                if (!queue) return interaction.reply({content: "There is no song being played", ephemeral: true});
                queue.skip()
                interaction.reply({content: "Skipped the song", ephemeral: true})
            }
            break;
            case "pause": {
                const queue = client.distube?.getQueue(interaction)
                if (!queue) return interaction.reply({content: "There is no song being played", ephemeral: true});
                if (queue.paused) return interaction.reply({content: "The music is already paused", ephemeral: true});
                queue.pause()
                interaction.reply({content: "Paused the music", ephemeral: true})
            }
            break;
            case "resume": {
                const queue = client.distube?.getQueue(interaction)
                if (!queue) return interaction.reply({content: "There is no song being played", ephemeral: true});
                if (!queue.paused) return interaction.reply({content: "The music is not paused", ephemeral: true});
                queue.resume()
                interaction.reply({content: "Resumed the music", ephemeral: true})
            }
            break;
            case "queue": {
                const queue = client.distube?.getQueue(interaction)
                if (!queue) return interaction.reply({content: "There is no song being played", ephemeral: true});
                const songs = queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
                interaction.reply({content: `Current queue:\n${songs}`, ephemeral: true})
            }
            break;
            case "join": {
                if (client.distube?.voices.get(guild?.id as string)) return interaction.reply({content: "I am already in a voice channel", ephemeral: true});

                if (voiceChannel) {
                    client.distube?.voices.join(voiceChannel)
                    interaction.reply({content: "Joined the voice channel", ephemeral: true})
                }
            }
            break;
            case "leave": {
                if (!client.distube?.voices.get(guild?.id as string)) return interaction.reply({content: "I am not in a voice channel", ephemeral: true});

                if (voiceChannel) {
                    client.distube?.voices.leave(voiceChannel)
                    interaction.reply({content: "Left the voice channel", ephemeral: true})
                }
            }
            break;
        
        }
    }
} as Command