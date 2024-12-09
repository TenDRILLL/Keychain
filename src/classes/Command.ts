import {Message} from "discord-http-interactions/built/structures/Message";
import {ApplicationCommandInteraction} from "discord-http-interactions/built/structures/ApplicationCommandInteraction";
import {MessageComponentInteraction} from "discord-http-interactions/built/structures/MessageComponentInteraction";
import {
    ApplicationCommandAutocompleteInteraction
} from "discord-http-interactions/built/structures/ApplicationCommandAutocompleteInteraction";
import {ModalSubmitInteraction} from "discord-http-interactions/built/structures/ModalSubmitInteraction";


export default abstract class Command {
    private readonly name: string;

    protected constructor(name: string){
        this.name = name;
    }

    getName(): string { return this.name; }

    run(message: Message, bot){ return console.log(`${this.name} ran, but run method wasn't overridden.`); }
    cmdRun(interaction: ApplicationCommandInteraction, bot){ return console.log(`${this.name} ran, but cmdRun method wasn't overridden.`); }
    mcRun(interaction: MessageComponentInteraction, bot){ return console.log(`${this.name} ran, but mcRun method wasn't overridden.`); }
    acRun(interaction: ApplicationCommandAutocompleteInteraction, bot){ return console.log(`${this.name} ran, but acRun method wasn't overridden.`); }
    msRun(interaction: ModalSubmitInteraction, bot){ return console.log(`${this.name} ran, but msRun method wasn't overridden.`); }
}