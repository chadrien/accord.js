import { Observable } from 'accord/utils/rxjs';
import { Client, Message, StringResolvable, MessageOptions, User, GuildMember, TextChannel, DMChannel, GroupDMChannel } from 'discord.js';
import { Subscription } from 'rxjs/Subscription';

type Response = {
  content?: StringResolvable,
  options?: MessageOptions,
  recipient: User | GuildMember | TextChannel | DMChannel | GroupDMChannel,
};

export default (discordBot: Client, commandPrefix?: string): Subscription => {

  const message$ = createMessageStream(discordBot, commandPrefix);

  const response$: Observable<Response> = message$
    .map(message => ({
      content: 'PONG',
      recipient: message.channel,
    }));

  return response$.subscribe({
    next: ({ recipient, content, options }) => recipient.send(content, options),
    error: console.error,
    complete: () => console.log('Response stream completed'), // tslint:disable-line:no-console
  });

};

export function createMessageStream(discordBot: Client, commandPrefix?: string) {
  return Observable.fromEvent<Message>(discordBot, 'message')
    .filter(({ content }) => content.startsWith(commandPrefix || ''))
    .filter(({ author: { bot } }) => !bot);
}
