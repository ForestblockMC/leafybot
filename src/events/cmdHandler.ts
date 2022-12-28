import { ChatInputCommandInteraction, Events, Interaction, MessageInteraction } from "discord.js";
import { ClientInstance, Command } from "../types";

export default {
    name: "Command Handler",
    async execute(client: ClientInstance) {
        client.on('interactionCreate', async (interaction:Interaction) => {
            if (!interaction.isCommand()) return;
            if (interaction.user.bot) return;
            const cmd = client.cmds?.get(interaction.commandName);
            if (!cmd) return;
            if (cmd.devOnly && !devs.includes(interaction!.user?.id)) return

            try {
                cmd.run(client, interaction as ChatInputCommandInteraction)
            } catch (e) {
                console.log(e)
            }
            
        })
    }
}

const devs = ["401844809385508903"]