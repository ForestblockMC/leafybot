import {Client, Collection, GatewayIntentBits} from 'discord.js'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { ClientInstance } from './types'
import {DisTube} from 'distube'
import { SpotifyPlugin } from '@distube/spotify'
import { SoundCloudPlugin } from '@distube/soundcloud'
import { YtDlpPlugin } from '@distube/yt-dlp'

dotenv.config()

const config = {
    prefix: process.env.PREFIX ?? "!",
    token: process.env.TOKEN,
    clientID: process.env.CLIENT_ID,
    guildID: process.env.GUILD_ID ?? undefined,
    
}

const handlerDir = fs.readdirSync(path.join(__dirname, 'handler'))

const client: ClientInstance = (new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
    ],
})
    
)
client.cmds = new Collection()
client.events = new Collection()
client.voiceChannels = new Collection()
client.distube = new DisTube(client, {
    searchSongs: 5,
    searchCooldown: 10,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    leaveOnStop: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin
    ]
})

handlerDir.forEach(async (handler) => {
    (await import(`./handler/${handler}`)).default(client, config);
})

client.login(config.token)