export default abstract class Event {
    private readonly name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    getName(): string {return this.name;}
    exec(bot, ...args: unknown[]): void {return console.log(`${this.name} ran, but exec method wasn't overridden.`);}
}