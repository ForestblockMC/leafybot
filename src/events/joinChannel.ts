import { ChannelType, Client, GuildMember, VoiceState } from "discord.js";
import { ClientInstance } from "../types";

export default {
    name: "Voice Channel Generation",
    async execute(client: ClientInstance) {
        client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
            const { member, guild } = newState;
            const oldChannel = oldState.channel;
            const newChannel = newState.channel;
            const channel = guild.channels.cache.find((channel) => channel.id === "1035697632955342868");
    
            if (member?.user.bot) return;
    
            if (oldChannel !== newChannel && newChannel?.id === channel?.id) {
                const vc = await guild.channels.create({
                    type: ChannelType.GuildVoice,
                    name: member?.displayName + "'s Channel",
                    parent: newChannel?.parent,
                    permissionOverwrites: [
                        {
                            id: member?.id as string,
                            allow: ["Connect"]
                        },
                        {
                            id: guild.id,
                            deny: ["Connect"]
                        }
                    ]
                })
    
                client.voiceChannels?.set(member?.id as string, vc.id);
                await newChannel?.permissionOverwrites.edit(member as GuildMember, {Connect: false})
                setTimeout(async () => {
                    newChannel?.permissionOverwrites.delete(member as GuildMember)
                }, 5 * 1000)
    
                setTimeout(async () => {
                    member?.voice.setChannel(vc)
                }, 500)
            }

            const ownedChannel = client.voiceChannels?.get(member?.id as string);
            if (ownedChannel && oldChannel?.id === ownedChannel && (!newChannel || newChannel?.id !== ownedChannel)) {
                oldChannel?.delete().catch(() => {});
                client.voiceChannels?.delete(member?.id as string);
            }
        })
    }
}