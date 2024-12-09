import Command from "../classes/Command";
import {ActionRow, Modal, TextInput, TextInputStyle} from "discord-http-interactions";
import {writeDatabase} from "../automation/Database";

export class Importkey extends Command {
    constructor() {
        super("importkey");
    }

    cmdRun(interaction, bot): void {
        const modal = new Modal()
            .setCustomId("importkey")
            .setTitle("Import Key")
            .setComponents([
                new ActionRow()
                    .setComponents([
                        new TextInput()
                            .setCustomId("importkey-key")
                            .setLabel("Key (WARN: OVERWRITES PRIVATE/PUBLIC)")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    ])
            ])
        interaction.modal(modal);
        return;
    }

    msRun(interaction, bot): void {
        let userID = interaction.member?.user?.id ?? interaction.user?.id;
        if(!userID) {
            interaction.reply({content: "Your userID couldn't be parsed, please contact Ten.", ephemeral: true});
            return;
        }
        let key;
        if(interaction.data.components && interaction.data.components[0] && interaction.data.components[0].components && interaction.data.components[0].components[0]){
            key = (interaction.data.components[0].components[0] as TextInput).value;
        }
        if(key.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----") && key.endsWith("-----END PGP PUBLIC KEY BLOCK-----")){
            writeDatabase(userID,key);
            interaction.reply({content: "Your **Public Key** has been saved.", ephemeral: true});
            return;
        } else if(key.startsWith("-----BEGIN PGP PRIVATE KEY BLOCK-----") && key.endsWith("-----END PGP PRIVATE KEY BLOCK-----")){
            writeDatabase(userID+"-p",key);
            interaction.reply({content: "Your **Private Key** has been saved.", ephemeral: true});
            return;
        } else {
            interaction.reply({content: "Your key doesn't appear to be a valid PGP Public Key.", ephemeral: true});
            return;
        }
    }
}