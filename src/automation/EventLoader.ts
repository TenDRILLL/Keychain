import {
    readdirSync
} from "node:fs";
import Event from "../classes/Event";

export function loadEvents(bot){
    console.log("Loading events...");
    const eventFiles = readdirSync(`${__dirname}/../events`).filter(x => x.endsWith(".js"));
    const eventTable: Object = {};
    const promises: Array<Promise<boolean>> = [];
    eventFiles.forEach(name => {
        promises.push(new Promise(res => {
            import(`../events/${name}`).then(file => {
                const ev = new(<any>Object.entries(file)[0][1]);
                if(!(ev instanceof Event)) return;
                bot.on(ev.getName(), (...args) => ev.exec(bot, ...args));
                eventTable[ev.getName()] = {loaded: true};
                res(true);
            }).catch(e => res(false));
        }));
    });
    Promise.all(promises).then(x => {
        console.table(eventTable);
    });
}