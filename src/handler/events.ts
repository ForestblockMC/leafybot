import { Client } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { Config } from '../types'

export default async (client: Client | any, config: Config) => {
    const eventList: string[] = [];
    const eventDir: string = path.join(__dirname, '../events');
    console.log('Loading events...');
    fs.readdirSync(eventDir).filter(
        (file: string) => file.endsWith('.js') || file.endsWith('.ts')
    ).forEach(async events => {
        await import(`../events/${events}`).then((event: any) => {
            event.default.execute(client)
            console.log(`Loaded ${event.default.name} event`);
        });
        eventList.push(events);
    });
    console.log('Loaded all events!');
}