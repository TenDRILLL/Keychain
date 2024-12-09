import Command from "../classes/Command";
import {readDatabase} from "../automation/Database";
import {readPrivateKey, readMessage,decrypt} from "openpgp";
import {Client} from "discord-http-interactions";

export class Decrypt extends Command {
    constructor() {
        super("decrypt");
    }

    cmdRun(interaction, bot: Client): void {
        let userID = interaction.member?.user?.id ?? interaction.user?.id;
        if(!userID) {
            interaction.reply({content: "Your userID couldn't be parsed, please contact Ten.", ephemeral: true});
            return;
        }
        //@ts-ignore
        let id = Array.from(interaction.data.resolved?.messages.keys())[0];
        let message = interaction.data.resolved?.messages.get(id as string);
        if(!("content" in message)) {
            interaction.reply({content: "Message data couldn't be retrieved.", ephemeral: true});
            return;
        }
        readDatabase(userID+"-p").then(x => {
            if(x === null){
                interaction.reply({
                    content: "You haven't imported a **Private Key**, decryption failed.",
                    ephemeral: true
                });
                return;
            }

            readPrivateKey({armoredKey: x as string}).then(key => {
               if(!message?.content) return;
               readMessage({armoredMessage: message.content.split("```")[1]}).then(msg =>{
                   decrypt({message: msg, decryptionKeys: key}).then(data => {
                       let {data: decrypted} = data;
                       interaction.reply({
                           content: `Decrypted message below:
\`\`\`${decrypted}\`\`\``,
                           ephemeral: true
                       });
                   });
               });
            });
        }).catch(e => {
            console.error(e);
            interaction.reply({
                content: "DB error, contact Ten.",
                ephemeral: true
            });
        });
    }
}