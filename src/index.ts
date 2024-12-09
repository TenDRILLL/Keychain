import {Client} from "discord-http-interactions";
import "dotenv/config";
import {loadEvents} from "./automation/EventLoader";
import {loadCommands} from "./automation/CommandLoader";
import {initDatabase} from "./automation/Database";

const bot = new Client({
    token: process.env.DISCORD_TOKEN as string,
    publicKey: process.env.DISCORD_PUBLIC_KEY as string,
    port: parseInt(process.env.PORT as string),
    endpoint: process.env.ENDPOINT as string,
    additionalEndpoints: [
        {
            name: "site",
            method: "GET",
            endpoint: "/"
        }
    ]
});

loadEvents(bot);
loadCommands();
initDatabase();

bot.on("site", (req, res)=>{
    res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_ID}`);
});

bot.login();

//updateCmds();

/*function updateCmds(){
    bot.registerCommands(
        process.env.DISCORD_ID as string,
        [
            {

                name: "Decrypt",
                type: ApplicationCommandType.Message,
                contexts: [0,1,2]
            },
            {
                name: "getkey",
                description: "Get the user's Public Key.",
                options: [
                    {
                        name: "user",
                        description: "User whose Public Key you want.",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ],
                contexts: [0,1,2]
            },
            {
                name: "createkey",
                description: "Create a new Public and Private Key.",
                contexts: [0,1,2]
            },
            {
                name: "importkey",
                description: "Import your Public or Private PGP Key.",
                contexts: [0,1,2]
            }, {
                name: "encrypt",
                description: "Encrypt a Message to a Recipient.",
                options: [
                    {
                        name: "user",
                        description: "Recipient of the Message.",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    },
                    {
                        name: "mention",
                        description: "Should the user be mentioned with the message?",
                        type: ApplicationCommandOptionType.Boolean,
                        required: false
                    }
                ],
                contexts: [0,1,2]
            }
        ]).then(console.log).catch(console.error);
}*/