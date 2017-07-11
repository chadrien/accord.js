import { Observable, createMessageStream } from 'accord/utils/rxjs';
import { Client, Message, StringResolvable, MessageOptions, User, GuildMember, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { Subscription } from 'rxjs/Subscription';

type Response = {
  content?: StringResolvable,
  options?: MessageOptions,
  recipient: TextChannel | DMChannel | GroupDMChannel,
};
type CommandData = { message: Message, commandPrefix: string };
type Command = (data$: Observable<CommandData>) => Observable<Response>;

/**
 * `bootstrapBot` is used to start your bot, though it does not log the bot in or anything extra,
 * this kind of things are to be done in userland© and should not be the responsibility of Accord.
 *
 * The `commandPrefix` is what allows you to have for example commands like this: !ping, where '!' is the command prefix.
 */
export function bootstrapBot(discordBot: Client, commands: Command[], commandPrefix: string = ''): Subscription {
  const message$ = createMessageStream(discordBot, commandPrefix);

  const response$: Observable<Response> = commands
    .reduce(
      (mergedResponse$, command) => mergedResponse$.merge(
        command(message$.map(message => ({ message, commandPrefix }))),
      ),
      Observable.empty<Response>(),
    );

  return response$.subscribe({
    next: ({ recipient, content, options }) => recipient.send(content, options)
      .catch(console.error),
    error: console.error,
    complete: () => console.log('Response stream completed'), // tslint:disable-line:no-console
  });
}

/**
 * The Responder is a simple function that takes in the original Message and the eventual captured parentheses
 * from the command RegExp, from which you can create a Response.
 *
 * You can also return a Promise in case your Response would need to be base on an HTTP request
 * result for example.
 */
type Responder = (message: Message, ...args: string[]) => Promise<Response> | Response;

/**
 * Super simple function to create a command either from a string, in which case it will internally
 * be transformed to a RegExp like this: 'ping' => /^ping$/; or a RegExp.
 *
 * Using a RegExp allows to have more control on what you want to match, and also allows you to
 * use capturing parentheses to then use parts of the command in the responder.
 */
export function createCommand(command: string | RegExp, responder: Responder): Command {
  const regExpToString = (regExp: RegExp) => regExp.toString().replace(/^\/|\/$/g, '');
  const commandString = typeof command === 'string' ? `^${command}$` : regExpToString(command);
  const getCommandRegExp = (commandPrefix: string) => new RegExp(commandString.replace(/^(\^?)(.*)$/, `$1${commandPrefix}$2`));

  return data$ => data$
    .filter(({ message, commandPrefix }) => getCommandRegExp(commandPrefix).test(message.content))
    .mergeMap(({ message, commandPrefix }) => {
      const responderArgs = (message.content.match(getCommandRegExp(commandPrefix)) || []).slice(1);
      return Promise.resolve()
        .then(() => responder.apply(null, [ message, ...responderArgs ]));
    });
}
