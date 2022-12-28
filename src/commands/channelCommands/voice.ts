import { ChatInputCommandInteraction, CommandInteraction, InteractionType, MessageInteraction } from "discord.js";
import { ClientInstance, Command } from "../../types";

export default {
    name: "voice",
    description: "Configure and Control your voice channel",
    options: [
        {
            name: "invite",
            description: "Invite a user to your voice channel",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user",
                    type: 6,
                    required: true
                }
            ],
        },
        {
            name: "kick",
            description: "Kick a user",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "The user",
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: "privacy",
            description: "Set the privacy of your voice channel",
            type: 1,
            options: [
                {
                    name: "open",
                    description: "The privacy",
                    type: 5,
                    required: true
                }
            ]
        }
    ],
    async run(client: ClientInstance, interaction: ChatInputCommandInteraction) {
        const {options, member, guild} = interaction;
        const command = options.getSubcommand();

        const voiceChannel = interaction.guild?.members.cache.filter((member) => member.voice.channel).get(member?.user.id as string)?.voice.channel;
        if (!voiceChannel) return interaction.reply({content: "You are currently not in a voice channel", ephemeral: true});
        const ownedChannel = client.voiceChannels?.get(member?.user.id as string);
        if (!ownedChannel) return interaction.reply({content: "You are currently not the owner of this channel", ephemeral: true});

        switch (command) {
            case "invite": {
                const user = interaction.options.getUser("user");
                if (!user) return interaction.reply({content: "You must provide a user", ephemeral: true}); 
                if (user.bot) return interaction.reply({content: "You cannot invite a bot", ephemeral: true});
                if (user.id === member?.user.id) return interaction.reply({content: "You cannot invite yourself", ephemeral: true});

                const memberInv = guild?.members.cache.get(user.id);
                if (!memberInv) return interaction.reply({content: "The user is not in the server", ephemeral: true});

                const channel = guild?.channels.cache.get(ownedChannel);
                if (!channel) return interaction.reply({content: "The channel does not exist", ephemeral: true});

                await channel.edit({
                    permissionOverwrites: [
                        {
                            id: user.id,
                            allow: ["Connect"]
                        }
                    ]
                })

                interaction.reply({content: `Successfully invited ${user.username} to your channel`, ephemeral: true});
                user.send({content: `You have been invited to ${member?.user.username}'s channel`})
                    .catch(() => interaction.followUp({content: `Failed to send a message to ${user.username}`, ephemeral: true}));

            };
            break;
            case "kick": {
                const user = interaction.options.getUser("user");
                if (!user) return interaction.reply({content: "You must provide a user", ephemeral: true});
                if (user.bot) return interaction.reply({content: "You cannot kick a bot", ephemeral: true});
                if (user.id === member?.user.id) return interaction.reply({content: "You cannot kick yourself", ephemeral: true});

                const memberKick = guild?.members.cache.get(user.id);
                if (!memberKick) return interaction.reply({content: "The user is not in the server", ephemeral: true});

                const channel = guild?.channels.cache.get(ownedChannel);
                if (!channel) return interaction.reply({content: "The channel does not exist", ephemeral: true});

                await channel.edit({
                    permissionOverwrites: [
                        {
                            id: user.id,
                            deny: ["Connect"]
                        }
                    ]
                })

                interaction.reply({content: `Successfully kicked ${user.username} from your channel`, ephemeral: true});
                user.send({content: `You have been kicked from ${member?.user.username}'s channel`})
                    .catch(() => interaction.followUp({content: `Failed to send a message to ${user.username}`, ephemeral: true}));
            };
            break;
            case "privacy": {
                const open = interaction.options.getBoolean("open");
                if (open === undefined) return interaction.reply({content: "You must provide a privacy", ephemeral: true});

                const channel = guild?.channels.cache.get(ownedChannel);
                if (!channel) return interaction.reply({content: "The channel does not exist", ephemeral: true});

                if (open) {
                    await channel.edit({
                        permissionOverwrites: [
                            {
                                id: guild?.id as string,
                                allow: ["Connect"]
                            }
                        ]
                    })

                    interaction.reply({content: "Successfully set your channel to public", ephemeral: true});
                } else {
                    await channel.edit({
                        permissionOverwrites: [
                            {
                                id: guild?.id as string,
                                deny: ["Connect"]
                            }
                        ]
                    })

                    interaction.reply({content: "Successfully set your channel to private", ephemeral: true});
                }
            }
            break;
        }

    }
} as Command