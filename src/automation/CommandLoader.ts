import {
    readdirSync
} from "fs";
import Command from "../classes/Command";

const commands: Map<String,Command> = new Map();
export function getCommands(){
    return commands;
}
export function loadCommands(){
    console.log("Loading commands...");
    const commandFiles = readdirSync(`${__dirname}/../commands`).filter(x => x.endsWith(".js"));
    const commandTable: Object = {};
    const promises: Array<Promise<boolean>> = [];
    commandFiles.forEach(name => {
        promises.push(new Promise(res => {
            import(`../commands/${name}`).then(file => {
                const js = new(<any>Object.entries(file)[0][1]);
                if(!(js instanceof Command)) return;
                const name = js.getName();
                commands.set(name,js);
                commandTable[name] = {loaded: true};
                res(true);
            }).catch(e => res(false));
        }));
    });
    Promise.all(promises).then(x => {
        console.table(commandTable);
        console.log("\nStartup complete.");
    });
}