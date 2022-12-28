import { ChatInputCommandInteraction, Client, Collection, PermissionsBitField } from "discord.js"
import { DisTube } from "distube"

export interface Config {
    token: string
    prefix: string
    clientID: string
    guildID: string
}

export interface ClientInstance extends Client {
    cmds?: Collection<string, any>
    events?: Collection<string, any>
    voiceChannels?: Collection<string, any>
    distube?: DisTube
}

export interface Command { //Command Type for creation commands
    name: string;
    description: string;
    options?: any[];
    defaultPermission?: boolean;
    default_member_permissions?: PermissionsBitField;
    testOnly?: boolean;
    devOnly?: boolean;
    cooldown?: number;
    run: (client: ClientInstance, interaction: ChatInputCommandInteraction) => Promise<void>;
}