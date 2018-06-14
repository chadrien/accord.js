import { Observable } from 'accord.js/utils/rxjs';
import { Client, Message, StringResolvable, MessageOptions, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { Subscription } from 'rxjs/Subscription';
/**
 * `bootstrapBot` is used to start your bot, though it does not log the bot in or anything extra,
 * this kind of things are to be done in userland© and should not be the responsibility of Accord.
 *
 * The `commandPrefix` is what allows you to have for example commands like this: !ping, where '!' is the command prefix.
 */
export declare function bootstrapBot(discordBot: Client, commands: Command[], commandPrefix?: string): Subscription;
/**
 * The Responder is a simple function that takes in the original Message and the eventual captured parentheses
 * from the command RegExp, from which you can create a Response.
 *
 * You can also return a Promise in case your Response would need to be base on an HTTP request
 * result for example.
 */
export declare type Responder = (message: Message, ...args: string[]) => undefined | Promise<Response> | Response;
export declare type Response = {
    content?: StringResolvable;
    options?: MessageOptions;
    recipient: TextChannel | DMChannel | GroupDMChannel;
};
export declare type CommandData = {
    message: Message;
    commandPrefix: string;
};
export declare type Command = (data$: Observable<CommandData>) => Observable<Response>;
/**
 * Super simple function to create a command either from a string, in which case it will internally
 * be transformed to a RegExp like this: 'ping' => /^ping$/; or a RegExp.
 *
 * Using a RegExp allows to have more control on what you want to match, and also allows you to
 * use capturing parentheses to then use parts of the command in the responder.
 */
export declare function createCommand(command: string | RegExp, responder: Responder): Command;
