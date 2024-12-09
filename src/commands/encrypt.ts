import Command from "../classes/Command";
import {readDatabase} from "../automation/Database";
import {readKey,encrypt,createMessage} from "openpgp";
import {ActionRow, Client, Modal, TextInput, TextInputStyle} from "discord-http-interactions";

export class Encrypt extends Command {
    constructor() {
        super("encrypt");
    }

    cmdRun(interaction, bot: Client): void {
        let userID = interaction.data.options![0].value;
        let mention = interaction.data.options && interaction.data.options.length === 2 && interaction.data.options[1]["value"] ? interaction.data.options[1]["value"] : false;
        if(!userID) {
            interaction.reply({content: "Your userID couldn't be parsed, please contact Ten.", ephemeral: true});
            return;
        }
        interaction.modal(new Modal().setTitle("Encrypt a Message.").setCustomId(`encrypt-${userID}-${mention}`).setComponents([
            new ActionRow().setComponents([
                new TextInput().setStyle(TextInputStyle.Paragraph).setLabel("Message").setCustomId("encrypt-text").setRequired(true)
            ])
        ]))
    }

    msRun(interaction, bot){
        let text;
        if(interaction.data.components && interaction.data.components[0] && interaction.data.components[0].components && interaction.data.components[0].components[0]){
            //@ts-ignore
            text = interaction.data.components[0].components[0].value;
        }
        if(!text) return;
        let [name, userID, mention] = interaction.customId.split("-");
        readDatabase(userID).then(x => {
            if(x === null){
                interaction.reply({
                    content: "This user has not imported a key yet, please ask them to do so.",
                    ephemeral: true
                });
                return;
            }
            readKey({armoredKey: x as string}).then(key =>{
                createMessage({text}).then(message => {
                    encrypt({
                        message,
                        encryptionKeys: key
                    }).then(enc => {
                        interaction.reply({
                            content: `${mention === "true" ? `<@${userID}>
`:""}\`\`\`${enc}\`\`\``,
                            ephemeral: false
                        });
                    });
                });
            });
            return;
        }).catch(e => {
            console.error(e);
            interaction.reply({
                content: "DB error, contact Ten.",
                ephemeral: true
            });
        });
    }
}