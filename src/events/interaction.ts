import Event from "../classes/Event";
import {getCommands} from "../automation/CommandLoader";
import {InteractionType} from "discord-http-interactions";
import {ApplicationCommandInteraction} from "discord-http-interactions/built/structures/ApplicationCommandInteraction";
import {MessageComponentInteraction} from "discord-http-interactions/built/structures/MessageComponentInteraction";
import {ApplicationCommandAutocompleteInteraction} from "discord-http-interactions/built/structures/ApplicationCommandAutocompleteInteraction";
import {ModalSubmitInteraction} from "discord-http-interactions/built/structures/ModalSubmitInteraction";
export class Interaction extends Event {
    constructor() {
        super("interaction");
    }
    exec(bot,ic){
        const commands = getCommands();
        if(commands.size === 0) return; //This shouldn't really happen, but there's a slight possibility when the bot is starting.

        if(ic.type === InteractionType.ApplicationCommand && commands.has(ic.commandName.toLowerCase())){
            commands.get(ic.commandName.toLowerCase())!.cmdRun(ic as ApplicationCommandInteraction, bot);
        } else if(ic.type === InteractionType.MessageComponent && commands.has(ic.customId.toLowerCase().split("-")[0])){
            commands.get(ic.customId.toLowerCase().split("-")[0])!.mcRun(ic as MessageComponentInteraction, bot);
        } else if(ic.type === InteractionType.ApplicationCommandAutocomplete && commands.has(ic.commandName.toLowerCase())){
            commands.get(ic.commandName.toLowerCase())!.acRun(ic as ApplicationCommandAutocompleteInteraction, bot);
        } else if(ic.type === InteractionType.ModalSubmit && commands.has(ic.customId.toLowerCase().split("-")[0])){
            commands.get(ic.customId.toLowerCase().split("-")[0])!.msRun(ic as ModalSubmitInteraction, bot);
        } else {
            ic.reply({content: "Not implemented yet."}).catch(e => console.log(e)); //This catches in case a command is missing, to avoid the request not being handled.
        }
    }
}