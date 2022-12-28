import { Client, Routes } from "discord.js"
import { ClientInstance, Config } from "../types"
import fs from 'fs'
import path from 'path'
import { REST } from "discord.js"

export default async(client: ClientInstance, config: Config) => {
    const rest = new REST({ version: '10' }).setToken(config.token)
    const commands: any[] = [];
    const cmdDir: string = path.join(__dirname, '../commands');
    fs.readdirSync(cmdDir).forEach(async dir => {
        const cmdSubDir: string = path.join(__dirname, `../commands/${dir}`);
        const cmdFile = fs.readdirSync(cmdSubDir).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
        for (const file of cmdFile) {
            const cmdFile = await import(`../commands/${dir}/${file}`);
            const filterCmd = cmdFile.default;
            commands.push(filterCmd);
            client.cmds?.set(filterCmd.name, filterCmd);
            console.log(`Loaded ${filterCmd.name} command`);
        };

        (async () => {
			try {
				await rest.put(
					config.guildID ?
					Routes.applicationGuildCommands(config.clientID, config.guildID) :
					Routes.applicationCommands(config.clientID), 
					{ body: commands }
				);
				// console.log('Slash Commands • Registered')
			} catch (error) {
				console.log(error);
			}
	    })();
    });
}