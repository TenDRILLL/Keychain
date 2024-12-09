import Command from "../classes/Command";
import {writeDatabase} from "../automation/Database";
import {generateKey} from "openpgp";

export class Createkey extends Command {
    constructor() {
        super("createkey");
    }

    cmdRun(interaction, bot): void {
        let userID = interaction.member?.user?.id ?? interaction.user?.id;
        if(!userID) {
            interaction.reply({content: "Your userID couldn't be parsed, please contact Ten.", ephemeral: true});
            return;
        }

        generateKey({
            type: "ecc",
            rsaBits: 2048,
            userIDs: [
                {
                    name: `${(interaction.member?.user?.globalName ?? interaction.user?.globalName)} (@${interaction.member?.user?.username ?? interaction.user?.username})`,
                    email: `${userID}@discord`,
                    comment: `Created by Keychain on ${new Date().getUTCDate()}`
                }
            ],
        }).then((out)=>{
            const {privateKey, publicKey} = out;
            writeDatabase(userID, publicKey);
            interaction.reply({
                content: `A new **Public Key** has been created and saved.
If you previously had one, it has been overwritten.

Your **Private Key** is displayed below.
It is **__required__** to decrypt messages addressed to you.
Save it now as you will not be able to recover it later.

-# The **Private Key** has been delivered through Discord's servers and services.
-# If this is an issue, you can use </importkey:1315025371275722774> to import your own **Public Key**.
\`\`\`${privateKey}\`\`\``,
                ephemeral: true,
                /*attachments: [
                    new Attachment()
                ]*/
            });
        });
    }
}