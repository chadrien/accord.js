import { Observable, createMessageStream } from 'accord/utils/rxjs';
import { Client, Message, StringResolvable, MessageOptions, User, GuildMember, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { Subscription } from 'rxjs/Subscription';

type Response = {
  content?: StringResolvable,
  options?: MessageOptions,
  recipient: TextChannel | DMChannel | GroupDMChannel,
};
type Command = (data$: Observable<{ message: Message, commandPrefix: string }>) => Observable<Response>;

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

type Responder = (message: Message, ...args: string[]) => Response;

export function createCommand(command: string | RegExp, responder: Responder): Command {
  const regExpToString = (regExp: RegExp) => regExp.toString().replace(/^\/|\/$/g, '');
  const commandString = typeof command === 'string' ? `^${command}$` : regExpToString(command);
  const getCommandRegExp = (commandPrefix: string) => new RegExp(commandString.replace(/^(\^?)(.*)$/, `$1${commandPrefix}$2`));

  return data$ => data$
    .filter(({ message, commandPrefix }) => getCommandRegExp(commandPrefix).test(message.content))
    .map(({ message, commandPrefix }) => {
      const responderArgs = (message.content.match(getCommandRegExp(commandPrefix)) || []).slice(1);
      return responder.apply(null, [ message, ...responderArgs ]);
    });
}
