import Command from "../classes/Command";
import {readDatabase} from "../automation/Database";

export class Getkey extends Command {
    constructor() {
        super("getkey");
    }

    cmdRun(interaction, bot): void {
        let userID = interaction.data.options![0].value;
        if(!userID) {
            interaction.reply({content: "Your userID couldn't be parsed, please contact Ten.", ephemeral: true});
            return;
        }

        readDatabase(userID).then(x => {
            if(x === null){
                interaction.reply({
                    content: "This user has not imported a key yet, please ask them to do so.",
                    ephemeral: true
                });
                return;
            }
            interaction.reply({
                content: `${interaction.data.options![2]?.value ? `<@${interaction.data.options![0].value}>
`:""}\`\`\`${x}\`\`\``,
                ephemeral: true
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